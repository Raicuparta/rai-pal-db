import { uevrConfigPath } from "../helpers/uevr.ts";
import { configDownload } from "../helpers/config-database.ts";
import { defineMod } from "../mod.ts";

const id = "config-uevr-abzu";
const destination = uevrConfigPath();

export default defineMod({
	id,
	tags: ["uevr-config"],
	gameIds: {
		Gog: ["1622602219"],
		NormalizedExecutable: ["abzugamewin64shipping"],
		Steam: ["384190", "577450"],
	},
	title: "UEVR Config for Abzû",
	author: "praydog",
	website: "https://github.com/praydog/UEVR",
	description: "Recommended UEVR config for Abzû.",
	download: await configDownload("uevr/abzu.zip"),
	install: {
		installKind: "PerGame",
		dependencyOnly: true,
		extract: [{ source: ".", destination }],
	},
	paths: [{ path: destination, type: "Folder" }],
});
