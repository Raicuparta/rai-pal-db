// import { getBepInExBleedingReleases } from "./bepinex-bleeding.ts";
// import { getBepInExStableReleases } from "./bepinex-stable.ts";
// import { ModSchema } from "#types/db-schema.ts";

// function pickMod(
// 	mods: ModSchema[],
// 	architecture: "X86" | "X64",
// 	unityBackend: "Mono" | "Il2Cpp",
// ): ModSchema {
// 	const mod = mods.find(
// 		(candidate) =>
// 			candidate.architecture === architecture &&
// 			candidate.unityBackend === unityBackend,
// 	);

// 	if (!mod) {
// 		throw new Error(
// 			`Missing BepInEx mod for architecture=${architecture} backend=${unityBackend}`,
// 		);
// 	}

// 	return mod;
// }

// export async function getBepInExDatabase(): Promise<ModSchema[]> {
// 	const [stableMods, bleedingMods] = await Promise.all([
// 		getBepInExStableReleases(),
// 		getBepInExBleedingReleases(),
// 	]);

// 	return [
// 		pickMod(stableMods, "X86", "Mono"),
// 		pickMod(stableMods, "X64", "Mono"),
// 		pickMod(bleedingMods, "X86", "Il2Cpp"),
// 		pickMod(bleedingMods, "X64", "Il2Cpp"),
// 	];
// }
