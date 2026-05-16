import { Mod } from "../../mod.ts";

export default {
	id: "uuvr-mono-legacy",
	engine: "Unity",
	unityBackend: "Mono",
	title: "UUVR Mono Legacy",
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
		url: "https://github.com/Raicuparta/uuvr/releases/download/v0.3.1/uuvr-mono-legacy.zip",
	},
} satisfies Mod;
