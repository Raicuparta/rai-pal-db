import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { getLatestFromGitHub } from "../helpers/github.ts";
import { uuvrBase } from "../helpers/uuvr.ts";
import { defineMod } from "../mod.ts";

const { download } = await getLatestFromGitHub(
	{ owner: "Raicuparta", repo: "uuvr" },
	{ download: (assetName) => assetName.includes("il2cpp-legacy") },
);

const base = bepinexModBase("uuvr-il2cpp-legacy");

export default defineMod({
	id: base.id,
	...base.base,
	...uuvrBase("legacy"),
	unityBackend: "Il2Cpp",
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
