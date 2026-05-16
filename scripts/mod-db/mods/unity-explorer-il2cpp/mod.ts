import { Mod } from "../../mod.ts";

export default {
	id: "unity-explorer-il2cpp",
	engine: "Unity",
	unityBackend: "Il2Cpp",
	title: "UnityExplorer Il2Cpp",
	author: "Sinai",
	sourceCode: "https://github.com/sinai-dev/UnityExplorer",
	description:
		"An in-game UI for exploring, debugging and modifying Unity games. Not compatible with Config Manager.",
	latestVersion: {
		id: "4.12.1",
		url: "https://github.com/yukieiji/UnityExplorer/releases/download/v4.12.1/UnityExplorer.BepInEx.Unity.IL2CPP.CoreCLR.zip",
	},
} satisfies Mod;
