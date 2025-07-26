import { LOADER_DATABASE_VERSION } from "#common/versions.ts";
import { getBepInExReleases } from "#loader-db/bepinex/bepinex.ts";

await Deno.writeTextFile(
	`../loader-db/${LOADER_DATABASE_VERSION}/bepinex.json`,
	JSON.stringify(await getBepInExReleases(), null, 2)
);
