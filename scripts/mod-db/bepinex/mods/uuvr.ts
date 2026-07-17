import { ModBase } from "../../mod.ts";
import { bepinexMod } from "../bepinex-mod.ts";

// deno-lint-ignore require-await
export async function getUuvrMods(): Promise<ModBase[]> {
	return [
		bepinexMod({
			id: "uuvr-il2cpp-legacy",
			family: "uuvr",
			unityBackend: "Il2Cpp",
			title: "UUVR Il2Cpp Legacy",
			author: "Raicuparta",
			sourceCode: "https://github.com/Raicuparta/uuvr",
			description:
				"Uses OpenVR. Start SteamVR before starting the game. Use the Configuration Manager mod to change UUVR settings for each game.",
			engineVersionRange: {
				maximum: {
					major: 2019,
				},
			},
			download: {
				id: "0.3.1",
				url:
					"https://github.com/Raicuparta/uuvr/releases/download/v0.3.1/uuvr-il2cpp-legacy.zip",
			},
		}, {
			configFileName: "raicuparta.uuvr-legacy.cfg",
		}),
		bepinexMod({
			id: "uuvr-mono-legacy",
			family: "uuvr",
			unityBackend: "Mono",
			title: "UUVR Mono Legacy",
			author: "Raicuparta",
			sourceCode: "https://github.com/Raicuparta/uuvr",
			description:
				"Uses OpenVR. Start SteamVR before starting the game. Use the Configuration Manager mod to change UUVR settings for each game.",
			engineVersionRange: {
				maximum: {
					major: 2019,
				},
			},
			download: {
				id: "0.3.1",
				url:
					"https://github.com/Raicuparta/uuvr/releases/download/v0.3.1/uuvr-mono-legacy.zip",
			},
		}, {
			configFileName: "raicuparta.uuvr-legacy.cfg",
		}),
		bepinexMod({
			id: "uuvr-mono-modern",
			family: "uuvr",
			unityBackend: "Mono",
			title: "UUVR Mono Modern",
			author: "Raicuparta",
			sourceCode: "https://github.com/Raicuparta/uuvr",
			description:
				"Supports OpenXR and OpenVR. Use the Configuration Manager mod to change UUVR settings for each game.",
			engineVersionRange: {
				minimum: {
					major: 2018,
					minor: 4,
				},
			},
			download: {
				id: "0.4.0",
				url:
					"https://github.com/Raicuparta/uuvr/releases/download/v0.4.0/uuvr-mono-modern.zip",
			},
		}, {
			configFileName: "raicuparta.uuvr-modern.cfg",
		}),
	];
}
