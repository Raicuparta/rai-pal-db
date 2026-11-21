import type { IdProvider } from "../common/game-provider.ts";
import type { TagId } from "./tags.ts";

export interface ModPath {
	/**
	 * Unique identifier for this path within the mod.
	 */
	id: string;

	/**
	 * Display name for this path.
	 */
	title: string;

	/**
	 * Supports replacement tokens. Path to a file or folder that Rai Pal can open.
	 */
	path: string;

	/**
	 * Whether the path points to a file or a folder.
	 */
	type: "File" | "Folder";
}

export interface ModBase {
	/**
	 * Unique identifier for this mod. Must be globally unique within all mods from all loaders.
	 */
	id: string;

	/**
	 * Non-unique tag IDs. Mods with the same tag provide the same uhh thing. Rai Pal uses this for filters; you filter by games compatible with at least one mod of a given tag.
	 */
	tags?: readonly TagId[];

	/**
	 * Game IDs that this mod is made for. If omitted, the mod is not specific to any game and can be compatible with many games.
	 * Use the same provider IDs and game IDs as the games database. Include every ID for the game, across all providers, and every duplicate ID within a provider.
	 */
	gameIds?: GameIds;

	/**
	 * If true, users should be warned about it and invited to uninstall this mod, and directed to install the appropriate replacement.
	 */
	deprecated?: boolean;

	/**
	 * Hide mod from the per-game mod list where users install mods.
	 * USeful for stuff that needs to be installed as dependencies but would otherwise clutter the UI.
	 */
	hideFromGameModsList?: boolean;

	/**
	 * Game engine that this mod supports.
	 */
	engine?: Engine;

	/**
	 * Whether this mod is only compatible with 64-bit or 32-bit (x86) games.
	 */
	architecture?: Architecture;

	/**
	 * Operating system the game needs to be built for, in order to be compatible with this mod.
	 * Windows game running on Windows, this would be "Windows".
	 * Windows game running on Linux via Wine, this would be "Windows".
	 * Linux game running on Linux, this would be "Linux".
	 */
	gameOs?: OperatingSystem;

	/**
	 * Operating system the mod manager (Rai Pal) needs to be running on, in order to be compatible with this mod.
	 * Windows game running on Windows, this would be "Windows".
	 * Windows game running on Linux via Wine, this would be "Linux".
	 * Linux game running on Linux, this would be "Linux".
	 */
	hostOs?: OperatingSystem;

	/**
	 * Only relevant if engine=Unity. Scripting backend used by the game.
	 */
	unityBackend?: UnityBackend;

	/**
	 * Mod's display name.
	 */
	title: string;

	/**
	 * Mod author.
	 */
	author: string;

	/**
	 * URL for the mod, can be source code or just some website.
	 */
	website: string;

	/**
	 * Short description that explains what the mod does.
	 */
	description: string;

	/**
	 * Latest downloadable version of the mod.
	 */
	download?: ModDownload;

	engineVersionRange?: {
		minimum?: EngineVersion;
		maximum?: EngineVersion;
	};

	/**
	 * Mods that need to be installed before this one. Every dependency here must be satisfied by a compatible mod, otherwise this mod is also considered incompatible.
	 */
	requiredDependencies?: ModDependency[];

	/**
	 * Mods that should get installed before this one, if they're compatible. If not, that's fine.
	 */
	optionalDependencies?: ModDependency[];

	install?: {
		/**
		 * Supports replacement tokens. Path to the json where this mod's manifest will be installed. Can be per-game or shared, depending on replacement tokens used.
		 */
		manifestPath: string;

		/**
		 * Files and folders to extract from the downloaded mod zip
		 */
		extract?: {
			/**
			 * Path of the source file or folder within the downloaded mod zip
			 */
			source: string;

			/**
			 * Supports replacement tokens. Destination path to extract this file or folder to. If source was a folder, this must be a folder, if file, file.
			 */
			destination: string;
		}[];

		/**
		 * Copies the downloaded file, without extracting it, to the destination paths.
		 * Use this for mods whose download is a single file instead of a zip.
		 */
		copy?: {
			/**
			 * Supports replacement tokens. Destination path to copy the downloaded file to.
			 */
			destination: string;
		}[];

		/**
		 * Text files to write when installing the mod.
		 */
		write?: {
			/**
			 * Supports replacement tokens. Plain text content to write to the file.
			 */
			content: string;

			/**
			 * Supports replacement tokens. Destination path to write this file to.
			 */
			destination: string;
		}[];

		/**
		 * Dll file names without extension, that will get the Wine DLL override flags set to "native,builtin".
		 */
		wineDllOverrides?: string[];
	};

	/**
	 * Command for running the mod executable for a specific game (meaning game stuff can be accessed in replacement tokens).
	 */
	runForGame?: ModRun;

	/**
	 * Command for running the mod executable by itself (meaning game-related replacement tokens can NOT be used).
	 */
	runStandalone?: ModRun;

	/**
	 * Environment variables to add when Rai Pal launches the game itself. Supports replacement tokens in values.
	 * Values may reference the current environment with `${VAR}`, e.g. `libdoorstop.so:${LD_PRELOAD}`.
	 */
	gameEnvironment?: {
		[k: string]: string;
	};

	/**
	 * Paths to files or folders that Rai Pal can open from this mod's actions menu.
	 */
	paths?: ModPath[];
}

export interface Mod extends ModBase {
	/**
	 * Hash of the mod manifest. If this changes then the manifest changed in some way and should be redownloaded.
	 */
	hash: string;
}

/**
 * Game IDs that a mod is made for, keyed by game provider ID.
 * Mirrors the `ids` format of a game in the games database.
 */
export type GameIds = Partial<Record<IdProvider, string[]>>;

/**
 * We can defined dependencies via unique mod IDs, or via the non-unique tag IDs
 */
type ModDependency =
	| {
			modId: string;
			tag?: never;
	  }
	| {
			tag: TagId;
			modId?: never;
	  };

export type UnityBackend = "Il2Cpp" | "Mono";

const ARCHITECTURES = ["X64", "X86"] as const;

export type Architecture = (typeof ARCHITECTURES)[number];

export function isArchitecture(value: string): value is Architecture {
	return ARCHITECTURES.includes(value as Architecture);
}

export type Engine = "Unity" | "Unreal" | "Godot";

export type OperatingSystem = "Windows" | "Linux";

export interface ModDownload {
	/**
	 * String that uniquely identifies this release when compared with other releases of the same mod.
	 */
	id: string;

	/**
	 * Direct download url for the release archive or file.
	 */
	url: string;

	/**
	 * ISO 8601 date when this specific downloadable release asset was published.
	 */
	releaseDate?: string;
}

export interface EngineVersion {
	major: number;
	minor?: number;
	patch?: number;
}

export type ModRun = {
	/**
	 * Path pointing to the executable/script to run. Supports replacement tokens.
	 */
	path?: string;

	/**
	 * List of arguments to pass to the command. Supports replacement tokens.
	 */
	args?: string[];

	/**
	 * Environment variables to set when running the command via Wine. Supports replacement tokens in values.
	 */
	wineEnvironment?: {
		[k: string]: string;
	};

	/**
	 * Operating system the mod itself is built for. So a .exe would be Windows.
	 * Unspecified means it somehow works for all.
	 */
	os?: OperatingSystem;
};
