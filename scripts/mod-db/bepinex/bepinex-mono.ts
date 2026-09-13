import {
	Architecture,
	isArchitecture,
	ModBase,
	ModDownload,
	ModRun,
	OperatingSystem,
} from "../mod.ts";
import { token } from "../replacement-tokens.ts";
import { createOctokit } from "../github-client.ts";

const repository = "BepInEx/BepInEx";
const [owner, repo] = repository.split("/");
const octokit = createOctokit();

/**
 * Base mod object for BepInEx itself, mono version.
 */
function bepinexMonoLoaderBase(
	modId: string,
	os: OperatingSystem,
): Omit<ModBase, "title" | "download"> {
	const runForGame = bepinexMonoRunForGame(os);
	return {
		id: modId,
		family: "bepinex",
		description: `Mod loader for Unity mods.${
			os === "Linux"
				? " You must start the game with this 'Run' button for mods to work"
				: ""
		}`,
		engine: "Unity",
		unityBackend: "Mono",
		gameOs: os,
		author: "BepInEx",
		sourceCode: "https://github.com/BepInEx/BepInEx",
		install: bepinexMonoInstall(modId, os),
		...(runForGame ? { runForGame } : {}),
		config: {
			destinationPath:
				`${token.GameInstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
			destinationType: "File",
		},
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

function bepinexMonoRunForGame(os: OperatingSystem): ModRun | null {
	if (os === "Windows") {
		return null;
	}

	return {
		path: `${token.GameExecutableFolderPath}/run_bepinex.sh`,
		args: [
			token.GameExecutableName,
			"--doorstop-target-assembly",
			`${token.GameInstalledModsPath}/bepinex/BepInEx/core/BepInEx.Preloader.dll`,
		],
		os: "Linux",
	};
}

function bepinexMonoInstall(
	modId: string,
	os: OperatingSystem,
): NonNullable<ModBase["install"]> {
	const bepinexExtract = {
		source: "BepInEx",
		destination: `${token.GameInstalledModsPath}/bepinex/BepInEx`,
	};

	if (os === "Windows") {
		return {
			manifestPath: `${token.GameInstalledModsPath}/manifests/${modId}.json`,
			extract: [
				bepinexExtract,
				{
					source: "winhttp.dll",
					destination: `${token.GameExecutableFolderPath}/winhttp.dll`,
				},
			],
			write: [
				{
					content: `[General]
enabled=true
target_assembly=${token.MaybeWineRoot}${token.GameInstalledModsPath}/bepinex/BepInEx/core/BepInEx.Preloader.dll
redirect_output_log=false
ignore_disable_switch=true

[UnityMono]
dll_search_path_override=
`,
					destination: `${token.GameExecutableFolderPath}/doorstop_config.ini`,
				},
			],
			wineDllOverrides: ["winhttp"],
			mainInstalledFolderPath: `${token.GameInstalledModsPath}/bepinex/BepInEx`,
		};
	}

	return {
		manifestPath: `${token.GameInstalledModsPath}/manifests/${modId}.json`,
		extract: [
			bepinexExtract,
			{
				source: "libdoorstop.so",
				destination: `${token.GameExecutableFolderPath}/libdoorstop.so`,
			},
			{
				source: "run_bepinex.sh",
				destination: `${token.GameExecutableFolderPath}/run_bepinex.sh`,
			},
		],
		mainInstalledFolderPath: `${token.GameInstalledModsPath}/bepinex/BepInEx`,
	};
}

type LoaderPlatform = {
	os: OperatingSystem;
	architecture: Architecture;
};

function asArch(archMatch: string): Architecture | null {
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

function asPlatform(
	osMatch: string,
	archMatch: string,
): LoaderPlatform | null {
	const os = asOs(osMatch);
	if (!os) {
		return null;
	}
	const architecture = asArch(archMatch);
	if (!architecture) {
		return null;
	}
	return { os, architecture };
}

function getMonoPlatformFromAssetName(
	assetName: string,
): LoaderPlatform | null {
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
		const isMonoLike = backendMatch.includes("UnityMono") ||
			backendMatch.includes("NetLauncher");
		if (!isMonoLike) {
			return null;
		}
		return asPlatform("win", archMatch);
	}

	return null;
}

function isLinux(platform: LoaderPlatform): boolean {
	return platform.os === "Linux";
}

function modIdSuffix(platform: LoaderPlatform): string {
	return `${
		isLinux(platform) ? "linux-" : ""
	}${platform.architecture.toLocaleLowerCase()}`;
}

function title(platform: LoaderPlatform): string {
	return `BepInEx Mono ${platform.architecture}${
		isLinux(platform) ? " (Linux)" : ""
	}`;
}

const wantedPlatforms: LoaderPlatform[] = [
	{ os: "Windows", architecture: "X64" },
	{ os: "Windows", architecture: "X86" },
	{ os: "Linux", architecture: "X64" },
	{ os: "Linux", architecture: "X86" },
];

export async function getBepInExMonoLoaders(): Promise<ModBase[]> {
	const response = await octokit.rest.repos.listReleases({
		owner,
		repo,
		per_page: 100,
	});
	const githubReleases = response.data;

	const latestByPlatform: Partial<
		Record<
			OperatingSystem,
			Partial<
				Record<Architecture, { timestamp: number; release: ModDownload }>
			>
		>
	> = {};

	for (const gitHubRelease of githubReleases) {
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

			const existing = latestByPlatform[platform.os]?.[platform.architecture];
			if (!existing || timestamp > existing.timestamp) {
				const latestForOs = latestByPlatform[platform.os] ?? {};
				latestForOs[platform.architecture] = {
					timestamp,
					release: { id: version, url: asset.browser_download_url },
				};
				latestByPlatform[platform.os] = latestForOs;
			}
		}
	}

	return wantedPlatforms.map((platform) => {
		const latest = latestByPlatform[platform.os]?.[platform.architecture];
		if (!latest) {
			throw new Error(
				`No ${platform.os} ${platform.architecture} BepInEx Mono found`,
			);
		}

		return {
			...bepinexMonoLoaderBase(
				`bepinex-mono-${modIdSuffix(platform)}`,
				platform.os,
			),
			architecture: platform.architecture,
			title: title(platform),
			download: latest.release,
		};
	});
}
