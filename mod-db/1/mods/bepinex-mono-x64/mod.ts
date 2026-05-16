import { Mod } from "../../mod.ts";
import { token } from "../../replacement-tokens.ts";

export default {
	id: "bepinex-mono-x64",
	engine: "Unity",
	architecture: "X64",
	unityBackend: "Mono",
	title: "BepInEx Mono X64",
	author: "BepInEx",
	sourceCode: "https://github.com/BepInEx/BepInEx",
	description: "BepInEx stable Mono build for X64 games.",
	latestVersion: {
		id: "5.4.23.5",
		url: "https://github.com/BepInEx/BepInEx/releases/download/v5.4.23.5/BepInEx_win_x64_5.4.23.5.zip",
	},
	actions: {
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
					source: "doorstop_config.ini",
					destination: `${token.GameExecutableFolderPath}/doorstop_config.ini`,
				},
				{
					source: "BepInEx.cfg",
					destination: `${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
				},
			],
			wineDllOverrides: ["winhttp"],
		},
		getModFolderForGame: {
			path: `${token.InstalledModsPath}/bepinex/BepInEx`,
		},
		getConfig: {
			destinationPath: `${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
			destinationType: "File",
		},
	},
} satisfies Mod;
