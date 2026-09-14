import { ModBase } from "../../mod.ts";
import { token } from "../../replacement-tokens.ts";

// Each zip contains a single `everyone-<major>.gd` script.
const downloadBase =
	"https://github.com/Raicuparta/rai-pal-db/releases/download/everyone-v0.2.1";

function godotEveryone(major: 3 | 4): ModBase {
	const id = `everyone-godot-${major}`;
	return {
		id,
		family: "everyone",
		engine: "Godot",
		engineVersionRange: {
			minimum: { major },
			...(major === 3 ? { maximum: { major } } : {}),
		},
		title: `Everyone (Godot ${major})`,
		author: "Raicuparta",
		sourceCode: "https://github.com/Raicuparta/everyone",
		description:
			"Adds multiplayerish features. Requires being logged in to Rai Pal. F3 to chat.",
		download: {
			id: "0.2.1",
			url: `${downloadBase}/everyone-${major}.zip`,
		},
		requiredDependencies: [{ family: "godot" }],
		install: {
			manifestPath: `${token.GameInstalledModsPath}/manifests/${id}.json`,
			extract: [
				{
					source: ".",
					destination: `${token.GameInstalledModsPath}/mods/everyone`,
				},
			],
			mainInstalledFolderPath: `${token.GameInstalledModsPath}/mods/everyone`,
		},
	};
}

// deno-lint-ignore require-await
export async function getGodotEveryoneMods() {
	return [godotEveryone(3), godotEveryone(4)];
}
