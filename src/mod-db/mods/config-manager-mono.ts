import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { defineMod } from "../mod.ts";

const base = bepinexModBase("config-manager-mono");

export default defineMod({
	id: base.id,
	...base.base,
	unityBackend: "Mono",
	tags: ["unity-config-manager"],
	title: "Config Manager",
	author: "sinai",
	website: "https://github.com/sinai-dev/BepInExConfigManager",
	description:
		"Press F5 to show an in-game menu for changing mod settings. Use this with UUVR.",
	download: {
		id: "1.3.0",
		url: "https://github.com/sinai-dev/BepInExConfigManager/releases/download/1.3.0/BepInExConfigManager.Mono.zip",
	},
	install: {
		installKind: base.installKind,
		extract: [base.extract.plugin(), base.extract.patcher()],
	},
	paths: [base.paths.plugin(), base.paths.patcher(), base.paths.logOutput()],
});
