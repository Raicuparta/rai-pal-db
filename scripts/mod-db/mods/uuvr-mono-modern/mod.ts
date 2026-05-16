import { Mod } from "../../mod.ts";
import { bepinexModBase } from "../bepinex-common/bepinex-common.ts";

export default {
	...bepinexModBase("uuvr-mono-modern", "Mono", "raicuparta.uuvr.json"),
	title: "UUVR Mono Modern",
	author: "Raicuparta",
	sourceCode: "https://github.com/Raicuparta/uuvr",
	description:
		"Supports OpenXR and OpenVR. Use the Configuration Manager mod to change UUVR settings for each game.",
	engineVersionRange: {
		minimum: {
			major: 2018,
			minor: 4,
		},
	},
	latestVersion: {
		id: "0.4.0",
		url: "https://github.com/Raicuparta/uuvr/releases/download/v0.4.0/uuvr-mono-modern.zip",
	},
} satisfies Mod;
