import { getLatestFromGitHub } from "./github.ts";
import { ModBase } from "./mod.ts";
import { token } from "./replacement-tokens.ts";

const ogsRepo = (repo: string) => `https://github.com/BrianGilbert/${repo}`;

const ogsAsset = (prefix: string) => (assetName: string) =>
	assetName.startsWith(`${prefix}_ogs_telemetry-`) &&
	assetName.endsWith("-win64.zip");

export async function getOgsMods(): Promise<ModBase[]> {
	const { bepinex } = await getLatestFromGitHub(
		{ owner: "BrianGilbert", repo: "bepinex-ogs-ts" },
		{ bepinex: ogsAsset("bepinex") },
	);

	const { uevr } = await getLatestFromGitHub(
		{ owner: "BrianGilbert", repo: "uevr-ogs-ts" },
		{ uevr: ogsAsset("uevr") },
	);

	const { ue4ss } = await getLatestFromGitHub(
		{ owner: "BrianGilbert", repo: "ue4ss-ogs-ts" },
		{ ue4ss: ogsAsset("ue4ss") },
	);

	return [
		{
			id: "ogs-bepinex-mono",
			family: "ogs",
			title: "OGS Telemetry (BepInEx)",
			author: "BrianGilbert",
			sourceCode: ogsRepo("bepinex-ogs-ts"),
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
					`${token.GameInstalledModsPath}/bepinex/BepInEx/config/ogs.telemetry.cfg`,
				destinationType: "File",
			},
			install: {
				manifestPath: `${token.GameInstalledModsPath}/manifests/ogs-bepinex-mono.json`,
				extract: [
					{
						source: "mono",
						destination:
							`${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/ogs-bepinex-mono`,
					},
				],
				mainInstalledFolderPath:
					`${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/ogs-bepinex-mono`,
			},
		},
		{
			id: "ogs-bepinex-il2cpp",
			family: "ogs",
			title: "OGS Telemetry (BepInEx)",
			author: "BrianGilbert",
			sourceCode: ogsRepo("bepinex-ogs-ts"),
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
					`${token.GameInstalledModsPath}/bepinex/BepInEx/config/ogs.telemetry.cfg`,
				destinationType: "File",
			},
			install: {
				manifestPath: `${token.GameInstalledModsPath}/manifests/ogs-bepinex-il2cpp.json`,
				extract: [
					{
						source: "il2cpp",
						destination:
							`${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/ogs-bepinex-il2cpp`,
					},
				],
				mainInstalledFolderPath:
					`${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/ogs-bepinex-il2cpp`,
			},
		},
		{
			id: "ogs-uevr",
			family: "ogs",
			title: "OGS Telemetry (UEVR)",
			author: "BrianGilbert",
			sourceCode: ogsRepo("uevr-ogs-ts"),
			description:
				"Publishes motion telemetry (pose and body dynamics) on the local network for motion rigs, from any Unreal game UEVR injects.",
			download: uevr,
			engine: "Unreal",
			architecture: "X64",
			gameOs: "Windows",
			requiredDependencies: [{ modId: "uevr" }],
			config: {
				destinationPath:
					`${token.SharedModsPath}/uevr/plugins/ogs_telemetry.ini`,
				destinationType: "File",
			},
			install: {
				manifestPath:
					`${token.SharedModsPath}/uevr/plugins/ogs-telemetry.rai-pal-manifest.json`,
				extract: [
					{
						source: "ogs_telemetry.dll",
						destination:
							`${token.SharedModsPath}/uevr/plugins/ogs_telemetry.dll`,
					},
				],
				mainInstalledFolderPath: `${token.SharedModsPath}/uevr/plugins`,
			},
		},
		{
			id: "ogs-ue4ss",
			family: "ogs",
			title: "OGS Telemetry (UE4SS)",
			author: "BrianGilbert",
			sourceCode: ogsRepo("ue4ss-ogs-ts"),
			description:
				"Publishes motion telemetry (pose and body dynamics) on the local network for motion rigs, from any Unreal game UE4SS injects. Requires UE4SS experimental (the runtime Rai Pal installs).",
			download: ue4ss,
			engine: "Unreal",
			architecture: "X64",
			gameOs: "Windows",
			requiredDependencies: [{ modId: "ue4ss" }],
			config: {
				destinationPath:
					`${token.GameInstalledModsPath}/ue4ss/Mods/ogs_telemetry/ogs_telemetry.ini`,
				destinationType: "File",
			},
			install: {
				manifestPath: `${token.GameInstalledModsPath}/manifests/ogs-ue4ss.json`,
				extract: [
					{
						source: "experimental/ogs_telemetry",
						destination:
							`${token.GameInstalledModsPath}/ue4ss/Mods/ogs_telemetry`,
					},
				],
				mainInstalledFolderPath:
					`${token.GameInstalledModsPath}/ue4ss/Mods/ogs_telemetry`,
			},
		},
	];
}
