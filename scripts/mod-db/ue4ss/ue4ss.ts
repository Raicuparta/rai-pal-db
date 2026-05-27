import { ModBase, Release } from "../mod.ts";
import { Octokit } from "octokit";
import { token } from "../replacement-tokens.ts";

export async function getUe4ssMods(): Promise<ModBase[]> {
	return [
		{
			id: "ue4ss",
			engine: "Unreal",
			title: "UE4SS",
			author: "UE4SS-RE",
			sourceCode: "https://github.com/UE4SS-RE/RE-UE4SS",
			description: "Scripting and modding framework for Unreal Engine games.",
			latestVersion: await getLatestUe4ss(),
			install: {
				extract: [
					{
						source: "ue4ss",
						destination: `${token.InstalledModsPath}/ue4ss`,
					},
					{
						source: "dwmapi.dll",
						destination: `${token.GameExecutableFolderPath}/dwmapi.dll`,
					},
				],
				write: [
					{
						content: `${token.InstalledModsPath}/ue4ss/UE4SS.dll`,
						destination: `${token.GameExecutableFolderPath}/override.txt`,
					},
				],
				wineDllOverrides: ["dwmapi"],
			},
		},
	];
}

const octokit = new Octokit();
const VERSION_PATTERN = /^UE4SS_(v[\d.]+\-\d+)[\-\w]*\.zip$/;

export async function getLatestUe4ss(): Promise<Release> {
	const response = await octokit.rest.repos.getReleaseByTag({
		owner: "UE4SS-RE",
		repo: "RE-UE4SS",
		tag: "experimental",
	});

	const gitHubRelease = response.data;

	if (!gitHubRelease.assets || gitHubRelease.assets.length === 0) {
		throw new Error("No assets found for UE4SS experimental release");
	}

	let latest: {
		version: string;
		timestamp: number;
		downloadUrl: string;
	} | null = null;

	for (const asset of gitHubRelease.assets) {
		const match = asset.name.match(VERSION_PATTERN);
		if (!match) {
			continue;
		}

		const version = match[1];
		const timestamp = new Date(asset.updated_at).getTime();

		if (!latest || timestamp > latest.timestamp) {
			latest = {
				version,
				timestamp,
				downloadUrl: asset.browser_download_url,
			};
		}
	}

	if (!latest) {
		throw new Error("No matching UE4SS release assets found");
	}

	return {
		id: latest.version,
		url: latest.downloadUrl,
	};
}
