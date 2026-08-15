import { ModBase, UnityBackend } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

/**
 * Base mod object for BepInEx mods.
 */
export function bepinexMod(
	mod:
		& Omit<
			ModBase,
			| "engine"
			| "install"
			| "config"
			| "requiredDependencies"
			| "optionalDependencies"
		>
		& {
			unityBackend: UnityBackend;
		},
	params?: {
		configFileName?: string;
		zipRoot?: string;
		withPatchers?: boolean;
	},
): ModBase {
	return {
		...mod,
		engine: "Unity",
		install: {
			manifestPath: `${token.GameInstalledModsPath}/manifests/${mod.id}.json`,
			extract: [
				{
					source: `${params?.zipRoot ? `${params.zipRoot}/` : ""}plugins`,
					destination:
						`${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/${mod.id}`,
				},
				...params?.withPatchers
					? [{
						source: `${params?.zipRoot ? `${params.zipRoot}/` : ""}patchers`,
						destination:
							`${token.GameInstalledModsPath}/bepinex/BepInEx/patchers/${mod.id}`,
					}]
					: [],
			],
			mainInstalledFolderPath:
				`${token.GameInstalledModsPath}/bepinex/BepInEx/plugins/${mod.id}`,
		},
		config: params?.configFileName
			? {
				destinationPath:
					`${token.GameInstalledModsPath}/bepinex/BepInEx/config/${params.configFileName}`,
				destinationType: "File",
			}
			: undefined,
		requiredDependencies: [
			{
				family: "bepinex",
			},
		],
	};
}
