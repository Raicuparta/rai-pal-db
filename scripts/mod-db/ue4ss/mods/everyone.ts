import { ModBase } from "../../mod.ts";
import { token } from "../../replacement-tokens.ts";

const id = "everyone-ue";

// The release zip contains a single `dlls/main.dll`, which UE4SS loads.
const downloadBase =
	"https://github.com/Raicuparta/rai-pal-db/releases/download/everyone-unreal-v0.1.0";

// deno-lint-ignore require-await
export async function getUnrealEveryoneMods(): Promise<ModBase[]> {
	return [
		{
			id,
			family: "everyone",
			engine: "Unreal",
			title: "Everyone (Unreal)",
			author: "Raicuparta",
			sourceCode: "https://github.com/Raicuparta/everyone",
			description:
				"Adds multiplayerish features. Requires being logged in to Rai Pal. F2 to connect.",
			download: {
				id: "0.1.0",
				url: `${downloadBase}/everyone-unreal.zip`,
			},
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
		},
	];
}
