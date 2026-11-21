import { getLatestFromGitHub } from "../../github.ts";
import type { ModBase } from "../../mod.ts";
import { bepinexModHelper } from "../bepinex-mod.ts";

export async function getUnityExplorerMods(): Promise<ModBase[]> {
	const { il2cpp, mono } = await getLatestFromGitHub(
		{ owner: "yukieiji", repo: "UnityExplorer" },
		{
			il2cpp: (assetName) =>
				assetName === "UnityExplorer.BepInEx.Unity.IL2CPP.CoreCLR.zip",
			mono: (assetName) => assetName === "UnityExplorer.BepInEx5.Mono.zip",
		},
	);

	const il2cppHelper = bepinexModHelper("unity-explorer-il2cpp");
	const monoHelper = bepinexModHelper("unity-explorer-mono");

	return [
		{
			id: il2cppHelper.id,
			...il2cppHelper.base,
			tags: ["unity-explorer"],
			unityBackend: "Il2Cpp",
			title: "UnityExplorer",
			author: "Sinai + yukieiji",
			website: "https://github.com/yukieiji/UnityExplorer",
			description:
				"An in-game UI for exploring, debugging and modifying Unity games. Not compatible with Config Manager.",
			download: il2cpp,
			install: {
				manifestPath: il2cppHelper.manifestPath(),
				extract: [il2cppHelper.extract.plugin()],
			},
			paths: [il2cppHelper.paths.plugin()],
		},
		{
			id: monoHelper.id,
			...monoHelper.base,
			tags: ["unity-explorer"],
			unityBackend: "Mono",
			title: "UnityExplorer",
			author: "Sinai + yukieiji",
			website: "https://github.com/yukieiji/UnityExplorer",
			description:
				"An in-game UI for exploring, debugging and modifying Unity games.",
			download: mono,
			install: {
				manifestPath: monoHelper.manifestPath(),
				extract: [monoHelper.extract.plugin()],
			},
			paths: [monoHelper.paths.plugin()],
		},
	];
}
