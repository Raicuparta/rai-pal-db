import { ModBase } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

// The loader zips (each containing only `script-loader.gd`) are published to
// the rai-pal-db repo releases, like the other mods in this database.
const downloadBase =
	"https://github.com/Raicuparta/rai-pal-db/releases/download/godot-v0.1.0";

const sourceCode = "https://github.com/Raicuparta/everyone";

function godotLoader(major: 3 | 4): ModBase {
	const id = `godot-${major}`;
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
					destination: `${token.GameInstalledModsPath}/script-loader.gd`,
				},
			],
			write: [
				{
					content: `[autoload]
ModLoaderStore="${token.MaybeWineRoot}${token.GameInstalledModsPath}/script-loader.gd"
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
