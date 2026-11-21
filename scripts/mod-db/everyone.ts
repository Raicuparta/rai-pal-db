import { bepinexModHelper } from "./bepinex/bepinex-mod.ts";
import { getLatestFromGitHub } from "./github.ts";
import type { ModBase, ModDownload } from "./mod.ts";
import { token } from "./replacement-tokens.ts";

const repo = { owner: "raicuparta", repo: "everyone-client" } as const;
const description =
	"Adds multiplayerish features. Requires being logged in to Rai Pal. F3 to chat.";
const title = "Everyone";
const author = "Raicuparta";
const website = "https://github.com/Raicuparta/everyone-client";
const tags = ["everyone"] as const;

function unrealEveryone(download: ModDownload): ModBase {
	const id = "everyone-ue";
	return {
		id,
		engine: "Unreal",
		tags,
		title,
		author,
		website,
		description: description,
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
					destination: `${token.GameInstalledModsPath}/ue4ss/Mods/${id}/enabled.txt`,
				},
			],
		},
		paths: [
			{
				id: "mod",
				title: "Mod",
				type: "Folder",
				path: `${token.GameInstalledModsPath}/ue4ss/Mods/${id}`,
			},
		],
	};
}

function godotEveryone(major: 3 | 4, download: ModDownload): ModBase {
	const id = `everyone-godot-${major}`;
	const loaderId = `godot-loader-${major}`;
	return {
		id,
		engine: "Godot",
		engineVersionRange: {
			minimum: { major },
			...(major === 3 ? { maximum: { major } } : {}),
		},
		tags,
		title,
		author,
		website,
		description,
		download,
		requiredDependencies: [{ tag: "godot-loader" }],
		install: {
			manifestPath: `${token.GameInstalledModsPath}/manifests/${id}.json`,
			extract: [
				{
					source: ".",
					destination: `${token.GameInstalledModsPath}/${loaderId}/mods/everyone`,
				},
			],
		},
		paths: [
			{
				id: "mod",
				title: "Mod",
				type: "Folder",
				path: `${token.GameInstalledModsPath}/${loaderId}/mods/everyone`,
			},
		],
	};
}

export async function getEveryoneMods(): Promise<ModBase[]> {
	const { mono, il2cpp, godot3, godot4, unreal } = await getLatestFromGitHub(
		repo,
		{
			mono: (assetName) => assetName.includes("unity-mono"),
			il2cpp: (assetName) => assetName.includes("unity-il2cpp"),
			godot3: (assetName) => assetName.includes("godot-3"),
			godot4: (assetName) => assetName.includes("godot-4"),
			unreal: (assetName) => assetName.includes("unreal"),
		},
	);

	const bepinexMono = bepinexModHelper("everyone-mono");
	const bepinexIl2cpp = bepinexModHelper("everyone-il2cpp");

	return [
		{
			id: bepinexMono.id,
			...bepinexMono.base,
			unityBackend: "Mono",
			download: mono,
			title,
			tags,
			description,
			author,
			website,
			optionalDependencies: [{ tag: "everyone-config" }],
			install: {
				manifestPath: bepinexMono.manifestPath(),
				extract: [bepinexMono.extract.plugin()],
			},
			paths: [
				bepinexMono.paths.plugin(),
				bepinexMono.paths.config("raicuparta.everyone.json"),
			],
		},
		{
			id: bepinexIl2cpp.id,
			...bepinexIl2cpp.base,
			unityBackend: "Il2Cpp",
			download: il2cpp,
			tags,
			title,
			description,
			author,
			website,
			optionalDependencies: [{ tag: "everyone-config" }],
			install: {
				manifestPath: bepinexIl2cpp.manifestPath(),
				extract: [bepinexIl2cpp.extract.plugin()],
			},
			paths: [
				bepinexIl2cpp.paths.plugin(),
				bepinexIl2cpp.paths.config("raicuparta.everyone.json"),
			],
		},
		godotEveryone(3, godot3),
		godotEveryone(4, godot4),
		unrealEveryone(unreal),
	];
}
