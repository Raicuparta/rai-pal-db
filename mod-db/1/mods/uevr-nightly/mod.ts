import { Mod } from "../../mod.ts";

export default {
	id: "uevr-nightly",
	engine: "Unreal",
	title: "UEVR Nightly",
	author: "praydog",
	github: {
		assetName: "uevr.zip",
		repo: "UEVR-nightly",
		user: "praydog",
		runnable: {
			path: "UEVRInjector.exe",
			args: ["--attach={{ExecutableName}}"],
			wineEnvironment: {
				DOTNET_ROOT: "{{LocalModsPath}}/dotnet-desktop-runtime-win-x64",
			},
		},
	},
	sourceCode: "https://github.com/praydog/UEVR",
	description:
		"⚠️ Unstable ⚠️ UEVR automatically built from the latest, potentially untested code changes.",
	configs: {
		destinationPath:
			"{{RoamingAppData}}/UnrealVRMod/{{ExecutableNameWithoutExtension}}",
		destinationType: "Folder",
		modIdOverride: "uevr",
	},
	dependencies: [
		{
			modId: "dotnet-desktop-runtime-win-x64",
			operatingSystems: ["Linux"],
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
	},
} satisfies Mod;
