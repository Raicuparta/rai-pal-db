import { ModBase, UnityBackend } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

/**
 * Base mod object for BepInEx mods.
 */
export function bepinexMod(
	mod: Omit<ModBase, "engine" | "install" | "config" | "dependencies"> & {
		unityBackend: UnityBackend;
	},
	params?: {
		configFileName?: string;
		zipRoot?: string;
	},
): ModBase {
	return {
		...mod,
		engine: "Unity",
		install: {
			extract: [
				{
					source: `${params?.zipRoot ? `${params.zipRoot}/` : ""}plugins`,
					destination:
						`${token.InstalledModsPath}/bepinex/BepInEx/plugins/${mod.id}`,
				},
			],
			mainInstalledFolderPath:
				`${token.InstalledModsPath}/bepinex/BepInEx/plugins/${mod.id}`,
		},
		config: params?.configFileName
			? {
				destinationPath:
					`${token.InstalledModsPath}/bepinex/BepInEx/config/${params.configFileName}`,
				destinationType: "File",
			}
			: undefined,
		dependencies: mod.unityBackend === "Mono"
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
