interface Family {
	title: string;
	description: string;
}

export const families = {
	uuvr: {
		title: "UUVR",
		description: "Universal VR mod for Unity games",
	},
	uevr: {
		title: "UEVR",
		description: "Universal VR mod for Unreal Engine games",
	},
	everyone: {
		title: "Everyone",
		description: "Adds multiplayerish features.",
	},
	bepinex: {
		title: "BepInEx",
		description: "Mod loader for Unity mods.",
	},
	ue4ss: {
		title: "UE4SS",
		description: "Scripting and modding framework for Unreal Engine games.",
	},
	"godot-loader": {
		title: "Godot Mod Loader",
		description: "Basic mod loader for Godot games.",
	},
	"unity-explorer": {
		title: "Unity Explorer",
		description:
			"An in-game UI for exploring, debugging and modifying Unity games.",
	},
	"ogs": {
		title: "OGS Telemetry",
		description:
			"Motion telemetry (OGS Telemetry Standard) for motion rigs, haptics and dashboards.",
	},
} as const satisfies Record<string, Family>;

export type FamilyId = keyof (typeof families);
