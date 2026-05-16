import { Mod } from "../mod.ts";
import { uevrBaseMod } from "../uevr-common/uevr-common.ts";

export default {
	...uevrBaseMod("uevr-nightly"),
	title: "UEVR Nightly",
	// github: {
	// 	assetName: "uevr.zip",
	// 	repo: "UEVR-nightly",
	// 	user: "praydog",
	// },
	description:
		"UEVR automatically built from the latest, potentially untested code changes.",
} satisfies Mod;
