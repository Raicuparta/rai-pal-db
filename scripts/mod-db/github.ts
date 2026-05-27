import { Octokit } from "octokit";
import { ModDownload } from "./mod.ts";

type Params = {
	owner: string;
	repo: string;
	selectAssetName: (assetName: string) => boolean;
	formatId?: (tag: string) => string;
};

const octokit = new Octokit();

export async function getLatestFromGitHub(
	params: Params,
): Promise<ModDownload> {
	const response = await octokit.rest.repos.getLatestRelease({
		owner: params.owner,
		repo: params.repo,
	});

	const asset = response.data.assets.find((asset) =>
		params.selectAssetName(asset.name)
	);

	if (!asset) {
		throw new Error(
			`Asset not found in the latest release of ${params.owner}/${params.repo}`,
		);
	}

	let id = response.data.tag_name;
	if (params.formatId) {
		try {
			id = params.formatId(response.data.tag_name) ?? response.data.tag_name;
		} catch (error) {
			console.warn(
				`Error formatting tag name "${response.data.tag_name}" with provided formatId function:`,
				error,
			);
		}
	}

	return {
		id,
		url: asset.browser_download_url,
	};
}
