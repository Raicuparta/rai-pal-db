import { ModSchema } from "#types/db-schema.ts";
import { getBepInExBleedingReleases } from "#loader-db/bepinex/bepinex-bleeding.ts";
import { getBepInExStableReleases } from "#loader-db/bepinex/bepinex-stable.ts";

export type UnityBackend = NonNullable<ModSchema["unityBackend"]>;

export type BepInExRelease = {
	version: string;
	timestamp: number;
	builds: BepInExBuild[];
};

export type BepInExBuild = {
	backend: UnityBackend;
	os: string;
	arch: string;
	downloadUrl: string;
};

export async function getBepInExReleases(): Promise<BepInExRelease[]> {
	return (
		await Promise.all([
			getBepInExStableReleases(),
			getBepInExBleedingReleases(),
		])
	)
		.flat()
		.sort((a, b) => b.timestamp - a.timestamp);
}
