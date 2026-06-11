import { bepinexMod } from "../bepinex-mod.ts";

// deno-lint-ignore require-await
export async function getEveryoneMods() {
	return [
		bepinexMod({
			id: "everyone-mono",
			unityBackend: "Mono",
			engineVersionRange: {
				minimum: {
					major: 5,
				},
			},
			title: "Everyone",
			author: "Raicuparta",
			sourceCode: "https://github.com/Raicuparta/everyone",
			description: "Mono version. Work in progress! F3 to chat.",
			download: {
				id: "0.2.0",
				url:
					"https://github.com/Raicuparta/rai-pal-db/releases/download/everyone-v0.2.0/EveryoneClient.BepInEx5.Mono.zip",
			},
		}, {
			configFileName: "raicuparta.everyone.json",
		}),
		bepinexMod({
			id: "everyone-il2cpp",
			unityBackend: "Il2Cpp",
			title: "Everyone",
			author: "Raicuparta",
			sourceCode: "https://github.com/Raicuparta/everyone",
			description: "IL2CPP version. Work in progress! F3 to chat.",
			download: {
				id: "0.2.0",
				url:
					"https://github.com/Raicuparta/rai-pal-db/releases/download/everyone-v0.2.0/EveryoneClient.BepInEx.Unity.IL2CPP.CoreCLR.zip",
			},
		}, {
			configFileName: "raicuparta.everyone.json",
		}),
	];
}
