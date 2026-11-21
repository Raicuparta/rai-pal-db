import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { MOD_DATABASE_VERSION } from "../common/versions.ts";
import stringify from "canonical-json";
import { hash } from "canonical-json/hash";
import type { Mod, ModBase } from "./mod.ts";
import { getBepinexMods } from "./bepinex/bepinex.ts";
import { getEveryoneMods } from "./everyone.ts";
import { getGodotMods } from "./godot/godot.ts";
import { getUevrMods } from "./uevr/uevr.ts";
import { getUe4ssMods } from "./ue4ss/ue4ss.ts";
import { getGameSpecificMods } from "./game-specific/game-specific.ts";
import { getConfigMods } from "./configs.ts";
import { tags } from "./tags.ts";

type ModGetter = () => Promise<ModBase[]>;

const modGetters: ModGetter[] = [
	getBepinexMods,
	getEveryoneMods,
	getGameSpecificMods,
	getGodotMods,
	getUevrMods,
	getUe4ssMods,
];

const baseMods: ModBase[] = (
	await Promise.all(modGetters.map((getter) => getter()))
).flat();

const configMods = await getConfigMods(baseMods);

const mods: Mod[] = [...baseMods, ...configMods].map((modBase) => ({
	...modBase,
	hash: hash(modBase),
}));

const json = stringify(
	{
		tags,
		mods,
	},
	undefined,
	2,
);

if (!json) {
	throw new Error("Failed to convert mods output to JSON");
}

const targetFolder = join("..", "mod-db", String(MOD_DATABASE_VERSION));

await mkdir(targetFolder, { recursive: true });

await writeFile(join(targetFolder, "mods.json"), json);

process.exit(0);
