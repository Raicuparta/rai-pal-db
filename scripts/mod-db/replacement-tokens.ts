function makeTokens<const T extends Record<string, string>>(obj: T) {
	return Object.fromEntries(Object.keys(obj).map((k) => [k, `{{${k}}}`])) as {
		readonly [K in keyof T]: `{{${K & string}}}`;
	};
}

// Weird object of empty strings just to get easy to use object with jsdoc.
/**
 * Tokens used for string replacement.
 * Rai Pal replaces these tokens with values depending on current game, mod, system, etc.
 * */
export const token = makeTokens({
	/** Path to the folder where mods are installed for the current game. */
	InstalledModsPath: "",

	/** Path to the folder where Rai Pal stores downloaded (but not installed) mods */
	LocalModsPath: "",

	/** The folder containing the game executable. */
	GameExecutableFolderPath: "",

	/** The full path to the game executable. */
	GameExecutablePath: "",

	/** The name of the game executable, with the extension. (e.g., MyGame.exe) */
	GameExecutableName: "",

	/** The name of the game executable, WITHOUT the extension. (e.g., MyGame) */
	GameExecutableNameWithoutExtension: "",

	/** Unique ID of the mod being acted upon. */
	ModId: "",

	/**
	 * On Windows, this would be %APPDATA% (e.g., C:\Users\Username\AppData\Roaming).
	 * On Linux, this would be $XDG_CONFIG_HOME (e.g., /home/username/.config)
	 */
	RoamingAppData: "",
} as const);
