import {
	getCachedZipEntries,
	getZipEntries,
	zipHasSource,
} from "./helpers/zip-extracts.ts";
import type { ModBase } from "./mod.ts";
import { getPreviousMods } from "./previous-mods.ts";

export async function validateExtracts(mods: ModBase[]): Promise<void> {
	const previousMods = await getPreviousMods();
	const previousById = new Map(previousMods.map((mod) => [mod.id, mod]));

	for (const mod of mods) {
		const extracts = mod.install?.extract;
		if (!extracts?.length) {
			continue;
		}

		if (!mod.download) {
			throw new Error(`Mod has extract steps but no download: ${mod.id}`);
		}

		const previous = previousById.get(mod.id);
		const versionChanged =
			!previous ||
			previous.download?.id !== mod.download.id ||
			previous.download?.url !== mod.download.url;
		const previousSources = new Set(
			(previous?.install?.extract ?? []).map((extract) => extract.source),
		);
		const hasNewSource = extracts.some(
			(extract) => !previousSources.has(extract.source),
		);
		const cachedEntries = getCachedZipEntries(mod.download);

		if (!versionChanged && !hasNewSource && !cachedEntries) {
			continue;
		}

		const entries = await (cachedEntries ?? getZipEntries(mod.download));

		for (const extract of extracts) {
			if (!zipHasSource(entries, extract.source)) {
				throw new Error(
					`Mod extract source not found in zip: mod=${mod.id} source=${extract.source}`,
				);
			}
		}
	}
}
