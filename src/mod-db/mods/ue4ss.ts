import { createOctokit } from "../helpers/github.ts";
import { extractZipContents } from "../helpers/zip-extracts.ts";
import type { ModDownload } from "../mod.ts";
import { defineMod } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

const id = "ue4ss";
const ue4ssFolder = `${token.GameInstalledModsPath}/ue4ss`;
const octokit = createOctokit();
const VERSION_PATTERN = /^UE4SS_(v[\d.]+\-\d+)[\-\w]*\.zip$/;

async function getLatestUe4ss(): Promise<ModDownload> {
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

const download = await getLatestUe4ss();

export default defineMod({
	id,
	tags: ["ue4ss"],
	engine: "Unreal",
	title: "UE4SS",
	author: "UE4SS-RE",
	website: "https://github.com/UE4SS-RE/RE-UE4SS",
	description: "Scripting and modding framework for Unreal Engine games.",
	download,
	install: {
		installKind: "PerGame",
		extract: [
			{
				source: "ue4ss/UE4SS.dll",
				destination: `${ue4ssFolder}/UE4SS.dll`,
			},
			{
				source: "ue4ss/UE4SS_SDK_Backends",
				destination: `${ue4ssFolder}/UE4SS_SDK_Backends`,
			},
			{
				source: "ue4ss/UE4SS-settings.ini",
				destination: `${ue4ssFolder}/UE4SS-settings.ini`,
			},
			{
				source: "ue4ss/LICENSE",
				destination: `${ue4ssFolder}/LICENSE`,
			},
			...(await extractZipContents(
				download,
				"ue4ss/Mods",
				`${ue4ssFolder}/Mods`,
			)),
			{
				source: "dwmapi.dll",
				destination: `${token.GameExecutableFolderPath}/dwmapi.dll`,
			},
		],
		write: [
			{
				content: `${token.MaybeWineRoot}${ue4ssFolder}`,
				destination: `${token.GameExecutableFolderPath}/override.txt`,
			},
		],
		wineDllOverrides: ["dwmapi"],
	},
	paths: [
		{
			type: "Folder",
			path: ue4ssFolder,
		},
		{
			type: "File",
			path: `${ue4ssFolder}/UE4SS.log`,
		},
		{
			type: "File",
			path: `${ue4ssFolder}/UE4SS-settings.ini`,
		},
	],
});
