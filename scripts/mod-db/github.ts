import { Octokit } from "octokit";
import { Release } from "./mod.ts";

type Params = {
	owner: string;
	repo: string;
	assetName: string;
};

const octokit = new Octokit();

export async function getLatestFromGitHub(params: Params): Promise<Release> {
	const response = await octokit.rest.repos.getLatestRelease({
		owner: params.owner,
		repo: params.repo,
	});

	const asset = response.data.assets.find((asset) =>
		asset.name === params.assetName
	);

	if (!asset) {
		throw new Error(
			`Asset with name "${params.assetName}" not found in the latest release of ${params.owner}/${params.repo}`,
		);
	}

	return {
		id: response.data.tag_name,
		url: asset.browser_download_url,
	};
}
