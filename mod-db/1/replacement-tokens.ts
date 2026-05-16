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

	/** The folder containing the game executable. */
	GameExecutableFolderPath: "",

	/** The full path to the game executable. */
	GameExecutablePath: "",

	/** The name of the game executable, without the extension. */
	GameExecutableName: "",

	/** The extension of the game executable (e.g., .exe). */
	GameExecutableExtension: "",

	/** Unique ID of the mod being acted upon. */
	ModId: "",
} as const);
