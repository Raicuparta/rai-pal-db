import { ModBase } from "../mod.ts";
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
	latestVersion: {
		id: "1.05",
		url: "https://github.com/praydog/UEVR/releases/download/1.05/UEVR.zip",
	},
} satisfies ModBase;
