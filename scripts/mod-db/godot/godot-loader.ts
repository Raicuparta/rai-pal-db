import { ModBase } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

const sourceCode = "https://github.com/Raicuparta/gdscript-loader";

// Each zip contains a single `script-loader.gd`, built and published by the
// gdscript-loader release workflow.
const downloadBase =
	"https://github.com/Raicuparta/gdscript-loader/releases/download/v0.1.0";

function godotLoader(major: 3 | 4): ModBase {
	const id = `godot-loader-${major}`;
	const scriptLoaderGdPath =
		`${token.GameInstalledModsPath}/${id}/script-loader.gd`;

	return {
		id,
		family: "godot",
		engine: "Godot",
		engineVersionRange: {
			minimum: { major },
			...(major === 3 ? { maximum: { major } } : {}),
		},
		title: `Godot ${major} Mod Loader`,
		author: "Raicuparta",
		sourceCode,
		description: `Mod loader for Godot ${major} games.`,
		download: {
			id: "0.1.0",
			url: `${downloadBase}/godot-${major}.zip`,
		},
		install: {
			manifestPath: `${token.GameInstalledModsPath}/manifests/${id}.json`,
			extract: [
				{
					source: "script-loader.gd",
					destination: scriptLoaderGdPath,
				},
			],
			write: [
				{
					content: `[autoload]
ModLoaderStore="${token.MaybeWineRoot}${scriptLoaderGdPath}"
`,
					destination: `${token.GameExecutableFolderPath}/override.cfg`,
				},
			],
			mainInstalledFolderPath: token.GameInstalledModsPath,
		},
	};
}

// deno-lint-ignore require-await
export async function getGodotLoaderMods() {
	return [godotLoader(3), godotLoader(4)];
}
