import { Mod } from "../mod.ts";

export default {
	id: "uevr-nightly",
	engine: "Unreal",
	title: "UEVR Nightly",
	author: "praydog",
	// github: {
	// 	assetName: "uevr.zip",
	// 	repo: "UEVR-nightly",
	// 	user: "praydog",
	// },
	sourceCode: "https://github.com/praydog/UEVR",
	description:
		"⚠️ Unstable ⚠️ UEVR automatically built from the latest, potentially untested code changes.",
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
			modIdOverride: "uevr",
		},
	},
} satisfies Mod;
