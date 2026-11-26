import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { defineMod } from "../mod.ts";

const base = bepinexModBase("config-manager-il2cpp");

export default defineMod({
	id: base.id,
	...base.base,
	unityBackend: "Il2Cpp",
	tags: ["unity-config-manager"],
	title: "Config Manager",
	author: "sinai",
	website: "https://github.com/Vapok/BepInExConfigManager",
	description:
		"Press F5 to show an in-game menu for changing mod settings. Use this with UUVR. Not compatible with UnityExplorer.",
	download: {
		id: "1.0.0",
		url: "https://github.com/Vapok/BepInExConfigManager/releases/download/v1.0.0/Vapok-BepInExConfigManager-1.0.0.zip",
	},
	install: {
		installKind: base.installKind,
		extract: [base.extract.plugin(), base.extract.patcher()],
	},
	paths: [base.paths.plugin(), base.paths.patcher(), base.paths.logOutput()],
});
