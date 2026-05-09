import { DOMParser } from "@b-fuze/deno-dom";
import { ModSchema } from "#types/db-schema.ts";

const BLEEDING_BUILD_URL_DOMAIN = "https://builds.bepinex.dev";
const BLEEDING_BUILD_URL_BASE = `${BLEEDING_BUILD_URL_DOMAIN}/projects/bepinex_be`;

type Arch = "x86" | "x64";

interface LatestByArchEntry {
	version: string;
	timestamp: number;
	downloadUrl: string;
}

function toIl2CppModSchema(
	architecture: NonNullable<ModSchema["architecture"]>,
	latest: LatestByArchEntry | undefined,
): ModSchema {
	return {
		id: `bepinex-il2cpp-${architecture.toLowerCase()}`,
		engine: "Unity",
		architecture,
		unityBackend: "Il2Cpp",
		title: `BepInEx Il2Cpp ${architecture}`,
		author: "BepInEx",
		sourceCode: "https://github.com/BepInEx/BepInEx",
		description: `BepInEx bleeding-edge Il2Cpp build for ${architecture} games.`,
		latestVersion: latest
			? {
					id: latest.version,
					url: latest.downloadUrl,
				}
			: undefined,
	};
}

export async function getBepInExBleedingReleases(): Promise<ModSchema[]> {
	const response = await fetch(BLEEDING_BUILD_URL_BASE);
	const html = await response.text();

	const doc = new DOMParser().parseFromString(html, "text/html");
	if (!doc) {
		throw new Error("Failed to parse BepInEx bleeding builds HTML");
	}

	const releaseElements = doc.getElementsByClassName("artifact-item");
	const latestByArch: Partial<Record<Arch, LatestByArchEntry>> = {};

	for (const releaseElement of releaseElements) {
		const dateText =
			releaseElement.getElementsByClassName("build-date")[0]?.innerText;
		const releaseTimestamp = Date.parse(dateText ?? "");

		if (!releaseTimestamp) {
			console.warn(`Invalid date format: ${dateText}`);
			continue;
		}

		const buildLinkElements =
			releaseElement.getElementsByClassName("artifact-link");

		for (const buildLinkElement of buildLinkElements) {
			const href = buildLinkElement.getAttribute("href");
			if (!href || href.includes("NET")) {
				continue;
			}

			const match = href.match(
				/\/BepInEx-Unity\.(Mono|IL2CPP)-(win|linux|macos)-(x86|x64)-(\d+\.\d+\.\d+-be\.\d+)/,
			);
			if (!match) {
				continue;
			}

			const [, backend, , arch, buildVersion] = match;
			if (backend !== "IL2CPP") {
				continue;
			}

			const existing = latestByArch[arch as Arch];
			if (!existing || releaseTimestamp > existing.timestamp) {
				latestByArch[arch as Arch] = {
					version: buildVersion,
					timestamp: releaseTimestamp,
					downloadUrl: `${BLEEDING_BUILD_URL_DOMAIN}${href}`,
				};
			}
		}
	}

	return [
		toIl2CppModSchema("X86", latestByArch.x86),
		toIl2CppModSchema("X64", latestByArch.x64),
	];
}
