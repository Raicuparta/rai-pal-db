import { ModBase } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

// These are exposed as mods instead of configs since they're not game-specific,
// just convenient this way since we can already filter by version.
export function getGepInExConfigs(): ModBase[] {
	return [
		{
			id: "bepinex-config-modern",
			title: "BepInEx Config (Modern)",
			author: "BepInEx",
			description: "Default BepInEx config",
			sourceCode: "https://github.com/BepInEx/BepInEx",
			engineVersionRange: {
				minimum: {
					major: 5,
					minor: 5,
				},
			},
			install: {
				write: [
					{
						content: `[Logging.Console]
Enabled = true`,
						destination:
							`${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
					},
				],
			},
		},
		{
			id: "bepinex-config-legacy",
			title: "BepInEx Config (Legacy)",
			author: "BepInEx",
			description: "Default BepInEx config",
			sourceCode: "https://github.com/BepInEx/BepInEx",
			engineVersionRange: {
				maximum: {
					major: 5,
					minor: 4,
				},
			},
			install: {
				write: [
					{
						content: `[Logging.Console]
Enabled = true
[Preloader.Entrypoint]
Assembly = UnityEngine.dll
Type = MonoBehaviour
Method = .cctor`,
						destination:
							`${token.InstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
					},
				],
			},
		},
	];
}
