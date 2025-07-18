import { DOMParser } from "@b-fuze/deno-dom";

const BLEEDING_BUILD_URL_DOMAIN = "https://builds.bepinex.dev";
const BLEEDING_BUILD_URL_BASE = `${BLEEDING_BUILD_URL_DOMAIN}/projects/bepinex_be`;

type BepInExBuilds = {
	[version: string]: BepInExBuild[];
};

type BepInExBuild = {
	engine: string;
	os: string;
	arch: string;
	downloadUrl: string;
};

export async function getLatestBuildURls(): Promise<BepInExBuilds> {
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
			/\/(\d+)\/BepInEx-(Unity\.(Mono|IL2CPP))-(win|linux|macos)-(x86|x64)-/
		);

		if (match && !href.includes("NET")) {
			const [, version, engine, , os, arch] = match;

			if (!result[version]) result[version] = [];

			result[version].push({
				arch,
				os,
				engine,
				downloadUrl: `${BLEEDING_BUILD_URL_DOMAIN}${href}`,
			});
		}

		return result;
	}, {});
}
