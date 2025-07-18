import { ModSchema } from "#types/db-schema.ts";

export type UnityBackend = NonNullable<ModSchema["unityBackend"]>;

export type BepInExBuilds = {
	[version: string]: BepInExBuild[];
};

export type BepInExBuild = {
	backend: UnityBackend;
	os: string;
	arch: string;
	downloadUrl: string;
};
