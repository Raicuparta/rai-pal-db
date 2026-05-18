import type { ModBase, Mod } from "./mod.ts";
import { hash } from "canonical-json/hash";

export async function getMods(): Promise<Mod[]> {
	const entries: string[] = [];

	for await (const entry of Deno.readDir(new URL(".", import.meta.url))) {
		if (entry.isDirectory) entries.push(entry.name);
	}

	const mods: Mod[] = [];

	await Promise.all(
		entries.map(async (name) => {
			let mod: ModBase | undefined;
			try {
				mod = (await import(new URL(`./${name}/mod.ts`, import.meta.url).href))
					.default;
			} catch {
				return;
			}

			if (!mod) {
				throw new Error(`Mod came up empty for ${name}.`);
			}

			mods.push({
				...mod,
				hash: hash(mod),
			});
		}),
	);

	return mods.sort((a, b) => a.id.localeCompare(b.id));
}
