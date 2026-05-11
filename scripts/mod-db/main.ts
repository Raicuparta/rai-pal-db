import { DbSchema } from "#types/db-schema.ts";
import { MOD_DATABASE_VERSION } from "#common/versions.ts";
import { getBepInExDatabase } from "./bepinex/bepinex.ts";
import { getUe4ssDatabase } from "./ue4ss/ue4ss.ts";

const mods = (
	await Promise.all([getBepInExDatabase(), getUe4ssDatabase()])
).flat();

const filePath = `../mod-db/${MOD_DATABASE_VERSION}/mods.json`;

const existingDatabase: DbSchema = JSON.parse(Deno.readTextFileSync(filePath));

const newDb: DbSchema = {
	$schema: existingDatabase.$schema,
	mods: existingDatabase.mods
		.filter(
			(existingMod) =>
				!mods.map((newMod) => newMod.id).includes(existingMod.id),
		)
		.concat(mods)
		.sort((a, b) => a.id.localeCompare(b.id)),
};

console.log(`Writing updated mod database to ${filePath}...`);

Deno.writeTextFile(filePath, JSON.stringify(newDb, null, 2));

Deno.exit(0);
