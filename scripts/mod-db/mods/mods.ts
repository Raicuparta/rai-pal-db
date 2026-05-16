import type { Mod } from "./mod.ts";

export async function getMods(): Promise<Mod[]> {
	const entries: string[] = [];

	for await (const entry of Deno.readDir(new URL(".", import.meta.url))) {
		if (entry.isDirectory) entries.push(entry.name);
	}

	const modules = await Promise.all(
		entries.sort().map(async (name) => {
			try {
				const mod = await import(
					new URL(`./${name}/mod.ts`, import.meta.url).href
				);
				return mod.default as Mod;
			} catch {
				return null;
			}
		}),
	);

	return modules.filter((m): m is Mod => m !== null);
}
