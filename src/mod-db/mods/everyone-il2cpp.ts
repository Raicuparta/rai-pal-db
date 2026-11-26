import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { everyoneBase } from "../helpers/everyone.ts";
import { getLatestFromGitHub } from "../helpers/github.ts";
import { defineMod } from "../mod.ts";

const { il2cpp } = await getLatestFromGitHub(
	{ owner: "raicuparta", repo: "everyone-client" },
	{ il2cpp: (assetName) => assetName.includes("unity-il2cpp") },
);

const base = bepinexModBase("everyone-il2cpp");

export default defineMod({
	id: base.id,
	...base.base,
	...everyoneBase,
	unityBackend: "Il2Cpp",
	optionalDependencies: [{ tag: "everyone-config" }],
	download: il2cpp,
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
