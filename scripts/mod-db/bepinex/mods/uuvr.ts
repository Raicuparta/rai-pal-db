import { getLatestFromGitHub } from "../../github.ts";
import type { ModBase } from "../../mod.ts";
import { bepinexModHelper } from "../bepinex-mod.ts";

const author = "Raicuparta";
const website = "https://github.com/Raicuparta/uuvr";

export async function getUuvrMods(): Promise<ModBase[]> {
	const { il2cppLegacyDownload, monoLegacyDownload, monoModernDownload } =
		await getLatestFromGitHub(
			{ owner: "Raicuparta", repo: "uuvr" },
			{
				il2cppLegacyDownload: (assetName) =>
					assetName.includes("il2cpp-legacy"),
				monoLegacyDownload: (assetName) => assetName.includes("mono-legacy"),
				monoModernDownload: (assetName) => assetName.includes("mono-modern"),
			},
		);

	const il2cppLegacy = bepinexModHelper("uuvr-il2cpp-legacy");
	const monoLegacy = bepinexModHelper("uuvr-mono-legacy");
	const monoModern = bepinexModHelper("uuvr-mono-modern");

	return [
		{
			id: il2cppLegacy.id,
			...il2cppLegacy.base,
			tags: ["uuvr"],
			unityBackend: "Il2Cpp",
			title: "UUVR",
			author,
			website,
			description:
				"Uses OpenVR. Start SteamVR before starting the game. Use the Configuration Manager mod to change UUVR settings for each game.",
			optionalDependencies: [{ tag: "uuvr-config" }],
			engineVersionRange: {
				maximum: {
					major: 2019,
				},
			},
			download: il2cppLegacyDownload,
			install: {
				manifestPath: il2cppLegacy.manifestPath(),
				extract: [il2cppLegacy.extract.plugin(), il2cppLegacy.extract.patch()],
			},
			paths: [
				il2cppLegacy.paths.plugin(),
				il2cppLegacy.paths.patcher(),
				il2cppLegacy.paths.config("raicuparta.uuvr-legacy.cfg"),
			],
		},
		{
			id: monoLegacy.id,
			...monoLegacy.base,
			tags: ["uuvr"],
			unityBackend: "Mono",
			title: "UUVR",
			author,
			website,
			description:
				"Uses OpenVR. Start SteamVR before starting the game. Use the Configuration Manager mod to change UUVR settings for each game.",
			optionalDependencies: [{ tag: "uuvr-config" }],
			engineVersionRange: {
				maximum: {
					major: 2019,
				},
			},
			download: monoLegacyDownload,
			install: {
				manifestPath: monoLegacy.manifestPath(),
				extract: [monoLegacy.extract.plugin(), monoLegacy.extract.patch()],
			},
			paths: [
				monoLegacy.paths.plugin(),
				monoLegacy.paths.patcher(),
				monoLegacy.paths.config("raicuparta.uuvr-legacy.cfg"),
			],
		},
		{
			id: monoModern.id,
			...monoModern.base,
			tags: ["uuvr"],
			unityBackend: "Mono",
			title: "UUVR",
			author,
			website,
			description:
				"Supports OpenXR and OpenVR. Use the Configuration Manager mod to change UUVR settings for each game.",
			optionalDependencies: [{ tag: "uuvr-config" }],
			engineVersionRange: {
				minimum: {
					major: 2018,
					minor: 4,
				},
			},
			download: monoModernDownload,
			install: {
				manifestPath: monoModern.manifestPath(),
				extract: [monoModern.extract.plugin(), monoModern.extract.patch()],
			},
			paths: [
				monoModern.paths.plugin(),
				monoModern.paths.patcher(),
				monoModern.paths.config("raicuparta.uuvr-modern.cfg"),
			],
		},
	];
}
