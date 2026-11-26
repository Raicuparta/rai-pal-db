import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { defineMod } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

const base = bepinexModBase("HeavenVr");

const copyToGameFiles = [
	"Neon White_Data/Plugins/x86_64/LIV_Bridge.dll",
	"Neon White_Data/Plugins/x86_64/openxr_loader.dll",
	"Neon White_Data/Plugins/x86_64/UnityOpenXR.dll",
	"Neon White_Data/UnitySubsystems/UnityOpenXR/UnitySubsystemsManifest.json",
];

export default defineMod({
	id: base.id,
	...base.base,
	gameIds: {
		Steam: ["1533420"],
	},
	tags: ["game-specific-vr"],
	unityBackend: "Mono",
	architecture: "X64",
	title: "HeavenVR",
	author: "Raicuparta",
	website: "https://github.com/Raicuparta/heaven-vr",
	description: "VR mod for Neon White, with full motion control support.",
	download: {
		id: "1.0.0",
		url: "https://github.com/Raicuparta/heaven-vr/releases/download/v1.0.0/heaven-vr.zip",
	},
	install: {
		installKind: base.installKind,
		extract: [
			{ source: "plugins/HeavenVr", destination: base.pluginFolder },
			...copyToGameFiles.map((filePath) => ({
				source: `CopyToGame/${filePath}`,
				destination: `${token.GameExecutableFolderPath}/${filePath}`,
			})),
		],
	},
	paths: [base.paths.plugin(), base.paths.logOutput()],
});
