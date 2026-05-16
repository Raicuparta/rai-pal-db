import { Mod } from "../mod.ts";
import { uevrBaseMod } from "../uevr-common/uevr-common.ts";

export default {
	...uevrBaseMod("uevr"),
	title: "UEVR",
	// github: {
	// 	assetName: "UEVR.zip",
	// 	repo: "UEVR",
	// 	user: "praydog",
	// },
	description: "Universal VR mod for Unreal Engine games.",
} satisfies Mod;
