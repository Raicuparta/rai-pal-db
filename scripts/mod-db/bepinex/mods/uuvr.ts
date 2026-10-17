import { getLatestFromGitHub } from "../../github.ts";
import { ModBase } from "../../mod.ts";
import { bepinexMod } from "../bepinex-mod.ts";

const author = "Raicuparta";
const sourceCode = "https://github.com/Raicuparta/uuvr";

export async function getUuvrMods(): Promise<ModBase[]> {
	const { il2cppLegacy, monoLegacy, monoModern } = await getLatestFromGitHub(
		{ owner: "Raicuparta", repo: "uuvr" },
		{
			il2cppLegacy: (assetName) => assetName.includes("il2cpp-legacy"),
			monoLegacy: (assetName) => assetName.includes("mono-legacy"),
			monoModern: (assetName) => assetName.includes("mono-modern"),
		},
	);

	return [
		bepinexMod(
			{
				id: "uuvr-il2cpp-legacy",
				family: "uuvr",
				unityBackend: "Il2Cpp",
				title: "UUVR",
				author,
				sourceCode,
				description:
					"Uses OpenVR. Start SteamVR before starting the game. Use the Configuration Manager mod to change UUVR settings for each game.",
				engineVersionRange: {
					maximum: {
						major: 2019,
					},
				},
				download: il2cppLegacy,
			},
			{
				withPatchers: true,
				configFileName: "raicuparta.uuvr-legacy.cfg",
			},
		),
		bepinexMod(
			{
				id: "uuvr-mono-legacy",
				family: "uuvr",
				unityBackend: "Mono",
				title: "UUVR",
				author,
				sourceCode,
				description:
					"Uses OpenVR. Start SteamVR before starting the game. Use the Configuration Manager mod to change UUVR settings for each game.",
				engineVersionRange: {
					maximum: {
						major: 2019,
					},
				},
				download: monoLegacy,
			},
			{
				withPatchers: true,
				configFileName: "raicuparta.uuvr-legacy.cfg",
			},
		),
		bepinexMod(
			{
				id: "uuvr-mono-modern",
				family: "uuvr",
				unityBackend: "Mono",
				title: "UUVR",
				author,
				sourceCode,
				description:
					"Supports OpenXR and OpenVR. Use the Configuration Manager mod to change UUVR settings for each game.",
				engineVersionRange: {
					minimum: {
						major: 2018,
						minor: 4,
					},
				},
				download: monoModern,
			},
			{
				withPatchers: true,
				configFileName: "raicuparta.uuvr-modern.cfg",
			},
		),
	];
}
