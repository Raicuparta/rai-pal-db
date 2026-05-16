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
} satisfies Mod;
