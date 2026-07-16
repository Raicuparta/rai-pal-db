import { Octokit } from "octokit";
import { ModDownload } from "./mod.ts";

type Params = {
	owner: string;
	repo: string;
	selectAssetName: (assetName: string) => boolean;
	formatId?: (tag: string) => string;
	allowPreRelease?: boolean;
};

const octokit = new Octokit();

async function getReleaseData(params: Params) {
	// First, try to get the latest full release.
	try {
		const response = await octokit.rest.repos.getLatestRelease({
			owner: params.owner,
			repo: params.repo,
		});
		return response.data;
	} catch (error) {
		// If allowPreRelease is false, re-throw immediately.
		if (!params.allowPreRelease) {
			throw error;
		}
	}

	// Fall back to the latest prerelease.
	const response = await octokit.rest.repos.listReleases({
		owner: params.owner,
		repo: params.repo,
		per_page: 100,
	});

	const preRelease = response.data
		.filter((r) => r.prerelease && r.published_at)
		.sort(
			(a, b) =>
				new Date(b.published_at!).getTime() -
				new Date(a.published_at!).getTime(),
		)[0];

	if (!preRelease) {
		throw new Error(
			`No pre-releases found for ${params.owner}/${params.repo}`,
		);
	}

	return preRelease;
}

export async function getLatestFromGitHub(
	params: Params,
): Promise<ModDownload> {
	const release = await getReleaseData(params);

	const asset = release.assets.find((asset) =>
		params.selectAssetName(asset.name)
	);

	if (!asset) {
		throw new Error(
			`Asset not found in the latest release of ${params.owner}/${params.repo}`,
		);
	}

	let id = release.tag_name;
	if (params.formatId) {
		try {
			id = params.formatId(release.tag_name) ?? release.tag_name;
		} catch (error) {
			console.warn(
				`Error formatting tag name "${release.tag_name}" with provided formatId function:`,
				error,
			);
		}
	}

	return {
		id,
		url: asset.browser_download_url,
	};
}
