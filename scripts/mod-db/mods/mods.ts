import type { ModBase, Mod } from "./mod.ts";

export async function getMods(): Promise<Mod[]> {
	const entries: string[] = [];

	for await (const entry of Deno.readDir(new URL(".", import.meta.url))) {
		if (entry.isDirectory) entries.push(entry.name);
	}

	const mods: Mod[] = [];

	await Promise.all(
		entries.sort().map(async (name) => {
			try {
				const mod = (
					await import(new URL(`./${name}/mod.ts`, import.meta.url).href)
				).default as ModBase;

				mods.push({
					...mod,
					manifestUpdatedAt: Date.now(),
				});
			} catch {
				return null;
			}
		}),
	);

	return mods;
}
