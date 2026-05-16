import { ModActions } from "../../mod.ts";
import { token } from "../../replacement-tokens.ts";

/**
 * Actions for BepInEx itself, mono version.
 */
export const bepinexMonoActions: ModActions = {
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
	},
	getModFolderForGame: {
		path: `${token.InstalledModsPath}/bepinex/BepInEx`,
	},
	getConfig: {
		// TODO: legacy (unity < 5) version cfg
		destinationPath: `${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
		destinationType: "File",
	},
};
