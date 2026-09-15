import { ModBase, ModRun } from "./mod.ts";
import { token } from "./replacement-tokens.ts";

const id = "everyone-voice-client";

// The client binaries are published to the rai-pal-db repo releases, like the
// other mods in this database.
const downloadBase =
	"https://github.com/Raicuparta/rai-pal-db/releases/download/everyone-voice-client-v0.1.0";

// The client is a native app that runs alongside the game and talks to Rai Pal's
// local user socket, so Rai Pal owns the process and can start/stop it from the UI.
const run: ModRun = {
	path: `${token.SharedModsPath}/${id}/everyone-client-voice`,
	managed: true,
};

// This mod is not tied to any game engine: as long as the Everyone mod is
// compatible with a game, the voice client can be used with it.
// deno-lint-ignore require-await
export async function getEveryoneVoiceClientMods() {
	return [
		{
			id,
			title: "Everyone Voice Client",
			author: "Raicuparta",
			sourceCode: "https://github.com/Raicuparta/everyone",
			description:
				"Proximity voice chat for the Everyone mod. Requires being logged in to Rai Pal.",
			download: {
				id: "0.1.0",
				url: `${downloadBase}/everyone-client-voice.zip`,
			},
			requiredDependencies: [{ family: "everyone" }],
			install: {
				manifestPath: `${token.SharedModsPath}/${id}/rai-pal-manifest.json`,
				extract: [
					{
						source: ".",
						destination: `${token.SharedModsPath}/${id}`,
					},
				],
				mainInstalledFolderPath: `${token.SharedModsPath}/${id}`,
			},
			runForGame: run,
			runStandalone: run,
		} satisfies ModBase,
	];
}
