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
	const response = await octokit.rest.repos.getReleaseByTag({
		owner: "UE4SS-RE",
		repo: "RE-UE4SS",
		tag: "experimental",
	});

	const gitHubRelease = response.data;

	if (!gitHubRelease.assets || gitHubRelease.assets.length === 0) {
		throw new Error("No assets found for UE4SS experimental release");
	}

	return gitHubRelease.assets
		.flatMap((asset) => {
			const match = asset.name.match(/^UE4SS_(v[\d.]+\-\d+)[\-\w]*\.zip$/);
			if (!match) return [];

			const version = match[1];
			const timestamp = new Date(asset.updated_at).getTime();

			return [
				{
					version,
					timestamp,
					builds: [
						{
							downloadUrl: asset.browser_download_url,
							os: "win",
						},
					],
				},
			];
		})
		.sort((a, b) => b.timestamp - a.timestamp);
}
