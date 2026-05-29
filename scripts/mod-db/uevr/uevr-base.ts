import { ModBase } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

export function uevrBase(
	id: string,
): Omit<ModBase, "title" | "description" | "download"> {
	return {
		id,
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
			path: `${token.LocalModsPath}/UEVRInjector.exe`,
			args: [`--attach=${token.GameExecutableName}`],
			wineEnvironment: {
				DOTNET_ROOT: `${token.LocalModsPath}/dotnet-desktop-runtime-win-x64`,
			},
			os: "Windows",
		},
		install: {
			extract: [
				{
					source: ".",
					destination: `${token.LocalModsPath}/${id}`,
				},
			],
		},
		config: {
			destinationPath:
				`${token.RoamingAppData}/UnrealVRMod/${token.GameExecutableNameWithoutExtension}`,
			destinationType: "Folder",
		},
	};
}
