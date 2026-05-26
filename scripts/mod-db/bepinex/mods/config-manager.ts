import { bepinexMod } from "../bepinex-mod.ts";

// deno-lint-ignore require-await
export async function getConfigManagerMods() {
	return [
		bepinexMod({
			id: "config-manager-il2cpp",
			unityBackend: "Il2Cpp",
			title: "Config Manager IL2CPP",
			author: "sinai",
			sourceCode: "https://github.com/Vapok/BepInExConfigManager",
			description:
				"Press F5 to show an in-game menu for changing mod settings. Use this with UUVR. Not compatible with UnityExplorer.",
			latestVersion: {
				id: "1.0.0",
				url:
					"https://github.com/Vapok/BepInExConfigManager/releases/download/v1.0.0/Vapok-BepInExConfigManager-1.0.0.zip",
			},
		}),
		bepinexMod({
			id: "config-manager-mono",
			unityBackend: "Mono",
			title: "Config Manager Mono",
			author: "sinai",
			sourceCode: "https://github.com/sinai-dev/BepInExConfigManager",
			description:
				"Press F5 to show an in-game menu for changing mod settings. Use this with UUVR.",
			latestVersion: {
				id: "1.3.0",
				url:
					"https://github.com/sinai-dev/BepInExConfigManager/releases/download/1.3.0/BepInExConfigManager.Mono.zip",
			},
		}),
	];
}
