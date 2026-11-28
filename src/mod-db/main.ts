import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { publicFolder } from "../common/paths.ts";
import { MOD_DATABASE_VERSION } from "../common/versions.ts";
import stringify from "canonical-json";
import { hash } from "canonical-json/hash";
import { discoverMods } from "./discover-mods.ts";
import type { Mod } from "./mod.ts";
import { tags } from "./tags.ts";
import { validateExtracts } from "./validate-extracts.ts";

const discoveredMods = await discoverMods();
await validateExtracts(discoveredMods);

const mods: Mod[] = discoveredMods.map((mod) => ({
	...mod,
	hash: hash(mod),
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

const targetFolder = join(publicFolder, "mod-db", String(MOD_DATABASE_VERSION));

await mkdir(targetFolder, { recursive: true });

await writeFile(join(targetFolder, "mods.json"), json);

process.exit(0);
