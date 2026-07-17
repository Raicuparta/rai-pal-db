import { ModBase, ModRun } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

export function uevrBase(
	id: string,
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
		family: "uevr",
		author: "praydog",
		engine: "Unreal",
		gameOs: "Windows",
		sourceCode: "https://github.com/praydog/UEVR",
		dependencies: [
			{
				modId: "dotnet-desktop-runtime-win-x64",
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
					source: ".",
					destination: `${token.SharedModsPath}/${id}`,
				},
			],
			mainInstalledFolderPath: `${token.SharedModsPath}/${id}`,
		},
		config: {
			destinationPath:
				`${token.RoamingAppData}/UnrealVRMod/${token.GameExecutableNameWithoutExtension}`,
			destinationType: "Folder",
		},
	};
}
