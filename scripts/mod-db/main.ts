import { DbSchema, ModSchema } from "#types/db-schema.ts";
import { MOD_DATABASE_VERSION } from "#common/versions.ts";
import { getBepInExDatabase } from "./bepinex/bepinex.ts";
import { getUe4ssDatabase } from "./ue4ss/ue4ss.ts";

async function updateLoader(
	loaderId: string,
	loaderGetter: () => Promise<ModSchema[]>,
) {
	console.log(`Updating mod database for ${loaderId}...`);
	const mods = await loaderGetter();
	const filePath = `../mod-db/${MOD_DATABASE_VERSION}/${loaderId}.json`;

	const existingDatabase: DbSchema = JSON.parse(
		Deno.readTextFileSync(filePath),
	);

	const newDb: DbSchema = {
		$schema: existingDatabase.$schema,
		mods: existingDatabase.mods
			.filter(
				(existingMod) =>
					!mods.map((newMod) => newMod.id).includes(existingMod.id),
			)
			.concat(mods),
	};

	console.log(`Writing updated mod database to ${filePath}...`);

	Deno.writeTextFile(filePath, JSON.stringify(newDb, null, 2));
}

try {
	await updateLoader("bepinex", getBepInExDatabase);
	await updateLoader("ue4ss", getUe4ssDatabase);
} catch (error) {
	console.error("Error updating mod database:", error);
	Deno.exit(1);
}

Deno.exit(0);
