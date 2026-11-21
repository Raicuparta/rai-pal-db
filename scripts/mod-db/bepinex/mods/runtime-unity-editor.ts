import { getLatestFromGitHub } from "../../github.ts";
import type { ModBase } from "../../mod.ts";
import { bepinexModHelper } from "../bepinex-mod.ts";

export async function getRuntimeUnityEditorMods(): Promise<ModBase[]> {
	const { mono, il2cpp } = await getLatestFromGitHub(
		{ owner: "ManlyMarco", repo: "RuntimeUnityEditor" },
		{
			mono: (assetName) =>
				assetName.startsWith("RuntimeUnityEditor.Bepin5_") &&
				assetName.endsWith(".zip"),
			il2cpp: (assetName) =>
				assetName.startsWith("RuntimeUnityEditor.Bepin6.IL2CPP_") &&
				assetName.endsWith(".zip"),
		},
	);

	const monoHelper = bepinexModHelper("runtime-unity-editor-mono");
	const il2cppHelper = bepinexModHelper("runtime-unity-editor-il2cpp");
	const monoPlugin = {
		source: "BepInEx/plugins",
		destination: monoHelper.pluginFolder(),
	};
	const il2cppPlugin = {
		source: "BepInEx/plugins",
		destination: il2cppHelper.pluginFolder(),
	};

	return [
		{
			id: monoHelper.id,
			...monoHelper.base,
			tags: ["runtime-unity-editor"],
			unityBackend: "Mono",
			title: "Runtime Unity Editor",
			author: "ManlyMarco",
			website: "https://github.com/ManlyMarco/RuntimeUnityEditor",
			description:
				"In-game inspector and debugging tools. May work on games where UnityExplorer fails.",
			download: mono,
			install: {
				manifestPath: monoHelper.manifestPath(),
				extract: [monoPlugin],
			},
			paths: [monoHelper.paths.plugin()],
		},
		{
			id: il2cppHelper.id,
			...il2cppHelper.base,
			tags: ["runtime-unity-editor"],
			unityBackend: "Il2Cpp",
			title: "Runtime Unity Editor",
			author: "ManlyMarco",
			website: "https://github.com/ManlyMarco/RuntimeUnityEditor",
			description:
				"In-game inspector and debugging tools. May work on games where UnityExplorer fails.",
			download: il2cpp,
			install: {
				manifestPath: il2cppHelper.manifestPath(),
				extract: [il2cppPlugin],
			},
			paths: [il2cppHelper.paths.plugin()],
		},
	];
}
