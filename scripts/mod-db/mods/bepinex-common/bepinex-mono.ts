import { token } from "../../replacement-tokens.ts";
import { Mod } from "../mod.ts";

/**
 * Base mod object for BepInEx itself, mono version.
 */
export function bepinexMonoLoaderBase(
	modId: string,
): Omit<Mod, "title" | "description" | "latestVersion"> {
	return {
		id: modId,
		engine: "Unity",
		unityBackend: "Il2Cpp",
		author: "BepInEx",
		sourceCode: "https://github.com/BepInEx/BepInEx",
		install: {
			extract: [
				{
					source: "BepInEx",
					destination: `${token.InstalledModsPath}/bepinex/BepInEx`,
				},
				{
					source: "winhttp.dll",
					destination: `${token.GameExecutableFolderPath}/winhttp.dll`,
				},
			],
			write: [
				{
					content: `[General]
enabled=true
target_assembly=${token.InstalledModsPath}/bepinex/BepInEx/core/BepInEx.Preloader.dll
redirect_output_log=false
ignore_disable_switch=true

[UnityMono]
dll_search_path_override=
`,
					destination: `${token.GameExecutableFolderPath}/doorstop_config.ini`,
				},
				{
					content: `[Logging.Console]
Enabled = true`,
					destination: `${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
				},
			],
			wineDllOverrides: ["winhttp"],
			mainInstalledFolderPath: `${token.InstalledModsPath}/bepinex/BepInEx`,
		},
		config: {
			// TODO: legacy (unity < 5) version cfg
			destinationPath: `${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
			destinationType: "File",
		},
	};
}
