import { getLatestFromGitHub } from "../github.ts";
import { ModBase } from "../mod.ts";
import { token } from "../replacement-tokens.ts";
import { uevrBase } from "./uevr-base.ts";

const dotnetId = "dotnet-desktop-runtime-win-x64";

export async function getUevrMods(): Promise<ModBase[]> {
	return [
		{
			...uevrBase("uevr"),
			title: "UEVR",
			description: "Universal VR mod for Unreal Engine games.",
			download: await getLatestFromGitHub({
				owner: "praydog",
				repo: "UEVR",
				selectAssetName: (assetName) => assetName === "UEVR.zip",
			}),
		},
		{
			...uevrBase("uevr-nightly"),
			title: "UEVR Nightly",
			description:
				"UEVR automatically built from the latest, potentially untested code changes.",
			download: await getLatestFromGitHub({
				owner: "praydog",
				repo: "UEVR-nightly",
				selectAssetName: (assetName) => assetName === "uevr.zip",
				formatId: (tag) => tag.split("-")[1] || tag,
			}),
		},
		{
			id: dotnetId,
			title: ".NET Desktop Runtime",
			author: "bill gates himself",
			description: "Required for running UEVR via Wine",
			sourceCode: "https://dotnet.microsoft.com/en-us/download/dotnet/6.0",
			download: {
				id: "6.0.36",
				url:
					"https://github.com/Raicuparta/rai-pal-db/releases/download/dotnet-6/dotnet+desktop-runtime-6.0.36-win-x64.zip",
			},
			install: {
				manifestPath:
					`${token.SharedModsPath}/${dotnetId}/rai-pal-manifest.json`,
				extract: [
					{
						source: ".",
						destination: `${token.SharedModsPath}/${dotnetId}`,
					},
				],
				mainInstalledFolderPath: `${token.SharedModsPath}/${dotnetId}`,
			},
			gameOs: "Windows",
			hostOs: "Linux",
		},
	];
}
