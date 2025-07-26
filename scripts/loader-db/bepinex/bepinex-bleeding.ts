import { DOMParser } from "@b-fuze/deno-dom";
import {
	BepInExBuild,
	BepInExRelease,
	UnityBackend,
} from "#loader-db/bepinex/bepinex.ts";

const BLEEDING_BUILD_URL_DOMAIN = "https://builds.bepinex.dev";
const BLEEDING_BUILD_URL_BASE = `${BLEEDING_BUILD_URL_DOMAIN}/projects/bepinex_be`;

export async function getBepInExBleedingReleases(): Promise<BepInExRelease[]> {
	const response = await fetch(BLEEDING_BUILD_URL_BASE);
	const html = await response.text();

	const doc = new DOMParser().parseFromString(html, "text/html");
	const releaseElements = doc.getElementsByClassName("artifact-item");
	const bepInExReleases: BepInExRelease[] = [];

	for (const releaseElement of releaseElements) {
		const dateText =
			releaseElement.getElementsByClassName("build-date")[0]?.innerText;

		// At the moment of writing this, the bepinex bleeding builds page uses dates formatted like 2021-11-08T19:15:05.4180938+00:00
		// That format can be passed directly to Date.parse.
		// Note that if you open the page on your browser with Javascript enabled, you'll see a different format.
		// The crawler sees just the pure HTML, which has this useful format.
		const releaseTimestamp = Date.parse(dateText);

		if (!releaseTimestamp) {
			console.warn(`Invalid date format: ${dateText}`);
			continue;
		}

		const builds: BepInExBuild[] = [];

		// Version needs to be parsed from assets, so we declare it here and wait for it to be defined later.
		let releaseVersion: string | null = null;

		const buildLinkElements =
			releaseElement.getElementsByClassName("artifact-link");

		for (const buildLinkElement of buildLinkElements) {
			const href = buildLinkElement.getAttribute("href");
			if (!href) continue;

			const match = href.match(
				/\/BepInEx-Unity\.(Mono|IL2CPP)-(win|linux|macos)-(x86|x64)-(\d+\.\d+\.\d+-be\.\d+)/
			);

			if (match && !href.includes("NET")) {
				const [, backend, os, arch, buildVersion] = match;

				if (!releaseVersion) {
					releaseVersion = buildVersion;
				}

				builds.push({
					arch,
					os,
					backend: backend as UnityBackend, // TODO validate.
					downloadUrl: `${BLEEDING_BUILD_URL_DOMAIN}${href}`,
				});
			}
		}

		if (!releaseVersion) {
			// throw new Error(
			// 	`Finished parsing BepInEx bleeding builds for release with date ${dateText}, but release version was not set.`
			// );
			console.warn(
				`Finished parsing BepInEx bleeding builds for release with date ${dateText}, but release version was not set.`
			);
			continue;
		}

		bepInExReleases.push({
			version: releaseVersion,
			timestamp: releaseTimestamp,
			builds,
		});
	}

	return bepInExReleases;
}
