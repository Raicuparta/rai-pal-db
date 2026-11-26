import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { everyoneBase } from "../helpers/everyone.ts";
import { getLatestFromGitHub } from "../helpers/github.ts";
import { defineMod } from "../mod.ts";

const { mono } = await getLatestFromGitHub(
	{ owner: "raicuparta", repo: "everyone-client" },
	{ mono: (assetName) => assetName.includes("unity-mono") },
);

const base = bepinexModBase("everyone-mono");

export default defineMod({
	id: base.id,
	...base.base,
	...everyoneBase,
	unityBackend: "Mono",
	optionalDependencies: [{ tag: "everyone-config" }],
	download: mono,
	install: {
		installKind: base.installKind,
		extract: [base.extract.plugin()],
	},
	paths: [
		base.paths.plugin(),
		base.paths.config("raicuparta.everyone.json"),
		base.paths.logOutput(),
	],
});
