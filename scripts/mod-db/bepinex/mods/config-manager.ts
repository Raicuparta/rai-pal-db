import type { ModBase } from "../../mod.ts";
import { bepinexModHelper } from "../bepinex-mod.ts";

export async function getConfigManagerMods(): Promise<ModBase[]> {
	const il2cpp = bepinexModHelper("config-manager-il2cpp");
	const mono = bepinexModHelper("config-manager-mono");

	return [
		{
			id: il2cpp.id,
			...il2cpp.base,
			unityBackend: "Il2Cpp",
			title: "Config Manager",
			tags: ["unity-config-manager"],
			author: "sinai",
			website: "https://github.com/Vapok/BepInExConfigManager",
			description:
				"Press F5 to show an in-game menu for changing mod settings. Use this with UUVR. Not compatible with UnityExplorer.",
			download: {
				id: "1.0.0",
				url: "https://github.com/Vapok/BepInExConfigManager/releases/download/v1.0.0/Vapok-BepInExConfigManager-1.0.0.zip",
			},
			install: {
				manifestPath: il2cpp.manifestPath(),
				extract: [il2cpp.extract.plugin(), il2cpp.extract.patch()],
			},
			paths: [il2cpp.paths.plugin(), il2cpp.paths.patcher()],
		},
		{
			id: mono.id,
			...mono.base,
			unityBackend: "Mono",
			title: "Config Manager",
			tags: ["unity-config-manager"],
			author: "sinai",
			website: "https://github.com/sinai-dev/BepInExConfigManager",
			description:
				"Press F5 to show an in-game menu for changing mod settings. Use this with UUVR.",
			download: {
				id: "1.3.0",
				url: "https://github.com/sinai-dev/BepInExConfigManager/releases/download/1.3.0/BepInExConfigManager.Mono.zip",
			},
			install: {
				manifestPath: mono.manifestPath(),
				extract: [mono.extract.plugin(), mono.extract.patch()],
			},
			paths: [mono.paths.plugin(), mono.paths.patcher()],
		},
	];
}
