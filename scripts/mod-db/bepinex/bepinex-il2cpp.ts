import { DOMParser } from "@b-fuze/deno-dom";
import {
	Architecture,
	isArchitecture,
	ModBase,
	ModDownload,
	ModRun,
	OperatingSystem,
} from "../mod.ts";
import { token } from "../replacement-tokens.ts";

const BLEEDING_BUILD_URL_DOMAIN = "https://builds.bepinex.dev";
const BLEEDING_BUILD_URL_BASE =
	`${BLEEDING_BUILD_URL_DOMAIN}/projects/bepinex_be`;

/**
 * Base mod object for BepInEx itself, il2cpp version.
 */
function bepinexIl2cppLoaderBase(
	modId: string,
	os: OperatingSystem,
): Omit<ModBase, "title" | "download"> {
	const runForGame = bepinexIl2cppRunForGame(os);
	return {
		id: modId,
		family: "bepinex",
		engine: "Unity",
		unityBackend: "Il2Cpp",
		gameOs: os,
		description: "Mod loader for Unity mods.",
		author: "BepInEx",
		sourceCode: "https://github.com/BepInEx/BepInEx",
		install: bepinexIl2cppInstall(modId, os),
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

function bepinexIl2cppRunForGame(os: OperatingSystem): ModRun | null {
	if (os === "Windows") {
		return null;
	}

	return {
		path: `${token.GameExecutableFolderPath}/run_bepinex.sh`,
		args: [
			`"${token.GameExecutableName}"`,
			"--doorstop-target-assembly",
			`"${token.GameInstalledModsPath}/bepinex/BepInEx/core/BepInEx.Unity.IL2CPP.dll"`,
			"--doorstop-clr-runtime-coreclr-path",
			`"${token.GameInstalledModsPath}/bepinex/dotnet/libcoreclr"`,
			"--doorstop-clr-corlib-dir",
			`"${token.GameInstalledModsPath}/bepinex/dotnet"`,
		],
		os: "Linux",
	};
}

function bepinexIl2cppInstall(
	modId: string,
	os: OperatingSystem,
): NonNullable<ModBase["install"]> {
	const manifestPath = `${token.GameInstalledModsPath}/manifests/${modId}.json`;
	const bepinexExtract = {
		source: "BepInEx",
		destination: `${token.GameInstalledModsPath}/bepinex/BepInEx`,
	};
	const dotnetExtract = {
		source: "dotnet",
		destination: `${token.GameInstalledModsPath}/bepinex/dotnet`,
	};

	if (os === "Windows") {
		return {
			manifestPath,
			extract: [
				bepinexExtract,
				dotnetExtract,
				{
					source: "winhttp.dll",
					destination: `${token.GameExecutableFolderPath}/winhttp.dll`,
				},
			],
			write: [
				{
					content: `[General]
enabled = true
target_assembly = ${token.MaybeWineRoot}${token.GameInstalledModsPath}/bepinex/BepInEx/core/BepInEx.Unity.IL2CPP.dll
redirect_output_log = false
boot_config_override =
ignore_disable_switch = true

[Il2Cpp]
coreclr_path = ${token.GameInstalledModsPath}/bepinex/dotnet/coreclr.dll
corlib_dir = ${token.GameInstalledModsPath}/bepinex/dotnet
`,
					destination: `${token.GameExecutableFolderPath}/doorstop_config.ini`,
				},
			],
			wineDllOverrides: ["winhttp"],
			mainInstalledFolderPath: `${token.GameInstalledModsPath}/bepinex/BepInEx`,
		};
	}

	return {
		manifestPath,
		extract: [
			bepinexExtract,
			dotnetExtract,
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

function isLinux(platform: LoaderPlatform): boolean {
	return platform.os === "Linux";
}

function modIdSuffix(platform: LoaderPlatform): string {
	return `${
		isLinux(platform) ? "linux-" : ""
	}${platform.architecture.toLocaleLowerCase()}`;
}

function title(platform: LoaderPlatform): string {
	return `BepInEx Il2Cpp ${platform.architecture}${
		isLinux(platform) ? " (Linux)" : ""
	}`;
}

const wantedPlatforms: LoaderPlatform[] = [
	{ os: "Windows", architecture: "X64" },
	{ os: "Windows", architecture: "X86" },
	{ os: "Linux", architecture: "X64" },
];

export async function getBepInExIl2cppLoaders(): Promise<ModBase[]> {
	const response = await fetch(BLEEDING_BUILD_URL_BASE);
	const html = await response.text();

	const doc = new DOMParser().parseFromString(html, "text/html");
	if (!doc) {
		throw new Error("Failed to parse BepInEx bleeding builds HTML");
	}

	const releaseElements = doc.getElementsByClassName("artifact-item");
	const latestByPlatform: Partial<
		Record<
			OperatingSystem,
			Partial<
				Record<Architecture, { timestamp: number; release: ModDownload }>
			>
		>
	> = {};

	for (const releaseElement of releaseElements) {
		const dateText = releaseElement.getElementsByClassName("build-date")[0]
			?.innerText;
		const releaseTimestamp = Date.parse(dateText ?? "");

		if (!releaseTimestamp) {
			console.warn(`Invalid date format: ${dateText}`);
			continue;
		}

		const buildLinkElements = releaseElement.getElementsByClassName(
			"artifact-link",
		);

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

			const os = osMatch === "linux" ? "Linux" : "Windows";
			const architecture = archMatch.toLocaleUpperCase();

			if (!isArchitecture(architecture)) {
				console.warn(`Unknown architecture: ${architecture}`);
				continue;
			}

			const existing = latestByPlatform[os]?.[architecture];
			if (!existing || releaseTimestamp > existing.timestamp) {
				const latestForOs = latestByPlatform[os] ?? {};
				latestForOs[architecture] = {
					release: {
						id: buildVersionMatch,
						url: `${BLEEDING_BUILD_URL_DOMAIN}${href}`,
					},
					timestamp: releaseTimestamp,
				};
				latestByPlatform[os] = latestForOs;
			}
		}
	}

	return wantedPlatforms.map((platform) => {
		const latest = latestByPlatform[platform.os]?.[platform.architecture];
		if (!latest) {
			throw new Error(
				`No ${platform.os} ${platform.architecture} BepInEx Bleeding found`,
			);
		}

		return {
			...bepinexIl2cppLoaderBase(
				`bepinex-il2cpp-${modIdSuffix(platform)}`,
				platform.os,
			),
			architecture: platform.architecture,
			title: title(platform),
			download: latest.release,
		};
	});
}
