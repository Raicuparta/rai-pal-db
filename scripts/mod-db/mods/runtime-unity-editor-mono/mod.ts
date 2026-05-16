import { Mod } from "../mod.ts";
import { bepinexModBase } from "../bepinex-common/bepinex-common.ts";

export default {
	...bepinexModBase("runtime-unity-editor-mono", "Mono"),
	title: "Runtime Unity Editor",
	author: "ManlyMarco",
	sourceCode: "https://github.com/ManlyMarco/RuntimeUnityEditor",
	description:
		"In-game inspector and debugging tools. May work on games where UnityExplorer fails.",
	latestVersion: {
		id: "5.2.1",
		url: "https://github.com/ManlyMarco/RuntimeUnityEditor/releases/download/v5.2.1/RuntimeUnityEditor_BepInEx5_v5.2.1.zip",
		root: "BepInEx",
	},
} satisfies Mod;
