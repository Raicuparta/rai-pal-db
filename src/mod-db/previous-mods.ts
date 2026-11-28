import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { publicFolder } from "../common/paths.ts";
import { MOD_DATABASE_VERSION } from "../common/versions.ts";
import type { Mod } from "./mod.ts";

let previousMods: Promise<Mod[]> | undefined;

async function readPreviousMods(): Promise<Mod[]> {
	const path = join(
		publicFolder,
		"mod-db",
		String(MOD_DATABASE_VERSION),
		"mods.json",
	);

	try {
		const contents = await readFile(path, "utf8");
		return (JSON.parse(contents) as { mods: Mod[] }).mods;
	} catch {
		return [];
	}
}

export function getPreviousMods(): Promise<Mod[]> {
	previousMods ??= readPreviousMods();
	return previousMods;
}
