import { Mod } from "../mod.ts";
import { bepinexModBase } from "../bepinex-common/bepinex-common.ts";

export default {
	...bepinexModBase("config-manager-mono", "Mono"),
	title: "Config Manager Mono",
	author: "sinai",
	sourceCode: "https://github.com/sinai-dev/BepInExConfigManager",
	description:
		"Press F5 to show an in-game menu for changing mod settings. Use this with UUVR.",
	latestVersion: {
		id: "1.3.0",
		url: "https://github.com/sinai-dev/BepInExConfigManager/releases/download/1.3.0/BepInExConfigManager.Mono.zip",
	},
} satisfies Mod;
