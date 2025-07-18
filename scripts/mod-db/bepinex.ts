import { DOMParser } from "@b-fuze/deno-dom";

const BLEEDING_BUILD_URL_DOMAIN = "https://builds.bepinex.dev";
const BLEEDING_BUILD_URL_BASE = `${BLEEDING_BUILD_URL_DOMAIN}/projects/bepinex_be`;

type BuildInfo = {
	[version: string]: {
		[engine: string]: {
			[os: string]: {
				[arch: string]: string;
			};
		};
	};
};

export async function getLatestBuildURls(): Promise<BuildInfo> {
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

	return links.reduce((result: BuildInfo, href) => {
		const match = href.match(
			/\/(\d+)\/BepInEx-(Unity\.(Mono|IL2CPP))-(win|linux|macos)-(x86|x64)-/
		);

		if (match && !href.includes("NET")) {
			const [, version, engine, , os, arch] = match;

			if (!result[version]) result[version] = {};
			if (!result[version][engine]) result[version][engine] = {};
			if (!result[version][engine][os]) result[version][engine][os] = {};

			result[version][engine][os][arch] = `${BLEEDING_BUILD_URL_DOMAIN}${href}`;
		}

		return result;
	}, {});
}
