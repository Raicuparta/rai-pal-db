import { Octokit } from "octokit";
import { ModSchema } from "#types/db-schema.ts";

const repository = "BepInEx/BepInEx";
const [owner, repo] = repository.split("/");
const octokit = new Octokit();

type Arch = "x86" | "x64";

interface LatestByArchEntry {
	version: string;
	timestamp: number;
	downloadUrl: string;
}

function getMonoArchFromAssetName(assetName: string): Arch | null {
	const modernMatch = assetName.match(/^BepInEx_win_(x64|x86)_/);
	if (modernMatch) {
		const [, arch] = modernMatch;
		return arch as Arch;
	}

	const legacyMatch = assetName.match(/^BepInEx_(x64|x86)_/);
	if (legacyMatch) {
		const [, arch] = legacyMatch;
		return arch as Arch;
	}

	const prereleaseMatch = assetName.match(/^BepInEx-(.+)-win-(x64|x86)-/);
	if (prereleaseMatch) {
		const [, backendStr, arch] = prereleaseMatch;
		if (
			backendStr.includes("Unity.Mono") ||
			backendStr.includes("NET.Framework") ||
			backendStr.includes("NET.CoreCLR")
		) {
			return arch as Arch;
		}
		return null;
	}

	const altPrereleaseMatch = assetName.match(/^BepInEx_(.+)_(x64|x86)_/);
	if (altPrereleaseMatch) {
		const [, backendStr, arch] = altPrereleaseMatch;
		const isMonoLike =
			backendStr.includes("UnityMono") || backendStr.includes("NetLauncher");
		if (!isMonoLike) {
			return null;
		}
		return arch as Arch;
	}

	return null;
}

function toMonoModSchema(
	architecture: NonNullable<ModSchema["architecture"]>,
	latest: LatestByArchEntry | undefined,
): ModSchema {
	return {
		id: `bepinex-mono-${architecture.toLowerCase()}`,
		engine: "Unity",
		architecture,
		unityBackend: "Mono",
		title: `BepInEx Mono ${architecture}`,
		author: "BepInEx",
		sourceCode: "https://github.com/BepInEx/BepInEx",
		description: `BepInEx stable Mono build for ${architecture} games.`,
		latestVersion: latest
			? {
					id: latest.version,
					url: latest.downloadUrl,
				}
			: undefined,
	};
}

export async function getBepInExStableReleases(): Promise<ModSchema[]> {
	const response = await octokit.rest.repos.listReleases({
		owner,
		repo,
		per_page: 100,
	});
	const githubReleases = response.data;

	const latestByArch: Partial<Record<Arch, LatestByArchEntry>> = {};

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
					version,
					timestamp,
					downloadUrl: asset.browser_download_url,
				};
			}
		}
	}

	return [
		toMonoModSchema("X86", latestByArch.x86),
		toMonoModSchema("X64", latestByArch.x64),
	];
}
