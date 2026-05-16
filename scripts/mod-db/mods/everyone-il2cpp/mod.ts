import { Mod } from "../mod.ts";
import { bepinexModBase } from "../bepinex-common/bepinex-common.ts";

export default {
	...bepinexModBase("everyone-il2cpp", "Il2Cpp", "raicuparta.everyone.json"),
	title: "Everyone",
	author: "Raicuparta",
	sourceCode: "https://github.com/Raicuparta/everyone",
	description: "IL2CPP version. Work in progress! F3 to chat.",
	latestVersion: {
		id: "0.1.0",
		url: "https://github.com/Raicuparta/rai-pal-db/releases/download/everyone-v0.1.0/EveryoneClient.BepInEx.Unity.IL2CPP.CoreCLR.zip",
	},
} satisfies Mod;
