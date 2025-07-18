import { compileFromFile } from "json-schema-to-typescript";
import { DATABASE_VERSION } from "#common/version.ts";

async function generateDbSchemaTypes() {
	const schemaFolder = `../mod-db/${DATABASE_VERSION}/schema`;

	const schemaTs = await compileFromFile(`${schemaFolder}/db-schema.json`, {
		cwd: schemaFolder,
	});

	await Deno.writeTextFile("./types/generated/db-schema.ts", schemaTs);
}

await generateDbSchemaTypes();
