import { DOMParser } from "@b-fuze/deno-dom";
import { Architecture, isArchitecture, ModBase, Release } from "../mod.ts";
import { token } from "../replacement-tokens.ts";
import { getBepinexConfigContent } from "./bepinex-config.ts";

const BLEEDING_BUILD_URL_DOMAIN = "https://builds.bepinex.dev";
const BLEEDING_BUILD_URL_BASE =
	`${BLEEDING_BUILD_URL_DOMAIN}/projects/bepinex_be`;

/**
 * Base mod object for BepInEx itself, il2cpp version.
 */
function bepinexIl2cppLoaderBase(
	modId: string,
	isLegacy: boolean,
): Omit<ModBase, "title" | "latestVersion"> {
	return {
		id: modId,
		engine: "Unity",
		unityBackend: "Il2Cpp",
		description: "Mod loader for Unity mods.",
		author: "BepInEx",
		sourceCode: "https://github.com/BepInEx/BepInEx",
		install: {
			extract: [
				{
					source: "BepInEx",
					destination: `${token.InstalledModsPath}/bepinex/BepInEx`,
				},
				{
					source: "dotnet",
					destination: `${token.InstalledModsPath}/bepinex/dotnet`,
				},
				{
					source: "winhttp.dll",
					destination: `${token.GameExecutableFolderPath}/winhttp.dll`,
				},
			],
			write: [
				{
					content: `[General]
enabled = true
target_assembly = ${token.InstalledModsPath}/bepinex/BepInEx/core/BepInEx.Unity.IL2CPP.dll
redirect_output_log = false
boot_config_override =
ignore_disable_switch = true

[Il2Cpp]
coreclr_path = ${token.InstalledModsPath}/bepinex/dotnet/coreclr.dll
corlib_dir = ${token.InstalledModsPath}/bepinex/dotnet
`,
					destination: `${token.GameExecutableFolderPath}/doorstop_config.ini`,
				},
				{
					content: getBepinexConfigContent(isLegacy),
					destination:
						`${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
				},
			],
			wineDllOverrides: ["winhttp"],
			mainInstalledFolderPath: `${token.InstalledModsPath}/bepinex/BepInEx`,
		},
		config: {
			destinationPath:
				`${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
			destinationType: "File",
		},
	};
}

export async function getBepInExIl2cppLoaders(): Promise<ModBase[]> {
	const response = await fetch(BLEEDING_BUILD_URL_BASE);
	const html = await response.text();

	const doc = new DOMParser().parseFromString(html, "text/html");
	if (!doc) {
		throw new Error("Failed to parse BepInEx bleeding builds HTML");
	}

	const releaseElements = doc.getElementsByClassName("artifact-item");
	const latestByArch: Partial<
		Record<Architecture, { timestamp: number; release: Release }>
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
				/\/BepInEx-Unity\.(Mono|IL2CPP)-win-(x86|x64)-(\d+\.\d+\.\d+-be\.\d+)/,
			);
			if (!match) {
				continue;
			}

			const [, backendMatch, archMatch, buildVersionMatch] = match;
			if (backendMatch !== "IL2CPP") {
				continue;
			}

			const architecture = archMatch.toLocaleUpperCase();

			if (!isArchitecture(architecture)) {
				console.warn(`Unknown architecture: ${architecture}`);
				continue;
			}

			const existing = latestByArch[architecture];
			if (!existing || releaseTimestamp > existing.timestamp) {
				latestByArch[architecture] = {
					release: {
						id: buildVersionMatch,
						url: `${BLEEDING_BUILD_URL_DOMAIN}${href}`,
					},
					timestamp: releaseTimestamp,
				};
			}
		}
	}

	const latestX86 = latestByArch.X86;
	const latestX64 = latestByArch.X64;

	if (!latestX86) {
		throw new Error("No x86 BepInEx Bleeding found");
	}

	if (!latestX64) {
		throw new Error("No x64 BepInEx Bleeding found");
	}

	return [
		{
			...bepinexIl2cppLoaderBase("bepinex-il2cpp-x64", false),
			architecture: "X64",
			title: "BepInEx Il2Cpp X64",
			latestVersion: latestX64.release,
			engineVersionRange: {
				minimum: {
					major: 5,
					minor: 5,
				},
			},
		},
		{
			...bepinexIl2cppLoaderBase("bepinex-il2cpp-x86", false),
			architecture: "X86",
			title: "BepInEx Il2Cpp X86",
			latestVersion: latestX86.release,
			engineVersionRange: {
				minimum: {
					major: 5,
					minor: 5,
				},
			},
		},
		{
			...bepinexIl2cppLoaderBase("bepinex-il2cpp-x64-legacy", true),
			architecture: "X64",
			title: "BepInEx Il2Cpp X64 Legacy",
			latestVersion: latestX64.release,
			engineVersionRange: {
				maximum: {
					major: 5,
					minor: 4,
				},
			},
		},
		{
			...bepinexIl2cppLoaderBase("bepinex-il2cpp-x86-legacy", true),
			architecture: "X86",
			title: "BepInEx Il2Cpp X86 Legacy",
			latestVersion: latestX86.release,
			engineVersionRange: {
				minimum: {
					major: 5,
					minor: 4,
				},
			},
		},
	];
}
