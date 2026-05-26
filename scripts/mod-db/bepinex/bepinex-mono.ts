import { Architecture, isArchitecture, ModBase, Release } from "../mod.ts";
import { token } from "../replacement-tokens.ts";
import { Octokit } from "octokit";
import { getBepinexConfigContent } from "./bepinex-config.ts";

const repository = "BepInEx/BepInEx";
const [owner, repo] = repository.split("/");
const octokit = new Octokit();

/**
 * Base mod object for BepInEx itself, mono version.
 */
function bepinexMonoLoaderBase(
	modId: string,
	isLegacy: boolean,
): Omit<ModBase, "title" | "latestVersion"> {
	return {
		id: modId,
		description: "Mod loader for Unity mods.",
		engine: "Unity",
		unityBackend: "Mono",
		author: "BepInEx",
		sourceCode: "https://github.com/BepInEx/BepInEx",
		install: {
			extract: [
				{
					source: "BepInEx",
					destination: `${token.InstalledModsPath}/bepinex/BepInEx`,
				},
				{
					source: "winhttp.dll",
					destination: `${token.GameExecutableFolderPath}/winhttp.dll`,
				},
			],
			write: [
				{
					content: `[General]
enabled=true
target_assembly=${token.InstalledModsPath}/bepinex/BepInEx/core/BepInEx.Preloader.dll
redirect_output_log=false
ignore_disable_switch=true

[UnityMono]
dll_search_path_override=
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

function asArch(archMatch: string): Architecture | null {
	const architecture = archMatch.toLocaleUpperCase();

	if (!isArchitecture(architecture)) {
		console.warn(`Unknown architecture: ${architecture}`);
		return null;
	}
	return architecture;
}

function getMonoArchFromAssetName(assetName: string): Architecture | null {
	const modernMatch = assetName.match(/^BepInEx_win_(x64|x86)_/);
	if (modernMatch) {
		const [, archMatch] = modernMatch;
		return asArch(archMatch);
	}

	const legacyMatch = assetName.match(/^BepInEx_(x64|x86)_/);
	if (legacyMatch) {
		const [, archMatch] = legacyMatch;
		return asArch(archMatch);
	}

	const prereleaseMatch = assetName.match(/^BepInEx-(.+)-win-(x64|x86)-/);
	if (prereleaseMatch) {
		const [, backendMatch, archMatch] = prereleaseMatch;
		if (
			backendMatch.includes("Unity.Mono") ||
			backendMatch.includes("NET.Framework") ||
			backendMatch.includes("NET.CoreCLR")
		) {
			return asArch(archMatch);
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
		return asArch(archMatch);
	}

	return null;
}

export async function getBepInExMonoLoaders(): Promise<ModBase[]> {
	const response = await octokit.rest.repos.listReleases({
		owner,
		repo,
		per_page: 100,
	});
	const githubReleases = response.data;

	const latestByArch: Partial<
		Record<Architecture, { timestamp: number; release: Release }>
	> = {};

	for (const gitHubRelease of githubReleases) {
		if (!gitHubRelease.assets || gitHubRelease.assets.length === 0) {
			continue;
		}

		const version = gitHubRelease.tag_name.replace(/^v/, "");
		const publishedAt = gitHubRelease.published_at ?? gitHubRelease.created_at;
		const timestamp = new Date(publishedAt).getTime();

		for (const asset of gitHubRelease.assets) {
			const arch = getMonoArchFromAssetName(asset.name);
			if (!arch) {
				continue;
			}

			const existing = latestByArch[arch];
			if (!existing || timestamp > existing.timestamp) {
				latestByArch[arch] = {
					timestamp,
					release: { id: version, url: asset.browser_download_url },
				};
			}
		}
	}

	const latestX86 = latestByArch.X86;
	const latestX64 = latestByArch.X64;

	if (!latestX86) {
		throw new Error("No x86 BepInEx Mono found");
	}

	if (!latestX64) {
		throw new Error("No x64 BepInEx Mono found");
	}

	return [
		{
			...bepinexMonoLoaderBase("bepinex-mono-x64", false),
			architecture: "X64",
			title: "BepInEx Mono X64",
			latestVersion: latestX64.release,
			engineVersionRange: {
				minimum: {
					major: 5,
					minor: 5,
				},
			},
		},
		{
			...bepinexMonoLoaderBase("bepinex-mono-x86", false),
			architecture: "X86",
			title: "BepInEx Mono X86",
			latestVersion: latestX86.release,
			engineVersionRange: {
				minimum: {
					major: 5,
					minor: 5,
				},
			},
		},
		{
			...bepinexMonoLoaderBase("bepinex-mono-x64-legacy", true),
			architecture: "X64",
			title: "BepInEx Mono X64 Legacy",
			latestVersion: latestX64.release,
			engineVersionRange: {
				maximum: {
					major: 5,
					minor: 4,
				},
			},
		},
		{
			...bepinexMonoLoaderBase("bepinex-mono-x86-legacy", true),
			architecture: "X86",
			title: "BepInEx Mono X86 Legacy",
			latestVersion: latestX86.release,
			engineVersionRange: {
				maximum: {
					major: 5,
					minor: 4,
				},
			},
		},
	];
}
