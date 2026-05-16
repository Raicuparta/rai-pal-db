import { Mod } from "../mod.ts";
import { bepinexIl2cppLoaderBase } from "../bepinex-common/bepinex-il2cpp.ts";

export default {
	...bepinexIl2cppLoaderBase("bepinex-il2cpp-x64"),
	architecture: "X64",
	title: "BepInEx Il2Cpp X64",
	description: "BepInEx bleeding-edge Il2Cpp build for X64 games.",
	latestVersion: {
		id: "6.0.0-be.755",
		url: "https://builds.bepinex.dev/projects/bepinex_be/755/BepInEx-Unity.IL2CPP-win-x64-6.0.0-be.755%2B3fab71a.zip",
	},
} satisfies Mod;
