import { getLatestFromGitHub } from "./github.ts";
import { ModBase } from "./mod.ts";
import { token } from "./replacement-tokens.ts";

const ogsaRepo = (repo: string) => `https://github.com/BrianGilbert/${repo}`;

const ogsaAsset = (prefix: string) => (assetName: string) =>
	assetName.startsWith(`${prefix}_ogsa_telemetry-`) &&
	assetName.endsWith("-win64.zip");

export async function getOgsaMods(): Promise<ModBase[]> {
	const { bepinex } = await getLatestFromGitHub(
		{ owner: "BrianGilbert", repo: "bepinex-ogsa-ts" },
		{ bepinex: ogsaAsset("bepinex") },
	);

	const { uevr } = await getLatestFromGitHub(
		{ owner: "BrianGilbert", repo: "uevr-ogsa-ts" },
		{ uevr: ogsaAsset("uevr") },
	);

	const { ue4ss } = await getLatestFromGitHub(
		{ owner: "BrianGilbert", repo: "ue4ss-ogsa-ts" },
		{ ue4ss: ogsaAsset("ue4ss") },
	);

	return [
		{
			id: "ogsa-bepinex-mono",
			family: "ogsa",
			title: "OGSA Telemetry (BepInEx)",
			author: "BrianGilbert",
			sourceCode: ogsaRepo("bepinex-ogsa-ts"),
			description:
				"Publishes motion telemetry (pose and body dynamics) on the local network for motion rigs, from any Unity game BepInEx injects (Mono / BepInEx 5).",
			download: bepinex,
			engine: "Unity",
			unityBackend: "Mono",
			architecture: "X64",
			gameOs: "Windows",
			requiredDependencies: [{ family: "bepinex" }],
			config: {
				destinationPath:
					`${token.GameInstalledModsPath}/bepinex/BepInEx/config/ogsa.telemetry.cfg`,
				destinationType: "File",
			},
			install: {
				manifestPath: `${token.GameInstalledModsPath}/manifests/ogsa-bepinex-mono.json`,
				extract: [
					{
						source: "mono",
						destination:
							`${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/ogsa-bepinex-mono`,
					},
				],
				mainInstalledFolderPath:
					`${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/ogsa-bepinex-mono`,
			},
		},
		{
			id: "ogsa-bepinex-il2cpp",
			family: "ogsa",
			title: "OGSA Telemetry (BepInEx)",
			author: "BrianGilbert",
			sourceCode: ogsaRepo("bepinex-ogsa-ts"),
			description:
				"Publishes motion telemetry (pose and body dynamics) on the local network for motion rigs, from any Unity game BepInEx injects (IL2CPP / BepInEx 6).",
			download: bepinex,
			engine: "Unity",
			unityBackend: "Il2Cpp",
			architecture: "X64",
			gameOs: "Windows",
			requiredDependencies: [{ family: "bepinex" }],
			config: {
				destinationPath:
					`${token.GameInstalledModsPath}/bepinex/BepInEx/config/ogsa.telemetry.cfg`,
				destinationType: "File",
			},
			install: {
				manifestPath: `${token.GameInstalledModsPath}/manifests/ogsa-bepinex-il2cpp.json`,
				extract: [
					{
						source: "il2cpp",
						destination:
							`${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/ogsa-bepinex-il2cpp`,
					},
				],
				mainInstalledFolderPath:
					`${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/ogsa-bepinex-il2cpp`,
			},
		},
		{
			id: "ogsa-uevr",
			family: "ogsa",
			title: "OGSA Telemetry (UEVR)",
			author: "BrianGilbert",
			sourceCode: ogsaRepo("uevr-ogsa-ts"),
			description:
				"Publishes motion telemetry (pose and body dynamics) on the local network for motion rigs, from any Unreal game UEVR injects.",
			download: uevr,
			engine: "Unreal",
			architecture: "X64",
			gameOs: "Windows",
			requiredDependencies: [{ modId: "uevr" }],
			config: {
				destinationPath:
					`${token.SharedModsPath}/uevr/plugins/ogsa_telemetry.ini`,
				destinationType: "File",
			},
			install: {
				manifestPath:
					`${token.SharedModsPath}/uevr/plugins/ogsa-telemetry.rai-pal-manifest.json`,
				extract: [
					{
						source: "ogsa_telemetry.dll",
						destination:
							`${token.SharedModsPath}/uevr/plugins/ogsa_telemetry.dll`,
					},
				],
				mainInstalledFolderPath: `${token.SharedModsPath}/uevr/plugins`,
			},
		},
		{
			id: "ogsa-ue4ss",
			family: "ogsa",
			title: "OGSA Telemetry (UE4SS)",
			author: "BrianGilbert",
			sourceCode: ogsaRepo("ue4ss-ogsa-ts"),
			description:
				"Publishes motion telemetry (pose and body dynamics) on the local network for motion rigs, from any Unreal game UE4SS injects. Requires UE4SS experimental (the runtime Rai Pal installs).",
			download: ue4ss,
			engine: "Unreal",
			architecture: "X64",
			gameOs: "Windows",
			requiredDependencies: [{ modId: "ue4ss" }],
			config: {
				destinationPath:
					`${token.GameInstalledModsPath}/ue4ss/Mods/ogsa_telemetry/ogsa_telemetry.ini`,
				destinationType: "File",
			},
			install: {
				manifestPath: `${token.GameInstalledModsPath}/manifests/ogsa-ue4ss.json`,
				extract: [
					{
						source: "experimental/ogsa_telemetry",
						destination:
							`${token.GameInstalledModsPath}/ue4ss/Mods/ogsa_telemetry`,
					},
				],
				mainInstalledFolderPath:
					`${token.GameInstalledModsPath}/ue4ss/Mods/ogsa_telemetry`,
			},
		},
	];
}
