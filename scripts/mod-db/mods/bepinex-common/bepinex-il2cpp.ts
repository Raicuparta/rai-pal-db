import { Mod, ModActions } from "../../mod.ts";
import { token } from "../../replacement-tokens.ts";

/**
 * Actions for BepInEx itself, il2cpp version.
 */
export const bepinexIl2cppActions: ModActions = {
	install: {
		extract: [
			{
				source: "BepInEx",
				destination: `${token.InstalledModsPath}/bepinex/BepInEx`,
			},
			{
				source: "dotnet",
				destination: `${token.InstalledModsPath}/bepinex/dotnet`,
			},
			{
				source: "winhttp.dll",
				destination: `${token.GameExecutableFolderPath}/winhttp.dll`,
			},
		],
		write: [
			{
				content: `[General]
enabled = true
target_assembly = ${token.InstalledModsPath}/bepinex/BepInEx/core/BepInEx.Unity.IL2CPP.dll
redirect_output_log = false
boot_config_override =
ignore_disable_switch = true

[Il2Cpp]
coreclr_path = ${token.InstalledModsPath}/bepinex/dotnet/coreclr.dll
corlib_dir = ${token.InstalledModsPath}/bepinex/dotnet
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
		destinationPath: `${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
		destinationType: "File",
	},
};

/**
 * Base mod object for BepInEx mods, il2cpp version.
 */
export function bepinexIl2cppModBase(
	modId: string,
	configFileName?: string,
): Omit<Mod, "title" | "author" | "sourceCode" | "description"> {
	return {
		id: modId,
		engine: "Unity",
		unityBackend: "Il2Cpp",
		actions: {
			install: {
				extract: [
					{
						source: "plugins",
						destination: `${token.InstalledModsPath}/bepinex/BepInEx/plugins/${modId}`,
					},
				],
			},
			getModFolderForGame: {
				path: `${token.InstalledModsPath}/bepinex/BepInEx/plugins/${modId}`,
			},
			getConfig: configFileName
				? {
						destinationPath: `${token.InstalledModsPath}/bepinex/BepInEx/config/${configFileName}`,
						destinationType: "File",
					}
				: undefined,
		},
		dependencies: [
			{
				modId: "bepinex-mono-x64",
			},
			{
				modId: "bepinex-mono-x86",
			},
		],
	};
}
