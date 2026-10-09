import { ModBase } from "../mod.ts";
import { getGodotLoaderMods } from "./godot-loader.ts";

export async function getGodotMods(): Promise<ModBase[]> {
	return (await Promise.all([
		getGodotLoaderMods(),
	])).flat();
}
