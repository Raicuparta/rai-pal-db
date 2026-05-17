import { token } from "../../replacement-tokens.ts";
import { Mod } from "../mod.ts";

export function uevrBaseMod(
	id: string,
): Omit<Mod, "title" | "description" | "latestVersion"> {
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
			path: "UEVRInjector.exe",
			args: [`--attach=${token.GameExecutableName}`],
			wineEnvironment: {
				DOTNET_ROOT: `${token.LocalModsPath}/dotnet-desktop-runtime-win-x64`,
			},
		},
		config: {
			destinationPath: `${token.RoamingAppData}/UnrealVRMod/${token.GameExecutableNameWithoutExtension}`,
			destinationType: "Folder",
		},
	};
}
