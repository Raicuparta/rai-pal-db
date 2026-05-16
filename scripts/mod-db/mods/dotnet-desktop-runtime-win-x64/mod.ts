import { Mod } from "../mod.ts";

export default {
	id: "dotnet-desktop-runtime-win-x64",
	title: ".NET Desktop Runtime",
	author: "bill gates himself",
	description: "Required for running UEVR via Wine",
	sourceCode: "https://dotnet.microsoft.com/en-us/download/dotnet/6.0",
	latestVersion: {
		id: "6.0.36",
		url: "https://github.com/Raicuparta/rai-pal-db/releases/download/dotnet-6/dotnet+desktop-runtime-6.0.36-win-x64.zip",
	},
	gameOs: "Windows",
	hostOs: "Linux",
	install: {
		// Install defined but empty so it's installable as a dependency,
		// but no need to do anything specific to each game (just needs to be downloaded locally).
	},
} satisfies Mod;
