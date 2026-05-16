import { Mod } from "../../mod.ts";

export default {
	id: "everyone-mono",
	engine: "Unity",
	unityBackend: "Mono",
	engineVersionRange: {
		minimum: {
			major: 5,
		},
	},
	title: "Everyone",
	author: "Raicuparta",
	sourceCode: "https://github.com/Raicuparta/everyone",
	description: "Mono version. Work in progress! F3 to chat.",
	latestVersion: {
		id: "0.1.0",
		url: "https://github.com/Raicuparta/rai-pal-db/releases/download/everyone-v0.1.0/EveryoneClient.BepInEx5.Mono.zip",
	},
	actions: {
		install: {
			extract: [
				{
					source: "plugins",
					destination:
						"{{InstalledModsPath}}/bepinex/BepInEx/plugins/{{ModId}}",
				},
			],
		},
		getModFolderForGame: {
			path: "{{InstalledModsPath}}/bepinex/BepInEx/plugins/{{ModId}}",
		},
		getConfig: {
			destinationPath:
				"{{InstalledModsPath}}/bepinex/BepInEx/config/raicuparta.everyone.json",
			destinationType: "File",
		},
	},
	dependencies: [
		{
			modId: "bepinex-mono-x64",
		},
		{
			modId: "bepinex-mono-x86",
		},
	],
} satisfies Mod;
