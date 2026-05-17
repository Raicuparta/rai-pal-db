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
	latestVersion: {
		id: "nightly-01127-6f66affc01cea22e4b1b5a47986e1ade80ccbd26",
		url: "https://github.com/praydog/UEVR-nightly/releases/download/nightly-01127-6f66affc01cea22e4b1b5a47986e1ade80ccbd26/uevr.zip",
	},
} satisfies Mod;
