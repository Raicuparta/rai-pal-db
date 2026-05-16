import { Mod, UnityBackend } from "../mod.ts";
import { token } from "../../replacement-tokens.ts";

/**
 * Base mod object for BepInEx mods.
 */
export function bepinexModBase(
	modId: string,
	unityBackend: UnityBackend,
	configFileName?: string,
): Omit<Mod, "title" | "author" | "sourceCode" | "description"> {
	return {
		id: modId,
		engine: "Unity",
		unityBackend,
		install: {
			extract: [
				{
					source: "plugins",
					destination: `${token.InstalledModsPath}/bepinex/BepInEx/plugins/${modId}`,
				},
			],
			mainInstalledFolderPath: `${token.InstalledModsPath}/bepinex/BepInEx/plugins/${modId}`,
		},
		config: configFileName
			? {
					destinationPath: `${token.InstalledModsPath}/bepinex/BepInEx/config/${configFileName}`,
					destinationType: "File",
				}
			: undefined,
		dependencies:
			unityBackend === "Mono"
				? [
						{
							modId: "bepinex-mono-x64",
						},
						{
							modId: "bepinex-mono-x86",
						},
					]
				: [
						{
							modId: "bepinex-il2cpp-x64",
						},
						{
							modId: "bepinex-il2cpp-x86",
						},
					],
	};
}
