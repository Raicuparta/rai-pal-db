import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { getLatestFromGitHub } from "../helpers/github.ts";
import { defineMod } from "../mod.ts";

const { il2cpp } = await getLatestFromGitHub(
	{ owner: "yukieiji", repo: "UnityExplorer" },
	{
		il2cpp: (assetName) =>
			assetName === "UnityExplorer.BepInEx.Unity.IL2CPP.CoreCLR.zip",
	},
);

const base = bepinexModBase("unity-explorer-il2cpp");

export default defineMod({
	id: base.id,
	...base.base,
	unityBackend: "Il2Cpp",
	tags: ["unity-explorer"],
	title: "UnityExplorer",
	author: "Sinai + yukieiji",
	website: "https://github.com/yukieiji/UnityExplorer",
	description:
		"An in-game UI for exploring, debugging and modifying Unity games. Not compatible with Config Manager.",
	download: il2cpp,
	install: {
		installKind: base.installKind,
		extract: [base.extract.plugin()],
	},
	paths: [base.paths.plugin(), base.paths.logOutput()],
});
