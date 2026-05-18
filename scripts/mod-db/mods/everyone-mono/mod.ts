import { ModBase } from "../mod.ts";
import { bepinexModBase } from "../bepinex-common/bepinex-common.ts";

export default {
	...bepinexModBase("everyone-mono", "Mono", "raicuparta.everyone.json"),
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
} satisfies ModBase;
