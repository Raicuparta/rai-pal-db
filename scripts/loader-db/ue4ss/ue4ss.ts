import { LoaderDatabase } from "#loader-db/main.ts";

// TODO: Single release hardcoded for now until we decide better way to get latest experimental.
export async function getUe4ssDatabase(): Promise<LoaderDatabase> {
	return {
		id: "ue4ss",
		releases: [
			{
				timestamp: Date.now(),
				version: "v3.0.1-946-g265115c0",
				builds: [
					{
						downloadUrl:
							"https://github.com/UE4SS-RE/RE-UE4SS/releases/download/experimental-latest/UE4SS_v3.0.1-946-g265115c0.zip",
						os: "win",
					},
				],
			},
		],
	};
}
