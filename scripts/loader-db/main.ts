import { LOADER_DATABASE_VERSION } from "#common/versions.ts";
import { getBepInExDatabase } from "#loader-db/bepinex/bepinex.ts";
import { ModSchema } from "#types/db-schema.ts";
import { getUe4ssDatabase } from "#loader-db/ue4ss/ue4ss.ts";

export type UnityBackend = NonNullable<ModSchema["unityBackend"]>;

export type LoaderDatabase = {
	id: string;
	releases: LoaderRelease[];
};

export type LoaderRelease = {
	version: string;
	timestamp: number;
	builds: LoaderBuild[];
};

export type LoaderBuild = {
	downloadUrl: string;
	os: string;
	unityBackend?: UnityBackend;
	arch?: string;
};

async function updateDatabase(getter: () => Promise<LoaderDatabase>) {
	const database = await getter();

	await Deno.writeTextFile(
		`../loader-db/${LOADER_DATABASE_VERSION}/${database.id}.json`,
		JSON.stringify(database, null, 2),
	);
}

await updateDatabase(getBepInExDatabase);
await updateDatabase(getUe4ssDatabase);
