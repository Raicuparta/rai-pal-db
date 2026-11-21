import type { ModBase } from "../mod.ts";
import { bepinexModHelper } from "../bepinex/bepinex-mod.ts";
import { token } from "../replacement-tokens.ts";

const twoForksVr = bepinexModHelper("two-forks-vr");

export const twoForksVrMod: ModBase = {
	id: twoForksVr.id,
	...twoForksVr.base,
	gameIds: {
		Steam: ["383870"],
		Gog: ["1459256379"],
		NormalizedTitle: ["firewatch"],
	},
	tags: ["game-specific-vr"],
	unityBackend: "Mono",
	architecture: "X64",
	title: "Two Forks VR",
	author: "Raicuparta",
	website: "https://github.com/Raicuparta/two-forks-vr",
	description: "VR mod for Firewatch.",
	download: {
		id: "2.1.0",
		url: "https://github.com/Raicuparta/two-forks-vr/releases/download/v2.1.0/two-forks-vr.zip",
	},
	install: {
		manifestPath: twoForksVr.manifestPath(),
		extract: [
			twoForksVr.extract.plugin(),
			twoForksVr.extract.patch(),
			{
				source: "CopyToGame",
				destination: token.GameExecutableFolderPath,
			},
		],
	},
	paths: [twoForksVr.paths.plugin(), twoForksVr.paths.patcher()],
};
