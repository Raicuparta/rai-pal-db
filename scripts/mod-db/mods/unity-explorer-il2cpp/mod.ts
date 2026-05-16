import { Mod } from "../../mod.ts";
import { bepinexModBase } from "../bepinex-common/bepinex-common.ts";

export default {
	...bepinexModBase("unity-explorer-il2cpp", "Il2Cpp"),
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
