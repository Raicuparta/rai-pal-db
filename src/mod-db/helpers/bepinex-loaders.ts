import { DOMParser } from "linkedom";
import { isArchitecture } from "../mod.ts";
import type {
	Architecture,
	ModBase,
	ModDownload,
	OperatingSystem,
	UnityBackend,
} from "../mod.ts";
import { token } from "../replacement-tokens.ts";
import { createOctokit } from "./github.ts";
import {
	bepinexConfigFolder,
	bepinexFolder,
	bepinexLogOutputPath,
} from "./bepinex-paths.ts";

type ModInstall = NonNullable<ModBase["install"]>;
type ModInstallExtract = NonNullable<ModInstall["extract"]>[number];

type Platform = {
	os: OperatingSystem;
	architecture: Architecture;
};

type BackendSpec = {
	idPart: string;
	windowsDoorstopConfig: string;
	linuxEnvironment: NonNullable<ModBase["gameEnvironment"]>;
	extraExtract: ModInstallExtract[];
};

const backendSpecs = {
	Mono: {
		idPart: "mono",
		windowsDoorstopConfig: `[General]
enabled=true
target_assembly=${token.MaybeWineRoot}${bepinexFolder}/core/BepInEx.Preloader.dll
redirect_output_log=false
ignore_disable_switch=true

[UnityMono]
dll_search_path_override=
`,
		linuxEnvironment: {
			DOORSTOP_ENABLED: "1",
			DOORSTOP_TARGET_ASSEMBLY: `${bepinexFolder}/core/BepInEx.Preloader.dll`,
			DOORSTOP_IGNORE_DISABLED_ENV: "0",
			LD_LIBRARY_PATH: `${token.GameExecutableFolderPath}:\${LD_LIBRARY_PATH}`,
			LD_PRELOAD: `libdoorstop.so:\${LD_PRELOAD}`,
		},
		extraExtract: [],
	},
	Il2Cpp: {
		idPart: "il2cpp",
		windowsDoorstopConfig: `[General]
enabled = true
target_assembly = ${token.MaybeWineRoot}${bepinexFolder}/core/BepInEx.Unity.IL2CPP.dll
redirect_output_log = false
boot_config_override =
ignore_disable_switch = true

[Il2Cpp]
coreclr_path = ${token.GameInstalledModsPath}/bepinex/dotnet/coreclr.dll
corlib_dir = ${token.GameInstalledModsPath}/bepinex/dotnet
`,
		linuxEnvironment: {
			DOORSTOP_ENABLED: "1",
			DOORSTOP_TARGET_ASSEMBLY: `${bepinexFolder}/core/BepInEx.Unity.IL2CPP.dll`,
			DOORSTOP_CLR_RUNTIME_CORECLR_PATH: `${token.GameInstalledModsPath}/bepinex/dotnet/libcoreclr.so`,
			DOORSTOP_CLR_CORLIB_DIR: `${token.GameInstalledModsPath}/bepinex/dotnet`,
			DOORSTOP_IGNORE_DISABLED_ENV: "0",
			LD_LIBRARY_PATH: `${token.GameExecutableFolderPath}:${token.GameInstalledModsPath}/bepinex/dotnet:\${LD_LIBRARY_PATH}`,
			LD_PRELOAD: `libdoorstop.so:\${LD_PRELOAD}`,
		},
		extraExtract: [
			{
				source: "dotnet",
				destination: `${token.GameInstalledModsPath}/bepinex/dotnet`,
			},
		],
	},
} satisfies Record<UnityBackend, BackendSpec>;

type PlatformDownload = {
	timestamp: number;
	download: ModDownload;
};

type PlatformDownloads = Partial<
	Record<OperatingSystem, Partial<Record<Architecture, PlatformDownload>>>
>;

function setLatest(
	target: PlatformDownloads,
	platform: Platform,
	timestamp: number,
	download: ModDownload,
) {
	const byArchitecture = target[platform.os] ?? {};
	const existing = byArchitecture[platform.architecture];

	if (existing && timestamp <= existing.timestamp) {
		return;
	}

	byArchitecture[platform.architecture] = { timestamp, download };
	target[platform.os] = byArchitecture;
}

function pickLatest(
	target: PlatformDownloads,
	platform: Platform,
	label: string,
): ModDownload {
	const download = target[platform.os]?.[platform.architecture]?.download;
	if (!download) {
		throw new Error(
			`No ${platform.os} ${platform.architecture} ${label} found`,
		);
	}
	return download;
}

function modIdSuffix(platform: Platform): string {
	const osPrefix = platform.os === "Linux" ? "linux-" : "";
	return `${osPrefix}${platform.architecture.toLocaleLowerCase()}`;
}

function asArchitecture(archMatch: string): Architecture | null {
	const architecture = archMatch.toLocaleUpperCase();

	if (!isArchitecture(architecture)) {
		console.warn(`Unknown architecture: ${architecture}`);
		return null;
	}
	return architecture;
}

function asOs(osMatch: string): OperatingSystem | null {
	switch (osMatch) {
		case "win":
		case "windows":
			return "Windows";
		case "linux":
			return "Linux";
		default:
			console.warn(`Unknown operating system: ${osMatch}`);
			return null;
	}
}

function asPlatform(osMatch: string, archMatch: string): Platform | null {
	const os = asOs(osMatch);
	if (!os) {
		return null;
	}
	const architecture = asArchitecture(archMatch);
	if (!architecture) {
		return null;
	}
	return { os, architecture };
}

function getMonoPlatformFromAssetName(assetName: string): Platform | null {
	const modernMatch = assetName.match(/^BepInEx_(win|linux)_(x64|x86)_/);
	if (modernMatch) {
		const [, osMatch, archMatch] = modernMatch;
		return asPlatform(osMatch, archMatch);
	}

	const legacyMatch = assetName.match(/^BepInEx_(x64|x86)_/);
	if (legacyMatch) {
		return asPlatform("win", legacyMatch[1]);
	}

	const prereleaseMatch = assetName.match(
		/^BepInEx-(.+)-(win|linux)-(x64|x86)-/,
	);
	if (prereleaseMatch) {
		const [, backendMatch, osMatch, archMatch] = prereleaseMatch;
		if (
			backendMatch.includes("Unity.Mono") ||
			backendMatch.includes("NET.Framework") ||
			backendMatch.includes("NET.CoreCLR")
		) {
			return asPlatform(osMatch, archMatch);
		}
		return null;
	}

	const altPrereleaseMatch = assetName.match(/^BepInEx_(.+)_(x64|x86)_/);
	if (altPrereleaseMatch) {
		const [, backendMatch, archMatch] = altPrereleaseMatch;
		const isMonoLike =
			backendMatch.includes("UnityMono") ||
			backendMatch.includes("NetLauncher");
		if (!isMonoLike) {
			return null;
		}
		return asPlatform("win", archMatch);
	}

	return null;
}

const octokit = createOctokit();

async function fetchMonoDownloads(): Promise<PlatformDownloads> {
	const response = await octokit.rest.repos.listReleases({
		owner: "BepInEx",
		repo: "BepInEx",
		per_page: 100,
	});

	const latestByPlatform: PlatformDownloads = {};

	for (const gitHubRelease of response.data) {
		if (!gitHubRelease.assets || gitHubRelease.assets.length === 0) {
			continue;
		}

		const version = gitHubRelease.tag_name.replace(/^v/, "");
		const publishedAt = gitHubRelease.published_at ?? gitHubRelease.created_at;
		const timestamp = new Date(publishedAt).getTime();

		for (const asset of gitHubRelease.assets) {
			const platform = getMonoPlatformFromAssetName(asset.name);
			if (!platform) {
				continue;
			}

			setLatest(latestByPlatform, platform, timestamp, {
				id: version,
				url: asset.browser_download_url,
				releaseDate: asset.created_at,
			});
		}
	}

	return latestByPlatform;
}

const BLEEDING_BUILD_URL_DOMAIN = "https://builds.bepinex.dev";
const BLEEDING_BUILD_URL_BASE = `${BLEEDING_BUILD_URL_DOMAIN}/projects/bepinex_be`;

async function fetchIl2cppDownloads(): Promise<PlatformDownloads> {
	const response = await fetch(BLEEDING_BUILD_URL_BASE);
	const html = await response.text();

	const doc = new DOMParser().parseFromString(html, "text/html");
	if (!doc) {
		throw new Error("Failed to parse BepInEx bleeding builds HTML");
	}

	const releaseElements = doc.getElementsByClassName("artifact-item");
	const latestByPlatform: PlatformDownloads = {};

	for (const releaseElement of releaseElements) {
		const dateText =
			releaseElement.getElementsByClassName("build-date")[0]?.innerText;
		const releaseTimestamp = Date.parse(dateText ?? "");

		if (!releaseTimestamp) {
			console.warn(`Invalid date format: ${dateText}`);
			continue;
		}

		const buildLinkElements =
			releaseElement.getElementsByClassName("artifact-link");

		for (const buildLinkElement of buildLinkElements) {
			const href = buildLinkElement.getAttribute("href");
			if (!href || href.includes("NET")) {
				continue;
			}

			const match = href.match(
				/\/BepInEx-Unity\.(Mono|IL2CPP)-(win|linux)-(x86|x64)-(\d+\.\d+\.\d+-be\.\d+)/,
			);
			if (!match) {
				continue;
			}

			const [, backendMatch, osMatch, archMatch, buildVersionMatch] = match;
			if (backendMatch !== "IL2CPP") {
				continue;
			}

			const platform = asPlatform(osMatch, archMatch);
			if (!platform) {
				continue;
			}

			setLatest(latestByPlatform, platform, releaseTimestamp, {
				id: buildVersionMatch,
				url: `${BLEEDING_BUILD_URL_DOMAIN}${href}`,
				releaseDate: new Date(releaseTimestamp).toISOString(),
			});
		}
	}

	return latestByPlatform;
}

let monoDownloads: Promise<PlatformDownloads> | undefined;
let il2cppDownloads: Promise<PlatformDownloads> | undefined;

function getMonoDownloads(): Promise<PlatformDownloads> {
	monoDownloads ??= fetchMonoDownloads();
	return monoDownloads;
}

function getIl2cppDownloads(): Promise<PlatformDownloads> {
	il2cppDownloads ??= fetchIl2cppDownloads();
	return il2cppDownloads;
}

export async function bepinexLoader({
	backend,
	...platform
}: Platform & { backend: UnityBackend }): Promise<ModBase> {
	const spec = backendSpecs[backend];
	const download =
		backend === "Mono"
			? pickLatest(await getMonoDownloads(), platform, "BepInEx Mono")
			: pickLatest(await getIl2cppDownloads(), platform, "BepInEx IL2CPP");

	const id = `bepinex-${spec.idPart}-${modIdSuffix(platform)}`;
	const extract: ModInstallExtract[] = [
		{ source: "BepInEx", destination: bepinexFolder },
		...spec.extraExtract,
	];

	const install: ModInstall =
		platform.os === "Windows"
			? {
					installKind: "PerGame",
					extract: [
						...extract,
						{
							source: "winhttp.dll",
							destination: `${token.GameExecutableFolderPath}/winhttp.dll`,
						},
					],
					write: [
						{
							content: spec.windowsDoorstopConfig,
							destination: `${token.GameExecutableFolderPath}/doorstop_config.ini`,
						},
					],
					wineDllOverrides: ["winhttp"],
				}
			: {
					installKind: "PerGame",
					extract: [
						...extract,
						{
							source: "libdoorstop.so",
							destination: `${token.GameExecutableFolderPath}/libdoorstop.so`,
						},
					],
				};

	return {
		id,
		tags: ["bepinex"],
		title: "BepInEx",
		author: "BepInEx",
		website: "https://github.com/BepInEx/BepInEx",
		description: "Mod loader for Unity mods.",
		engine: "Unity",
		unityBackend: backend,
		architecture: platform.architecture,
		gameOs: platform.os,
		download,
		install,
		...(platform.os === "Linux"
			? { gameEnvironment: spec.linuxEnvironment }
			: {}),
		paths: [
			{
				type: "Folder",
				path: bepinexFolder,
			},
			{
				type: "File",
				path: `${bepinexConfigFolder}/BepInEx.cfg`,
			},
			{
				type: "File",
				path: bepinexLogOutputPath,
			},
			...(platform.os === "Windows"
				? [
						{
							type: "File" as const,
							path: `${token.GameExecutableFolderPath}/doorstop_config.ini`,
						},
					]
				: []),
		],
		optionalDependencies: [
			{
				modId: "bepinex-config-legacy",
			},
			{
				modId: "bepinex-config-modern",
			},
		],
	};
}
