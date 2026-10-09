import { getLatestFromGitHub } from "../github.ts";
import { ModBase } from "../mod.ts";
import { token } from "../replacement-tokens.ts";
import { uevrBase } from "./uevr-base.ts";

const dotnetId = "dotnet-desktop-runtime-win-x64";
const chihuahuaId = "chihuahua-uevr";

export async function getUevrMods(): Promise<ModBase[]> {
	const { uevr } = await getLatestFromGitHub(
		{ owner: "praydog", repo: "UEVR" },
		{ uevr: (assetName) => assetName === "UEVR.zip" },
	);

	const { nightly } = await getLatestFromGitHub(
		{
			owner: "praydog",
			repo: "UEVR-nightly",
			formatId: (tag) => tag.split("-")[1] || tag,
		},
		{ nightly: (assetName) => assetName === "uevr.zip" },
	);

	const { joeyhodge, joeyhodgeDibr } = await getLatestFromGitHub(
		{ owner: "joeyhodge", repo: "UEVR" },
		{
			joeyhodge: (assetName) => assetName.toLocaleLowerCase() === "uevr.zip",
			joeyhodgeDibr: (assetName) =>
				assetName.toLocaleLowerCase().includes("dibr") &&
				assetName.toLocaleLowerCase().endsWith("zip"),
		},
	);

	const { joeyhodgeAfw, nightlyAfw } = await getLatestFromGitHub(
		{
			owner: "PureDark",
			repo: "UEVR",
			allowPreRelease: true,
			formatId: (tag) => tag.replace("UEVR_AFW_", ""),
		},
		{
			joeyhodgeAfw: (assetName) =>
				assetName.startsWith("UEVR-joeyhodge_AFW_") &&
				assetName.endsWith(".zip"),
			nightlyAfw: (assetName) =>
				assetName.startsWith("UEVR-nightly_AFW_") &&
				assetName.endsWith(".zip"),
		},
	);

	const { chihuahua } = await getLatestFromGitHub(
		{ owner: "keton", repo: "chihuahua" },
		{ chihuahua: (assetName) => assetName === "chihuahua.zip" },
	);

	return [
		{
			...uevrBase("uevr"),
			title: "UEVR",
			description: "Universal VR mod for Unreal Engine games.",
			download: uevr,
		},
		{
			...uevrBase("uevr-nightly"),
			title: "UEVR Nightly",
			description:
				"UEVR automatically built from the latest, potentially untested code changes.",
			download: nightly,
		},
		{
			...uevrBase("uevr-joeyhodge", "uevr"),
			title: "UEVR JoeyHodge",
			author: "praydog + joeyhodge",
			description: "UEVR with joehhodge's enhancements.",
			sourceCode: "https://github.com/joeyhodge/UEVR",
			download: joeyhodge,
		},
		{
			...uevrBase("uevr-joeyhodge-dibr", "DIBRUEVR"),
			title: "UEVR JoeyHodge DIBR/Mono",
			author: "praydog + joeyhodge",
			description:
				"UEVR with joehhodge's enhancements, with options for DIBR / Mono rendering.",
			sourceCode: "https://github.com/joeyhodge/UEVR",
			download: joeyhodgeDibr,
		},
		{
			...uevrBase("uevr-joeyhodge-afw"),
			title: "UEVR JoeyHodge AFW",
			author: "praydog + PureDark + joeyhodge",
			description:
				"UEVR with joehhodge's enhancements + Alternate Frame Warping.",
			sourceCode: "https://github.com/PureDark/UEVR",
			download: joeyhodgeAfw,
		},
		{
			...uevrBase("uevr-nightly-afw"),
			title: "UEVR Nightly AFW",
			author: "praydog + PureDark",
			description: "UEVR nightly + Alternate Frame Warping.",
			sourceCode: "https://github.com/PureDark/UEVR",
			download: nightlyAfw,
		},
		{
			id: dotnetId,
			title: ".NET Desktop Runtime",
			hideFromGameModsList: true,
			engine: "Unreal",
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
		{
			id: chihuahuaId,
			title: "Chihuahua",
			family: "uevr",
			author: "Keton",
			engine: "Unreal",
			gameOs: "Windows",
			description: "Simple injector/game launcher for UEVR",
			sourceCode: "https://github.com/keton/chihuahua",
			download: chihuahua,
			install: {
				manifestPath:
					`${token.SharedModsPath}/${chihuahuaId}/rai-pal-manifest.json`,
				extract: [
					{
						source: ".",
						destination: `${token.SharedModsPath}/${chihuahuaId}`,
					},
				],
				mainInstalledFolderPath: `${token.SharedModsPath}/${chihuahuaId}`,
			},
			runForGame: {
				path: `${token.SharedModsPath}/${chihuahuaId}/chihuahua.exe`,
				args: [
					token.GameExecutablePath,
					"--delay",
					"20",
					"--launch-cmd",
					token.GameStartCommand,
					"--launch-args",
					token.GameStartCommandArgs,
				],
				os: "Windows",
			},
			runStandalone: {
				path: `${token.SharedModsPath}/${chihuahuaId}/chihuahua.exe`,
				os: "Windows",
			},
		},
	];
}
