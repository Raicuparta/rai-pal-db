import { ModBase } from "../mod.ts";
import { getGodotLoaderMods } from "./godot-loader.ts";
import { getGodotEveryoneMods } from "./mods/everyone.ts";

export async function getGodotMods(): Promise<ModBase[]> {
	return (await Promise.all([
		getGodotLoaderMods(),
		getGodotEveryoneMods(),
	])).flat();
}
