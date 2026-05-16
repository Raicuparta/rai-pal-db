import { Mod } from "../../mod.ts";

export default {
	id: "config-manager-il2cpp",
	engine: "Unity",
	unityBackend: "Il2Cpp",
	title: "Config Manager IL2CPP",
	author: "sinai",
	sourceCode: "https://github.com/Vapok/BepInExConfigManager",
	description:
		"Press F5 to show an in-game menu for changing mod settings. Use this with UUVR. Not compatible with UnityExplorer.",
	latestVersion: {
		id: "1.0.0",
		url: "https://github.com/Vapok/BepInExConfigManager/releases/download/v1.0.0/Vapok-BepInExConfigManager-1.0.0.zip",
	},
} satisfies Mod;
