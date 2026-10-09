import { bepinexMod } from "./bepinex/bepinex-mod.ts";
import { getLatestFromGitHub } from "./github.ts";
import { ModBase, ModDownload } from "./mod.ts";
import { token } from "./replacement-tokens.ts";

const sourceCode = "https://github.com/Raicuparta/everyone-client";
const author = "Raicuparta";

const REPO = { owner: "raicuparta", repo: "everyone-client" } as const;

// The release zip contains a single `dlls/main.dll`, which UE4SS loads.
function unrealEveryone(download: ModDownload): ModBase {
	const id = "everyone-ue";
	return {
		id,
		family: "everyone",
		engine: "Unreal",
		title: "Everyone (Unreal)",
		author,
		sourceCode,
		description:
			"Adds multiplayerish features. Requires being logged in to Rai Pal. F2 to connect.",
		download,
		requiredDependencies: [{ modId: "ue4ss" }],
		install: {
			manifestPath: `${token.GameInstalledModsPath}/manifests/${id}.json`,
			extract: [
				{
					source: "dlls",
					destination: `${token.GameInstalledModsPath}/ue4ss/Mods/${id}/dlls`,
				},
			],
			write: [
				{
					content: "",
					destination:
						`${token.GameInstalledModsPath}/ue4ss/Mods/${id}/enabled.txt`,
				},
			],
			mainInstalledFolderPath:
				`${token.GameInstalledModsPath}/ue4ss/Mods/${id}`,
		},
	};
}

// Each zip contains a single `everyone-<major>.gd` script.
function godotEveryone(major: 3 | 4, download: ModDownload): ModBase {
	const id = `everyone-godot-${major}`;
	const loaderId = `godot-loader-${major}`;
	return {
		id,
		family: "everyone",
		engine: "Godot",
		engineVersionRange: {
			minimum: { major },
			...(major === 3 ? { maximum: { major } } : {}),
		},
		title: `Everyone (Godot ${major})`,
		author,
		sourceCode,
		description:
			"Adds multiplayerish features. Requires being logged in to Rai Pal. F3 to chat.",
		download,
		requiredDependencies: [{ family: "godot" }],
		install: {
			manifestPath: `${token.GameInstalledModsPath}/manifests/${id}.json`,
			extract: [
				{
					source: ".",
					destination:
						`${token.GameInstalledModsPath}/${loaderId}/mods/everyone`,
				},
			],
			mainInstalledFolderPath:
				`${token.GameInstalledModsPath}/${loaderId}/mods/everyone`,
		},
	};
}

export async function getEveryoneMods(): Promise<ModBase[]> {
	const { mono, il2cpp, godot3, godot4, unreal } = await getLatestFromGitHub(
		REPO,
		{
			mono: (assetName) => assetName.includes("unity-mono"),
			il2cpp: (assetName) => assetName.includes("unity-il2cpp"),
			godot3: (assetName) => assetName.includes("godot-3"),
			godot4: (assetName) => assetName.includes("godot-4"),
			unreal: (assetName) => assetName.includes("unreal"),
		},
	);

	const description =
		"Adds multiplayerish features. Requires being logged in to Rai Pal. F3 to chat.";

	return [
		bepinexMod(
			{
				id: "everyone-mono",
				family: "everyone",
				unityBackend: "Mono",
				title: "Everyone (Mono)",
				author,
				sourceCode,
				description,
				download: mono,
			},
			{
				configFileName: "raicuparta.everyone.json",
			},
		),
		bepinexMod(
			{
				id: "everyone-il2cpp",
				family: "everyone",
				unityBackend: "Il2Cpp",
				title: "Everyone (Il2Cpp)",
				author,
				sourceCode,
				description,
				download: il2cpp,
			},
			{
				configFileName: "raicuparta.everyone.json",
			},
		),
		godotEveryone(3, godot3),
		godotEveryone(4, godot4),
		unrealEveryone(unreal),
	];
}
