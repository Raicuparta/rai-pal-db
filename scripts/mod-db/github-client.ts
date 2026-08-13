import { Octokit } from "octokit";

export function createOctokit(): Octokit {
	const token = Deno.env.get("GITHUB_TOKEN") ?? Deno.env.get("GH_TOKEN");
	return new Octokit(token ? { auth: token } : {});
}
