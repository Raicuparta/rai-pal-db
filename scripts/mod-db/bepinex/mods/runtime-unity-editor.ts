import { getLatestFromGitHub } from "../../github.ts";
import { bepinexMod } from "../bepinex-mod.ts";

export async function getRuntimeUnityEditorMods() {
	return [
		bepinexMod({
			id: "runtime-unity-editor-mono",
			unityBackend: "Mono",
			title: "Runtime Unity Editor",
			author: "ManlyMarco",
			sourceCode: "https://github.com/ManlyMarco/RuntimeUnityEditor",
			description:
				"In-game inspector and debugging tools. May work on games where UnityExplorer fails.",
			download: await getLatestFromGitHub({
				owner: "ManlyMarco",
				repo: "RuntimeUnityEditor",
				selectAssetName: (assetName) =>
					assetName.startsWith("RuntimeUnityEditor.Bepin5_") &&
					assetName.endsWith(".zip"),
			}),
		}, {
			zipRoot: "BepInEx",
		}),
		bepinexMod({
			id: "runtime-unity-editor-il2cpp",
			unityBackend: "Il2Cpp",
			title: "Runtime Unity Editor",
			author: "ManlyMarco",
			sourceCode: "https://github.com/ManlyMarco/RuntimeUnityEditor",
			description:
				"In-game inspector and debugging tools. May work on games where UnityExplorer fails.",
			download: await getLatestFromGitHub({
				owner: "ManlyMarco",
				repo: "RuntimeUnityEditor",
				selectAssetName: (assetName) =>
					assetName.startsWith("RuntimeUnityEditor.Bepin6.IL2CPP_") &&
					assetName.endsWith(".zip"),
			}),
		}, {
			zipRoot: "BepInEx",
		}),
	];
}
