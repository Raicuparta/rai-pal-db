import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { getLatestFromGitHub } from "../helpers/github.ts";
import { defineMod } from "../mod.ts";

const { mono } = await getLatestFromGitHub(
	{ owner: "yukieiji", repo: "UnityExplorer" },
	{ mono: (assetName) => assetName === "UnityExplorer.BepInEx5.Mono.zip" },
);

const base = bepinexModBase("unity-explorer-mono");

export default defineMod({
	id: base.id,
	...base.base,
	unityBackend: "Mono",
	tags: ["unity-explorer"],
	title: "UnityExplorer",
	author: "Sinai + yukieiji",
	website: "https://github.com/yukieiji/UnityExplorer",
	description:
		"An in-game UI for exploring, debugging and modifying Unity games.",
	download: mono,
	install: {
		installKind: base.installKind,
		extract: [base.extract.plugin()],
	},
	paths: [base.paths.plugin(), base.paths.logOutput()],
});
