import type { ModBase } from "../mod.ts";
import { heavenVrMod } from "./heaven-vr.ts";
import { linkOnlyMods } from "./link-only.ts";
import { twoForksVrMod } from "./two-forks-vr.ts";

export async function getGameSpecificMods(): Promise<ModBase[]> {
	return [heavenVrMod, twoForksVrMod, ...linkOnlyMods];
}
