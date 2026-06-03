import { ModBase } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

// These are exposed as mods instead of configs since they're not game-specific,
// just convenient this way since we can already filter by version.
export function getGepInExConfigs(): ModBase[] {
	return [
		bepInExConfig(
			{
				id: "bepinex-config-modern",
				title: "BepInEx Config (Modern)",
				engineVersionRange: {
					minimum: {
						major: 5,
						minor: 5,
					},
				},
			},
			`[Logging.Console]
Enabled = true`,
		),
		bepInExConfig(
			{
				id: "bepinex-config-legacy",
				title: "BepInEx Config (Legacy)",
				engineVersionRange: {
					maximum: {
						major: 5,
						minor: 4,
					},
				},
			},
			`[Logging.Console]
Enabled = true
[Preloader.Entrypoint]
Assembly = UnityEngine.dll
Type = MonoBehaviour
Method = .cctor`,
		),
	];
}

function bepInExConfig(
	mod: Pick<ModBase, "id" | "title" | "engineVersionRange">,
	config: string,
): ModBase {
	return {
		...mod,
		author: "BepInEx",
		hideFromGameModsList: true,
		description: "Default BepInEx config",
		sourceCode: "https://github.com/BepInEx/BepInEx",
		engine: "Unity",
		install: {
			manifestPath: `${token.GameInstalledModsPath}/manifests/${mod.id}.json`,
			write: [
				{
					content: config,
					destination:
						`${token.GameInstalledModsPath}/bepinex/BepInEx/config/BepInEx.cfg`,
				},
			],
		},
	};
}
