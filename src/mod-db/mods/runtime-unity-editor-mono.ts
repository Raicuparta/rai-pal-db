import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { getLatestFromGitHub } from "../helpers/github.ts";
import { defineMod } from "../mod.ts";

const { mono } = await getLatestFromGitHub(
	{ owner: "ManlyMarco", repo: "RuntimeUnityEditor" },
	{
		mono: (assetName) =>
			assetName.startsWith("RuntimeUnityEditor.Bepin5_") &&
			assetName.endsWith(".zip"),
	},
);

const base = bepinexModBase("runtime-unity-editor-mono");

export default defineMod({
	id: base.id,
	...base.base,
	unityBackend: "Mono",
	tags: ["runtime-unity-editor"],
	title: "Runtime Unity Editor",
	author: "ManlyMarco",
	website: "https://github.com/ManlyMarco/RuntimeUnityEditor",
	description:
		"In-game inspector and debugging tools. May work on games where UnityExplorer fails.",
	download: mono,
	install: {
		installKind: base.installKind,
		extract: [base.extract.plugin("BepInEx/plugins")],
	},
	paths: [base.paths.plugin(), base.paths.logOutput()],
});
