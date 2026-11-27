import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { getLatestFromGitHub } from "../helpers/github.ts";
import { defineMod } from "../mod.ts";

const { download } = await getLatestFromGitHub(
	{ owner: "JohnCorby", repo: "lorns-lure-vr" },
	{ download: (assetName) => assetName === "mod.zip" },
);

const base = bepinexModBase("lorns-lure-vr");

export default defineMod({
	id: base.id,
	...base.base,
	title: "Lorn's Lure VR",
	description: "VR Mod for Lorn's Lure, with motion controls.",
	author: "JohnCorby",
	website: "https://github.com/JohnCorby/lorns-lure-vr",
	gameIds: {
		Steam: ["1417930", "1514800"],
		Itch: ["876614"],
		NormalizedExecutable: ["lornslure"],
	},
	unityBackend: "Mono",
	architecture: "X64",
	install: {
		installKind: base.installKind,
		extract: [base.extract.plugin(), base.extract.patcher()],
	},
	paths: [base.paths.plugin(), base.paths.patcher(), base.paths.logOutput()],
	download,
});
