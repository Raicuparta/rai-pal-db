import { Mod } from "../mod.ts";
import { bepinexMonoLoaderBase } from "../bepinex-common/bepinex-mono.ts";

export default {
	...bepinexMonoLoaderBase("bepinex-mono-x86"),
	architecture: "X86",
	title: "BepInEx Mono X86",
	description: "BepInEx stable Mono build for X86 games.",
	latestVersion: {
		id: "5.4.23.5",
		url: "https://github.com/BepInEx/BepInEx/releases/download/v5.4.23.5/BepInEx_win_x86_5.4.23.5.zip",
	},
} satisfies Mod;
