import { getLatestFromGitHub } from "../../github.ts";
import { bepinexMod } from "../bepinex-mod.ts";

export async function getUnityExplorerMods() {
	const { il2cpp, mono } = await getLatestFromGitHub(
		{ owner: "yukieiji", repo: "UnityExplorer" },
		{
			il2cpp: (assetName) =>
				assetName === "UnityExplorer.BepInEx.Unity.IL2CPP.CoreCLR.zip",
			mono: (assetName) => assetName === "UnityExplorer.BepInEx5.Mono.zip",
		},
	);

	return [
		bepinexMod({
			id: "unity-explorer-il2cpp",
			family: "unity-explorer",
			unityBackend: "Il2Cpp",
			title: "UnityExplorer",
			author: "Sinai + yukieiji",
			sourceCode: "https://github.com/yukieiji/UnityExplorer",
			description:
				"An in-game UI for exploring, debugging and modifying Unity games. Not compatible with Config Manager.",
			download: il2cpp,
		}),
		bepinexMod({
			id: "unity-explorer-mono",
			family: "unity-explorer",
			unityBackend: "Mono",
			title: "UnityExplorer",
			author: "Sinai + yukieiji",
			sourceCode: "https://github.com/yukieiji/UnityExplorer",
			description:
				"An in-game UI for exploring, debugging and modifying Unity games.",
			download: mono,
		}),
	];
}
