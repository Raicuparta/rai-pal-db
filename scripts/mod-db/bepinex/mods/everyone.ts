import { bepinexMod } from "../bepinex-mod.ts";

// deno-lint-ignore require-await
export async function getEveryoneMods() {
	return [
		bepinexMod({
			id: "everyone-mono",
			family: "everyone",
			unityBackend: "Mono",
			title: "Everyone (Mono)",
			author: "Raicuparta",
			sourceCode: "https://github.com/Raicuparta/everyone",
			description:
				"Adds multiplayerish features. Requires being logged in to Rai Pal. F3 to chat.",
			download: {
				id: "0.2.1",
				url:
					"https://github.com/Raicuparta/rai-pal-db/releases/download/everyone-v0.2.1/EveryoneClient.BepInEx5.Mono.zip",
			},
		}, {
			configFileName: "raicuparta.everyone.json",
		}),
		bepinexMod({
			id: "everyone-il2cpp",
			family: "everyone",
			unityBackend: "Il2Cpp",
			title: "Everyone (Il2Cpp)",
			author: "Raicuparta",
			sourceCode: "https://github.com/Raicuparta/everyone",
			description:
				"Adds multiplayerish features. Requires being logged in to Rai Pal. F3 to chat.",
			download: {
				id: "0.2.1",
				url:
					"https://github.com/Raicuparta/rai-pal-db/releases/download/everyone-v0.2.1/EveryoneClient.BepInEx.Unity.IL2CPP.CoreCLR.zip",
			},
		}, {
			configFileName: "raicuparta.everyone.json",
		}),
	];
}
