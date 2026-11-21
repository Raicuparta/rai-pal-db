import type { ModBase, ModRun } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

export function uevrBase(
	id: string,
	zipRoot = ".",
): Omit<ModBase, "title" | "description" | "download"> {
	const runBase: ModRun = {
		path: `${token.SharedModsPath}/${id}/UEVRInjector.exe`,
		wineEnvironment: {
			DOTNET_ROOT: `${token.SharedModsPath}/dotnet-desktop-runtime-win-x64`,
		},
		os: "Windows",
	};

	return {
		id,
		tags: ["uevr"],
		author: "praydog",
		engine: "Unreal",
		gameOs: "Windows",
		website: "https://github.com/praydog/UEVR",
		optionalDependencies: [
			{
				modId: "dotnet-desktop-runtime-win-x64",
			},
			{
				tag: "uevr-config",
			},
		],
		runForGame: {
			...runBase,
			args: [`--attach=${token.GameExecutableName}`],
		},
		runStandalone: runBase,
		install: {
			manifestPath: `${token.SharedModsPath}/${id}/rai-pal-manifest.json`,
			extract: [
				{
					source: zipRoot,
					destination: `${token.SharedModsPath}/${id}`,
				},
			],
		},
		paths: [
			{
				id: "mod",
				title: "Mod",
				type: "Folder",
				path: `${token.SharedModsPath}/${id}`,
			},
			{
				id: "config",
				title: "Config",
				type: "Folder",
				path: `${token.RoamingAppData}/UnrealVRMod/${token.GameExecutableNameWithoutExtension}`,
			},
		],
	};
}
