import { bepinexModBase } from "../helpers/bepinex-mods.ts";
import { getLatestFromGitHub } from "../helpers/github.ts";
import { defineMod } from "../mod.ts";

const repo = "bepinex-ogs-ts";

const { bepinex } = await getLatestFromGitHub(
	{ owner: "BrianGilbert", repo },
	{
		bepinex: (assetName) =>
			assetName.startsWith("bepinex_ogs_telemetry-") &&
			assetName.endsWith("-win64.zip"),
	},
);

const base = bepinexModBase("ogs-bepinex-il2cpp");

export default defineMod({
	id: base.id,
	...base.base,
	unityBackend: "Il2Cpp",
	tags: ["ogs"],
	title: "OGS Telemetry (BepInEx)",
	author: "BrianGilbert",
	website: `https://github.com/BrianGilbert/${repo}`,
	description:
		"Publishes motion telemetry (pose and body dynamics) on the local network for motion rigs, from any Unity game BepInEx injects (IL2CPP / BepInEx 6).",
	download: bepinex,
	architecture: "X64",
	gameOs: "Windows",
	install: {
		installKind: base.installKind,
		extract: [base.extract.plugin("il2cpp")],
	},
	paths: [
		base.paths.plugin(),
		base.paths.config("ogs.telemetry.cfg"),
		base.paths.logOutput(),
	],
});
