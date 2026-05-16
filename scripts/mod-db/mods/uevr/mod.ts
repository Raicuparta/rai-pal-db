import { Mod } from "../mod.ts";

export default {
	id: "uevr",
	redownloadId: 1,
	engine: "Unreal",
	title: "UEVR",
	author: "praydog",
	// github: {
	// 	assetName: "UEVR.zip",
	// 	repo: "UEVR",
	// 	user: "praydog",
	// },
	sourceCode: "https://github.com/praydog/UEVR",
	description: "Universal VR mod for Unreal Engine games.",
	dependencies: [
		{
			modId: "dotnet-desktop-runtime-win-x64",
		},
	],
	actions: {
		runForGame: {
			path: "UEVRInjector.exe",
			args: ["--attach={{GameExecutableName}}"],
			wineEnvironment: {
				DOTNET_ROOT: "{{LocalModsPath}}/dotnet-desktop-runtime-win-x64",
			},
		},
		getConfig: {
			destinationPath:
				"{{RoamingAppData}}/UnrealVRMod/{{ExecutableNameWithoutExtension}}",
			destinationType: "Folder",
		},
	},
} satisfies Mod;
