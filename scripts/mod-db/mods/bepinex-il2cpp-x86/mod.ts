import { ModBase } from "../mod.ts";
import { bepinexIl2cppLoaderBase } from "../bepinex-common/bepinex-il2cpp.ts";

export default {
	...bepinexIl2cppLoaderBase("bepinex-il2cpp-x86"),
	architecture: "X86",
	title: "BepInEx Il2Cpp X86",
	description: "BepInEx bleeding-edge Il2Cpp build for X86 games.",
	latestVersion: {
		id: "6.0.0-be.755",
		url: "https://builds.bepinex.dev/projects/bepinex_be/755/BepInEx-Unity.IL2CPP-win-x86-6.0.0-be.755%2B3fab71a.zip",
	},
} satisfies ModBase;
