import { BepInExBuilds, UnityBackend } from "#loader-db/bepinex/bepinex.ts";

const repository = "BepInEx/BepInEx";

export async function getBepInExStableBuilds(): Promise<BepInExBuilds> {
	const response = await fetch(
		`https://api.github.com/repos/${repository}/releases?per_page=100`
	);
	const releases = await response.json();

	const builds: BepInExBuilds = {};

	for (const release of releases) {
		if (release.assets) {
			for (const asset of release.assets) {
				// Modern pattern: BepInEx_(linux|win|macos)_(x64|x86)_version.zip
				const modernMatch = asset.name.match(
					/^BepInEx_(linux|win|macos)_(x64|x86)_/
				);

				// Older pattern: BepInEx_(unix|x64|x86)_version.zip
				const legacyMatch = asset.name.match(/^BepInEx_(unix|x64|x86)_/);

				// Prerelease pattern: BepInEx-{Backend}-{OS}-{Arch}-{Version}.zip
				const prereleaseMatch = asset.name.match(
					/^BepInEx-(.+)-(linux|win|macos)-(x64|x86)-/
				);

				// Alternative prerelease pattern: BepInEx_{Backend}_{OS/Arch}_{Version}.zip
				const altPrereleaseMatch = asset.name.match(
					/^BepInEx_(.+)_(unix|x64|x86)_/
				);

				let os: string;
				let arch: string;
				let backend: UnityBackend;

				if (modernMatch) {
					[, os, arch] = modernMatch;
					backend = "Mono"; // Stable releases are Mono only
				} else if (legacyMatch) {
					const [, osOrArch] = legacyMatch;
					backend = "Mono"; // Stable releases are Mono only

					if (osOrArch === "unix") {
						os = "linux";
						arch = "x64"; // Unix releases are x64
					} else if (osOrArch === "x64" || osOrArch === "x86") {
						os = "win"; // x64/x86 without OS prefix means Windows
						arch = osOrArch;
					} else {
						console.warn(
							`Skipping asset ${asset.name} from release ${release.tag_name} due to unknown OS/arch pattern`
						);
						continue; // Skip unknown patterns
					}
				} else if (prereleaseMatch) {
					const [, backendStr, osStr, archStr] = prereleaseMatch;
					os = osStr;
					arch = archStr;

					// Map backend string to UnityBackend type
					if (backendStr.includes("Unity.Mono")) {
						backend = "Mono";
					} else if (backendStr.includes("Unity.IL2CPP")) {
						backend = "Il2Cpp";
					} else if (
						backendStr.includes("NET.Framework") ||
						backendStr.includes("NET.CoreCLR")
					) {
						backend = "Mono"; // .NET Framework/CoreCLR builds are treated as Mono
					} else {
						console.warn(
							`Skipping asset ${asset.name} from release ${release.tag_name} due to unknown backend: ${backendStr}`
						);
						continue;
					}
				} else if (altPrereleaseMatch) {
					const [, backendStr, osOrArch] = altPrereleaseMatch;

					// Handle OS/Arch mapping
					if (osOrArch === "unix") {
						os = "linux";
						arch = "x64"; // Unix releases are x64
					} else if (osOrArch === "x64" || osOrArch === "x86") {
						os = "win"; // x64/x86 without OS prefix means Windows
						arch = osOrArch;
					} else {
						console.warn(
							`Skipping asset ${asset.name} from release ${release.tag_name} due to unknown OS/arch pattern: ${osOrArch}`
						);
						continue;
					}

					// Map backend string to UnityBackend type
					if (backendStr.includes("UnityMono")) {
						backend = "Mono";
					} else if (backendStr.includes("UnityIL2CPP")) {
						backend = "Il2Cpp";
					} else if (backendStr.includes("NetLauncher")) {
						backend = "Mono"; // NetLauncher is treated as Mono
					} else {
						console.warn(
							`Skipping asset ${asset.name} from release ${release.tag_name} due to unknown backend: ${backendStr}`
						);
						continue;
					}
				} else {
					console.warn(
						`Skipping asset ${asset.name} from release ${release.tag_name} due to unknown naming pattern`
					);
					continue; // Skip assets that don't match any pattern
				}

				const version = release.tag_name.replace(/^v/, "");

				if (!builds[version]) {
					builds[version] = [];
				}

				builds[version].push({
					backend,
					os,
					arch,
					downloadUrl: asset.browser_download_url,
				});
			}
		}
	}

	return builds;
}
