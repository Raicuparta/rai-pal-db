import { LoaderRelease, UnityBackend } from "#loader-db/main.ts";
import { Octokit } from "octokit";

const repository = "BepInEx/BepInEx";
const [owner, repo] = repository.split("/");
const octokit = new Octokit();

export async function getBepInExStableReleases(): Promise<LoaderRelease[]> {
	const response = await octokit.rest.repos.listReleases({
		owner,
		repo,
		per_page: 100,
	});
	const githubReleasesJson = response.data;

	const bepinexReleases: LoaderRelease[] = [];

	for (const gitHubRelease of githubReleasesJson) {
		if (gitHubRelease.assets) {
			const version = gitHubRelease.tag_name.replace(/^v/, "");
			const publishedAt =
				gitHubRelease.published_at ?? gitHubRelease.created_at;

			const bepInExRelease: LoaderRelease = {
				version,
				timestamp: new Date(publishedAt).getTime(),
				builds: [],
			};

			for (const asset of gitHubRelease.assets) {
				// Modern pattern: BepInEx_win_(x64|x86)_version.zip
				const modernMatch = asset.name.match(/^BepInEx_win_(x64|x86)_/);

				// Older pattern: BepInEx_(x64|x86)_version.zip
				const legacyMatch = asset.name.match(/^BepInEx_(x64|x86)_/);

				// Prerelease pattern: BepInEx-{Backend}-win-{Arch}-{Version}.zip
				const prereleaseMatch = asset.name.match(
					/^BepInEx-(.+)-win-(x64|x86)-/,
				);

				// Alternative prerelease pattern: BepInEx_{Backend}_{Arch}_{Version}.zip
				const altPrereleaseMatch = asset.name.match(/^BepInEx_(.+)_(x64|x86)_/);

				let os: string;
				let arch: string;
				let backend: UnityBackend;

				if (modernMatch) {
					[, os, arch] = modernMatch;
					backend = "Mono"; // Stable releases are Mono only
				} else if (legacyMatch) {
					const [, archValue] = legacyMatch;
					backend = "Mono"; // Stable releases are Mono only
					os = "win"; // x64/x86 without OS prefix means Windows
					arch = archValue;
				} else if (prereleaseMatch) {
					const [, backendStr, archStr] = prereleaseMatch;
					os = "win";
					arch = archStr;

					// Map backend string to UnityBackend type
					if (backendStr.includes("Unity.Mono")) {
						backend = "Mono";
					} else if (backendStr.includes("Unity.IL2CPP")) {
						backend = "Il2Cpp";
					} else if (
						backendStr.includes("NET.Framework") ||
						backendStr.includes("NET.CoreCLR")
					) {
						backend = "Mono"; // .NET Framework/CoreCLR builds are treated as Mono
					} else {
						console.warn(
							`Skipping asset ${asset.name} from release ${gitHubRelease.tag_name} due to unknown backend: ${backendStr}`,
						);
						continue;
					}
				} else if (altPrereleaseMatch) {
					const [, backendStr, archValue] = altPrereleaseMatch;
					os = "win";
					arch = archValue;

					// Map backend string to UnityBackend type
					if (backendStr.includes("UnityMono")) {
						backend = "Mono";
					} else if (backendStr.includes("UnityIL2CPP")) {
						backend = "Il2Cpp";
					} else if (backendStr.includes("NetLauncher")) {
						backend = "Mono"; // NetLauncher is treated as Mono
					} else {
						console.warn(
							`Skipping asset ${asset.name} from release ${gitHubRelease.tag_name} due to unknown backend: ${backendStr}`,
						);
						continue;
					}
				} else {
					console.warn(
						`Skipping asset ${asset.name} from release ${gitHubRelease.tag_name} due to unknown naming pattern`,
					);
					continue; // Skip assets that don't match any pattern
				}

				bepInExRelease.builds.push({
					unityBackend: backend,
					os,
					arch,
					downloadUrl: asset.browser_download_url,
				});
			}

			if (bepInExRelease.builds.length === 0) continue;

			bepinexReleases.push(bepInExRelease);
		}
	}

	return bepinexReleases;
}
