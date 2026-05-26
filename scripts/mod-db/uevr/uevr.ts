import { ModBase } from "../mod.ts";
import { uevrBase } from "./uevr-base.ts";

// deno-lint-ignore require-await
export async function getUevrMods(): Promise<ModBase[]> {
	return [
		{
			...uevrBase("uevr"),
			title: "UEVR",
			// github: {
			// 	assetName: "UEVR.zip",
			// 	repo: "UEVR",
			// 	user: "praydog",
			// },
			description: "Universal VR mod for Unreal Engine games.",
			latestVersion: {
				id: "1.05",
				url: "https://github.com/praydog/UEVR/releases/download/1.05/UEVR.zip",
			},
		},
		{
			...uevrBase("uevr-nightly"),
			title: "UEVR Nightly",
			// github: {
			// 	assetName: "uevr.zip",
			// 	repo: "UEVR-nightly",
			// 	user: "praydog",
			// },
			description:
				"UEVR automatically built from the latest, potentially untested code changes.",
			latestVersion: {
				id: "nightly-01127-6f66affc01cea22e4b1b5a47986e1ade80ccbd26",
				url:
					"https://github.com/praydog/UEVR-nightly/releases/download/nightly-01127-6f66affc01cea22e4b1b5a47986e1ade80ccbd26/uevr.zip",
			},
		},
		{
			id: "dotnet-desktop-runtime-win-x64",
			title: ".NET Desktop Runtime",
			author: "bill gates himself",
			description: "Required for running UEVR via Wine",
			sourceCode: "https://dotnet.microsoft.com/en-us/download/dotnet/6.0",
			latestVersion: {
				id: "6.0.36",
				url:
					"https://github.com/Raicuparta/rai-pal-db/releases/download/dotnet-6/dotnet+desktop-runtime-6.0.36-win-x64.zip",
			},
			gameOs: "Windows",
			hostOs: "Linux",
		},
	];
}
