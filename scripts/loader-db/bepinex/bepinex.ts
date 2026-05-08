import { getBepInExBleedingReleases } from "#loader-db/bepinex/bepinex-bleeding.ts";
import { getBepInExStableReleases } from "#loader-db/bepinex/bepinex-stable.ts";
import { LoaderDatabase } from "#loader-db/main.ts";

export async function getBepInExDatabase(): Promise<LoaderDatabase> {
	return {
		id: "bepinex",
		releases: (
			await Promise.all([
				getBepInExStableReleases(),
				getBepInExBleedingReleases(),
			])
		)
			.flat()
			.sort((a, b) => b.timestamp - a.timestamp),
	};
}
