import type { ModBase, ModRun } from "../mod.ts";
import { token } from "../replacement-tokens.ts";
import { sharedModFolder } from "../paths.ts";

export function uevrConfigPath(): string {
	return `${token.RoamingAppData}/UnrealVRMod/${token.GameExecutableNameWithoutExtension}`;
}

export function uevrBase(
	id: string,
	zipRoot = ".",
): Omit<ModBase, "title" | "description" | "download"> {
	const folder = sharedModFolder(id);
	const runBase: ModRun = {
		path: `${folder}/UEVRInjector.exe`,
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
			installKind: "Shared",
			extract: [{ source: zipRoot, destination: folder }],
		},
		paths: [
			{
				type: "Folder",
				path: folder,
			},
			{
				type: "Folder",
				path: uevrConfigPath(),
			},
		],
	};
}
