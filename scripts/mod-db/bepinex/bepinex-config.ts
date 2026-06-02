import { ModBase } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

const idModern = "bepinex-config-modern";
const idLegacy = "bepinex-config-legacy";

// These are exposed as mods instead of configs since they're not game-specific,
// just convenient this way since we can already filter by version.
export function getGepInExConfigs(): ModBase[] {
	return [
		{
			id: idModern,
			title: "BepInEx Config (Modern)",
			author: "BepInEx",
			description: "Default BepInEx config",
			sourceCode: "https://github.com/BepInEx/BepInEx",
			engine: "Unity",
			engineVersionRange: {
				minimum: {
					major: 5,
					minor: 5,
				},
			},
			install: {
				manifestPath:
					`${token.GameInstalledModsPath}/manifests/${idModern}.json`,
				write: [
					{
						content: `[Logging.Console]
Enabled = true`,
						destination:
							`${token.GameInstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
					},
				],
			},
		},
		{
			id: idLegacy,
			title: "BepInEx Config (Legacy)",
			author: "BepInEx",
			description: "Default BepInEx config",
			sourceCode: "https://github.com/BepInEx/BepInEx",
			engine: "Unity",
			engineVersionRange: {
				maximum: {
					major: 5,
					minor: 4,
				},
			},
			install: {
				manifestPath:
					`${token.GameInstalledModsPath}/manifests/${idLegacy}.json`,
				write: [
					{
						content: `[Logging.Console]
Enabled = true
[Preloader.Entrypoint]
Assembly = UnityEngine.dll
Type = MonoBehaviour
Method = .cctor`,
						destination:
							`${token.GameInstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
					},
				],
			},
		},
	];
}
