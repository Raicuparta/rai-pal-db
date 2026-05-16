import { Mod } from "../../mod.ts";
import { bepinexModBase } from "../bepinex-common/bepinex-common.ts";

export default {
	...bepinexModBase("uuvr-il2cpp-legacy", "Il2Cpp", "raicuparta.uuvr.json"),
	title: "UUVR Il2Cpp Legacy",
	author: "Raicuparta",
	sourceCode: "https://github.com/Raicuparta/uuvr",
	description:
		"Uses OpenVR. Start SteamVR before starting the game. Use the Configuration Manager mod to change UUVR settings for each game.",
	engineVersionRange: {
		maximum: {
			major: 2019,
		},
	},
	latestVersion: {
		id: "0.3.1",
		url: "https://github.com/Raicuparta/uuvr/releases/download/v0.3.1/uuvr-il2cpp-legacy.zip",
	},
} satisfies Mod;
