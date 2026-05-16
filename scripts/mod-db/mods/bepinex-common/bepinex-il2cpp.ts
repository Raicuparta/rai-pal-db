import { Mod } from "../mod.ts";
import { token } from "../../replacement-tokens.ts";

/**
 * Base mod object for BepInEx itself, il2cpp version.
 */
export function bepinexIl2cppLoaderBase(
	modId: string,
): Omit<Mod, "title" | "description"> {
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
		installedModPath: `${token.InstalledModsPath}/bepinex/BepInEx`,
		config: {
			destinationPath: `${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
			destinationType: "File",
		},
	};
}
