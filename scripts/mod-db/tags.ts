interface Tag {
	title: string;
	description: string;
	filterable?: boolean;
}

export const tags = {
	uuvr: {
		title: "UUVR",
		description: "Universal VR mod for Unity games",
		filterable: true,
	},
	uevr: {
		title: "UEVR",
		description: "Universal VR mod for Unreal Engine games",
		filterable: true,
	},
	everyone: {
		title: "Everyone",
		description: "Adds multiplayerish features.",
		filterable: true,
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
	"runtime-unity-editor": {
		title: "Runtime Unity Editor",
		description: "In-game inspector and debugging tools.",
	},
	"bepinex-config": {
		title: "BepInEx Config",
		description: "Default BepInEx config.",
	},
	"everyone-config": {
		title: "Everyone Config",
		description: "Recommended Everyone config for a specific game.",
	},
	"uuvr-config": {
		title: "UUVR Config",
		description: "Recommended UUVR config for a specific game.",
	},
	"uevr-config": {
		title: "UEVR Config",
		description: "Recommended UEVR config for a specific game.",
	},
	"unity-config-manager": {
		title: "Unity Config Manager",
		description: "In-game UI for changing BepInEx mod settings.",
	},
	"game-specific-vr": {
		title: "Game-Specific VR",
		description: "Mods made for specific games",
		filterable: true,
	},
} as const satisfies Record<string, Tag>;

export type TagId = keyof typeof tags;
