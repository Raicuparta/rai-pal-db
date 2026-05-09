import { Octokit } from "octokit";
import { LoaderDatabase, LoaderRelease } from "#loader-db/main.ts";

const octokit = new Octokit();

export async function getUe4ssDatabase(): Promise<LoaderDatabase> {
	const releases = await getUe4ssReleases();

	return {
		id: "ue4ss",
		releases,
	};
}

async function getUe4ssReleases(): Promise<LoaderRelease[]> {
	console.log("[UE4SS] Fetching experimental release from GitHub...");
	const fetchStart = performance.now();
	
	const response = await octokit.rest.repos.getReleaseByTag({
		owner: "UE4SS-RE",
		repo: "RE-UE4SS",
		tag: "experimental",
	});
	
	console.log(`[UE4SS] GitHub fetch completed in ${(performance.now() - fetchStart).toFixed(2)}ms`);

	const gitHubRelease = response.data;
	const ue4ssReleases: LoaderRelease[] = [];

	if (!gitHubRelease.assets || gitHubRelease.assets.length === 0) {
		console.log("[UE4SS] No assets found in release");
		return ue4ssReleases;
	}

	console.log(`[UE4SS] Found ${gitHubRelease.assets.length} total assets, processing...`);
	const processingStart = performance.now();

	// Group assets by version (UE4SS_v[VERSION]-[SOMETHING].zip pattern)
	const releasesByVersion: Record<
		string,
		{ timestamp: number; downloadUrls: string[] }
	> = {};

	let matchedAssets = 0;
	for (const asset of gitHubRelease.assets) {
		const match = asset.name.match(/^UE4SS_(v[\d.]+\-\d+)[\-\w]*\.zip$/);
		if (!match) {
			continue;
		}

		matchedAssets++;
		const version = match[1];
		const publishedAt = gitHubRelease.published_at ?? gitHubRelease.created_at;
		const timestamp = new Date(publishedAt).getTime();

		if (!releasesByVersion[version]) {
			releasesByVersion[version] = {
				timestamp,
				downloadUrls: [],
			};
		}

		releasesByVersion[version].downloadUrls.push(asset.browser_download_url);
	}

	console.log(`[UE4SS] Matched ${matchedAssets} assets to version pattern`);
	console.log(`[UE4SS] Found ${Object.keys(releasesByVersion).length} unique versions`);

	// Convert to LoaderRelease format
	const conversionStart = performance.now();
	for (const [version, data] of Object.entries(releasesByVersion)) {
		const release: LoaderRelease = {
			version,
			timestamp: data.timestamp,
			builds: data.downloadUrls.map((downloadUrl) => ({
				downloadUrl,
				os: "win",
			})),
		};
		ue4ssReleases.push(release);
	}
	console.log(`[UE4SS] Conversion completed in ${(performance.now() - conversionStart).toFixed(2)}ms`);

	// Sort by timestamp descending (most recent first)
	const sortStart = performance.now();
	ue4ssReleases.sort((a, b) => b.timestamp - a.timestamp);
	console.log(`[UE4SS] Sort completed in ${(performance.now() - sortStart).toFixed(2)}ms`);
	
	console.log(`[UE4SS] Total processing time: ${(performance.now() - processingStart).toFixed(2)}ms`);
	return ue4ssReleases;
}
