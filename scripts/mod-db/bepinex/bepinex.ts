import { ModBase } from "../mod.ts";
import { getGepInExConfigs } from "./bepinex-config.ts";
import { getBepInExIl2cppLoaders } from "./bepinex-il2cpp.ts";
import { getBepInExMonoLoaders } from "./bepinex-mono.ts";
import { getConfigManagerMods } from "./mods/config-manager.ts";
import { getEveryoneMods } from "./mods/everyone.ts";
import { getRuntimeUnityEditorMods } from "./mods/runtime-unity-editor.ts";
import { getUnityExplorerMods } from "./mods/unity-explorer.ts";
import { getUuvrMods } from "./mods/uuvr.ts";

export async function getBepinexMods(): Promise<ModBase[]> {
	return (await Promise.all([
		getBepInExIl2cppLoaders(),
		getBepInExMonoLoaders(),
		getGepInExConfigs(),
		getUuvrMods(),
		getEveryoneMods(),
		getConfigManagerMods(),
		getUnityExplorerMods(),
		getRuntimeUnityEditorMods(),
	])).flat();
}
