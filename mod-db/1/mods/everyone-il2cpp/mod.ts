import { Mod } from "../../mod.ts";

export default {
	id: "everyone-il2cpp",
	engine: "Unity",
	unityBackend: "Il2Cpp",
	title: "Everyone",
	author: "Raicuparta",
	sourceCode: "https://github.com/Raicuparta/everyone",
	description: "IL2CPP version. Work in progress! F3 to chat.",
	latestVersion: {
		id: "0.1.0",
		url: "https://github.com/Raicuparta/rai-pal-db/releases/download/everyone-v0.1.0/EveryoneClient.BepInEx.Unity.IL2CPP.CoreCLR.zip",
	},
	configs: {
		destinationPath: "config/raicuparta.everyone.json",
		destinationType: "File",
	},
} satisfies Mod;
