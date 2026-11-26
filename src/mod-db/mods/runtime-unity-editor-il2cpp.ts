import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { getLatestFromGitHub } from "../helpers/github.ts";
import { defineMod } from "../mod.ts";

const { il2cpp } = await getLatestFromGitHub(
	{ owner: "ManlyMarco", repo: "RuntimeUnityEditor" },
	{
		il2cpp: (assetName) =>
			assetName.startsWith("RuntimeUnityEditor.Bepin6.IL2CPP_") &&
			assetName.endsWith(".zip"),
	},
);

const base = bepinexModBase("runtime-unity-editor-il2cpp");

export default defineMod({
	id: base.id,
	...base.base,
	unityBackend: "Il2Cpp",
	tags: ["runtime-unity-editor"],
	title: "Runtime Unity Editor",
	author: "ManlyMarco",
	website: "https://github.com/ManlyMarco/RuntimeUnityEditor",
	description:
		"In-game inspector and debugging tools. May work on games where UnityExplorer fails.",
	download: il2cpp,
	install: {
		installKind: base.installKind,
		extract: [base.extract.plugin("BepInEx/plugins")],
	},
	paths: [base.paths.plugin(), base.paths.logOutput()],
});
