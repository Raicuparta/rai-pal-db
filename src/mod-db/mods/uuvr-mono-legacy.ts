import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { getLatestFromGitHub } from "../helpers/github.ts";
import { uuvrBase } from "../helpers/uuvr.ts";
import { defineMod } from "../mod.ts";

const { download } = await getLatestFromGitHub(
	{ owner: "Raicuparta", repo: "uuvr" },
	{ download: (assetName) => assetName.includes("mono-legacy") },
);

const base = bepinexModBase("uuvr-mono-legacy");

export default defineMod({
	id: base.id,
	...base.base,
	...uuvrBase("legacy"),
	unityBackend: "Mono",
	download,
	install: {
		installKind: base.installKind,
		extract: [base.extract.plugin(), base.extract.patcher()],
	},
	paths: [
		base.paths.plugin(),
		base.paths.patcher(),
		base.paths.config("raicuparta.uuvr-legacy.cfg"),
		base.paths.logOutput(),
	],
});
