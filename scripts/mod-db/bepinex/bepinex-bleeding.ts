import { DOMParser } from "@b-fuze/deno-dom";
import { BepInExBuilds, UnityBackend } from "#mod-db/bepinex/bepinex.ts";

const BLEEDING_BUILD_URL_DOMAIN = "https://builds.bepinex.dev";
const BLEEDING_BUILD_URL_BASE = `${BLEEDING_BUILD_URL_DOMAIN}/projects/bepinex_be`;

export async function getBepInExBleedingBuilds(): Promise<BepInExBuilds> {
	const response = await fetch(BLEEDING_BUILD_URL_BASE);
	const html = await response.text();

	const doc = new DOMParser().parseFromString(html, "text/html");
	const links = doc
		.getElementsByClassName("artifact-link")
		.reduce((accumulator: string[], element) => {
			const href = element.getAttribute("href");
			if (href) accumulator.push(href);
			return accumulator;
		}, []);

	return links.reduce((result: BepInExBuilds, href) => {
		const match = href.match(
			/\/BepInEx-Unity\.(Mono|IL2CPP)-(win|linux|macos)-(x86|x64)-(\d+\.\d+\.\d+-be\.\d+)/
		);

		if (match && !href.includes("NET")) {
			const [, backend, os, arch, version] = match;

			if (!result[version]) result[version] = [];

			result[version].push({
				arch,
				os,
				backend: backend as UnityBackend, // TODO validate.
				downloadUrl: `${BLEEDING_BUILD_URL_DOMAIN}${href}`,
			});
		}

		return result;
	}, {});
}
