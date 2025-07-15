type WorkflowRunsResponse = {
	workflow_runs: {
		run_number: number;
		head_sha: string;
	}[];
};

type Builds = {
	mono: {
		winX86: string;
		winX64: string;
		linuxX86: string;
		linuxX64: string;
		macosX64: string;
	};
	il2cpp: {
		winX86: string;
		winX64: string;
		linuxX64: string;
		macosX64: string;
	};
};

const RUN_NUMBER_OFFSET = 600; // They add this offset in their workflow when uploading builds for some reason.
const API_URL =
	"https://api.github.com/repos/BepInEx/BepInEx/actions/workflows/build.yml/runs?status=success&per_page=1";
const BLEEDING_BUILD_URL_BASE = `https://builds.bepinex.dev/projects/bepinex_be`;

export async function getLatestBuildURls(): Promise<Builds> {
	const response = await fetch(API_URL);

	console.log(
		`Fetching successful runs from the BepInEx GitHub build workflow...`
	);
	const data = await response.json();
	if (!isWorkflowRunsResponse(data)) {
		throw new Error(
			`Response has wrong format: ${JSON.stringify(data, null, 2)}`
		);
	}

	if (data.workflow_runs.length === 0) {
		throw new Error("Successful workflow run list is empty.");
	}

	console.log("Nice, API response seems valid.");

	const latestRun = data.workflow_runs[0];
	const runNumber = latestRun.run_number + RUN_NUMBER_OFFSET;
	const shortSha = latestRun.head_sha.slice(0, 7);
	const urlBase = `${BLEEDING_BUILD_URL_BASE}/${runNumber}/BepInEx-Unity`;

	const buildUrls = {
		mono: {
			winX86: `${urlBase}.Mono-win-x86-6.0.0-be.${runNumber}+${shortSha}.zip`,
			winX64: `${urlBase}.Mono-win-x64-6.0.0-be.${runNumber}+${shortSha}.zip`,
			linuxX86: `${urlBase}.Mono-linux-x86-6.0.0-be.${runNumber}+${shortSha}.zip`,
			linuxX64: `${urlBase}.Mono-linux-x64-6.0.0-be.${runNumber}+${shortSha}.zip`,
			macosX64: `${urlBase}.Mono-macos-x64-6.0.0-be.${runNumber}+${shortSha}.zip`,
		},
		il2cpp: {
			winX86: `${urlBase}.IL2CPP-win-x86-6.0.0-be.${runNumber}+${shortSha}.zip`,
			winX64: `${urlBase}.IL2CPP-win-x64-6.0.0-be.${runNumber}+${shortSha}.zip`,
			linuxX64: `${urlBase}.IL2CPP-linux-x64-6.0.0-be.${runNumber}+${shortSha}.zip`,
			macosX64: `${urlBase}.IL2CPP-macos-x64-6.0.0-be.${runNumber}+${shortSha}.zip`,
		},
	};
	console.log(`Build URLs:`, JSON.stringify(buildUrls, null, 2));

	console.log("Checking if all build URLs are accessible...");
	for (const buildType of Object.values(buildUrls)) {
		for (const buildUrl of Object.values(buildType)) {
			const buildResponse = await fetch(buildUrl, { method: "HEAD" });
			if (!buildResponse.ok) {
				throw new Error(
					`Build URL ${buildUrl} is not accessible: ${buildResponse.statusText}`
				);
			}
		}
	}

	return buildUrls;
}

function isWorkflowRunsResponse(data: unknown): data is WorkflowRunsResponse {
	if (typeof data !== "object" || data === null) {
		return false;
	}

	const dataObj = data as Record<string, unknown>;
	if (!Array.isArray(dataObj.workflow_runs)) {
		return false;
	}

	return dataObj.workflow_runs.every(
		(run): run is { run_number: number; head_sha: string } => {
			if (typeof run !== "object" || run === null) {
				return false;
			}

			return (
				typeof run.run_number === "number" && typeof run.head_sha === "string"
			);
		}
	);
}
