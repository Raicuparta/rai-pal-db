import { Mod } from "../mod.ts";
import { bepinexMonoActions } from "../bepinex-common/bepinex-mono.ts";

export default {
	id: "bepinex-mono-x64",
	engine: "Unity",
	architecture: "X64",
	unityBackend: "Mono",
	title: "BepInEx Mono X64",
	author: "BepInEx",
	sourceCode: "https://github.com/BepInEx/BepInEx",
	description: "BepInEx stable Mono build for X64 games.",
	latestVersion: {
		id: "5.4.23.5",
		url: "https://github.com/BepInEx/BepInEx/releases/download/v5.4.23.5/BepInEx_win_x64_5.4.23.5.zip",
	},
	actions: bepinexMonoActions,
} satisfies Mod;
