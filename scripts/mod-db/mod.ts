export interface Mod {
	/**
	 * Unique identifier for this mod. Must be globally unique within all mods from all loaders.
	 */
	id: string;
	/**
	 * If true, users should be warned about it and invited to uninstall this mod, and directed to install the appropriate replacement.
	 */
	deprecated?: boolean;
	/**
	 * Increment this number to force clients to redownload this mod. Useful when a mod needs to be redownloaded without a new version being released.
	 */
	redownloadId?: number;
	/**
	 * Game engine that this mod supports.
	 */
	engine?: "Unity" | "Unreal" | "Godot";
	/**
	 * Whether this mod is only compatible with 64-bit or 32-bit (x86) games. If not set, assumed to be compatible with both.
	 */
	architecture?: "X64" | "X86";
	/**
	 * Only relevant if engine=Unity. Scripting backend used by the game.
	 */
	unityBackend?: "Il2Cpp" | "Mono";
	/**
	 * Mod's display name.
	 */
	title: string;
	/**
	 * Mod author.
	 */
	author: string;
	/**
	 * URL of a repository with the mod's source code.
	 */
	sourceCode: string;
	/**
	 * Short description that explains what the mod does.
	 */
	description: string;
	latestVersion?: Release;
	actions?: ModAction;
	engineVersionRange?: {
		minimum?: EngineVersion;
		maximum?: EngineVersion;
	};
	/**
	 * Mods that need to be installed before this one.
	 */
	dependencies?: {
		/**
		 * ID of the mod to depend on.
		 */
		modId?: string;
	}[];
}

export interface Release {
	/**
	 * String that uniquely identifies this release when compared with other releases of the same mod.
	 */
	id: string;
	/**
	 * Direct download url for the release zip.
	 */
	url: string;
	/**
	 * Optional, path of the root folder within the zip.
	 */
	root?: string;
}

export interface ModAction {
	install?: {
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
	runForGame?: {
		/**
		 * Path relative to the mod folder, pointing to the executable/script to run
		 */
		path?: string;
		/**
		 * List of arguments to pass to the command. Tokens in the format of {{TOKEN}} get replaced with values from the game: {{ExecutableName}}, {{GameJson}}, {{ExecutablePath}}, {{StartCommand}}, {{StartCommandArgs}}, {{RunnablePath}}, {{LocalModsPath}}, {{RoamingAppData}}, {{ExecutableNameWithoutExtension}}
		 */
		args?: string[];
		/**
		 * Environment variables to set when running the command via Wine. Tokens in the format of {{TOKEN}} get replaced with values from the game: {{ExecutableName}}, {{GameJson}}, {{ExecutablePath}}, {{StartCommand}}, {{StartCommandArgs}}, {{RunnablePath}}, {{LocalModsPath}}, {{RoamingAppData}}, {{ExecutableNameWithoutExtension}}
		 */
		wineEnvironment?: {
			[k: string]: string;
		};
	};
	/**
	 * Information used to find local mod configs, and also for downloading configs from the database.
	 */
	getConfig?: {
		/**
		 * Path in the user's PC where the config is installed to. This path can be relative to something, depending on the mod loader.
		 */
		destinationPath: string;
		/**
		 * If file, the downloaded config will be placed directly in destinationPath. If folder, the downloaded file must be a zip, and gets extracted to the destination path, which must be a folder.
		 */
		destinationType: "File" | "Folder";
		/**
		 * If set, overrides the mod ID used for finding config files. Useful when multiple mods use the same configs.
		 */
		modIdOverride?: string;
	};
	/**
	 * How to get the folder that opens when pressing the 'Open Mod Folder' button.
	 */
	getModFolderForGame?: {
		/**
		 * Supports replacement tokens. This is the folder path that opens.
		 */
		path?: string;
	};
}

export interface EngineVersion {
	major: number;
	minor?: number;
	patch?: number;
}
