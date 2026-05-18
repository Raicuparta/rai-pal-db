import { ModBase } from "../mod.ts";
import { bepinexMonoLoaderBase } from "../bepinex-common/bepinex-mono.ts";

export default {
	...bepinexMonoLoaderBase("bepinex-mono-x64"),
	architecture: "X64",
	title: "BepInEx Mono X64",
	description: "BepInEx stable Mono build for X64 games.",
	latestVersion: {
		id: "5.4.23.5",
		url: "https://github.com/BepInEx/BepInEx/releases/download/v5.4.23.5/BepInEx_win_x64_5.4.23.5.zip",
	},
} satisfies ModBase;
