import { Mod } from "../../mod.ts";
import { bepinexModBase } from "../bepinex-common/bepinex-common.ts";

export default {
	...bepinexModBase("unity-explorer-mono", "Mono"),
	title: "UnityExplorer Mono",
	author: "Sinai",
	sourceCode: "https://github.com/sinai-dev/UnityExplorer",
	description:
		"An in-game UI for exploring, debugging and modifying Unity games.",
	latestVersion: {
		id: "4.9.0",
		url: "https://github.com/sinai-dev/UnityExplorer/releases/download/4.9.0/UnityExplorer.BepInEx5.Mono.zip",
	},
} satisfies Mod;
