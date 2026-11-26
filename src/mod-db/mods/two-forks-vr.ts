import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { defineMod } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

const base = bepinexModBase("TwoForksVr");

const copyToGameFiles = [
	"Firewatch_Data/Plugins/LIV_Bridge.dll",
	"Firewatch_Data/Plugins/openvr_api.dll",
	"Firewatch_Data/Plugins/openvr_mod.cfg",
];

export default defineMod({
	id: base.id,
	...base.base,
	gameIds: {
		Steam: ["383870"],
		Gog: ["1459256379"],
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
		installKind: base.installKind,
		extract: [
			base.extract.plugin(),
			{
				source: "plugins/TwoForksVrAssets",
				destination: `${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/TwoForksVrAssets`,
			},
			base.extract.patcher(),
			...copyToGameFiles.map((filePath) => ({
				source: `CopyToGame/${filePath}`,
				destination: `${token.GameExecutableFolderPath}/${filePath}`,
			})),
		],
	},
	paths: [base.paths.plugin(), base.paths.patcher(), base.paths.logOutput()],
});
