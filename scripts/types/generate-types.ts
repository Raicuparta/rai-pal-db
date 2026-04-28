import { compileFromFile } from "json-schema-to-typescript";
import { MOD_DATABASE_VERSION } from "../common/versions.ts";

async function generateDbSchemaTypes() {
	const schemaFolder = `../mod-db/${MOD_DATABASE_VERSION}/schema`;

	const schemaTs = await compileFromFile(`${schemaFolder}/db-schema.json`, {
		cwd: schemaFolder,
	});

	const folder = "./types/generated";
	await Deno.mkdir(folder, { recursive: true });
	await Deno.writeTextFile(`${folder}/db-schema.ts`, schemaTs);
}

await generateDbSchemaTypes();
