import { LOADER_DATABASE_VERSION } from "#common/versions.ts";
import { getBepInExBleedingBuilds } from "./bepinex/bepinex-bleeding.ts";
import { getBepInExStableBuilds } from "./bepinex/bepinex-stable.ts";

const result = Object.entries({
	...(await getBepInExStableBuilds()),
	...(await getBepInExBleedingBuilds()),
})
	.sort((a, b) => b[0].localeCompare(a[0]))
	.map(([version, builds]) => ({
		version,
		builds,
	}));

await Deno.writeTextFile(
	`../loader-db/${LOADER_DATABASE_VERSION}/bepinex.json`,
	JSON.stringify(result, null, 2)
);
