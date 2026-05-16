import { MOD_DATABASE_VERSION } from "#common/versions.ts";
import { getMods } from "./mods/mods.ts";

await Deno.writeTextFile(
	`../mod-db/${MOD_DATABASE_VERSION}/mods.json`,
	JSON.stringify(
		{
			mods: await getMods(),
		},
		null,
		2,
	),
);
