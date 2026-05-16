import { Mod } from "../../mod.ts";
import { bepinexMonoActions } from "../bepinex-common/bepinex-mono.ts";

export default {
	id: "bepinex-mono-x86",
	engine: "Unity",
	architecture: "X86",
	unityBackend: "Mono",
	title: "BepInEx Mono X86",
	author: "BepInEx",
	sourceCode: "https://github.com/BepInEx/BepInEx",
	description: "BepInEx stable Mono build for X86 games.",
	latestVersion: {
		id: "5.4.23.5",
		url: "https://github.com/BepInEx/BepInEx/releases/download/v5.4.23.5/BepInEx_win_x86_5.4.23.5.zip",
	},
	actions: bepinexMonoActions,
} satisfies Mod;
