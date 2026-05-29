function makeTokens<const T extends Record<string, string>>(obj: T) {
	return Object.fromEntries(Object.keys(obj).map((k) => [k, `{{${k}}}`])) as {
		readonly [K in keyof T]: `{{${K & string}}}`;
	};
}

// Weird object of empty strings just to get easy to use object with jsdoc.
/**
 * Tokens used for string replacement.
 * Rai Pal replaces these tokens with values depending on current game, mod, system, etc.
 */
export const token = makeTokens(
	{
		/** Path to the folder where Rai Pal stores downloaded (but not installed) mods */
		LocalModsPath: "",

		/** Path to the folder where mods are installed for the current game. */
		GameInstalledModsPath: "",

		/** The folder containing the game executable. */
		GameExecutableFolderPath: "",

		/** The full path to the game executable. */
		GameExecutablePath: "",

		/** The name of the game executable, with the extension. (e.g., MyGame.exe) */
		GameExecutableName: "",

		/** The name of the game executable, WITHOUT the extension. (e.g., MyGame) */
		GameExecutableNameWithoutExtension: "",

		/** Entire json of the game as provided by Rai Pal */
		GameJson: "",

		/** Command that starts the game via its provider (like steam:// etc) */
		GameStartCommand: "",

		/** Arguments that get passed to the provider command that starts the game */
		GameStartCommandArgs: "",

		/**
		 * On Windows, this would be %APPDATA% (e.g., C:\Users\Username\AppData\Roaming).
		 * On Linux, this would be $XDG_CONFIG_HOME (e.g., /home/username/.config).
		 * For Windows games running on Linux via Wine, that would be the regular Windows Appdata folder but inside the prefix.
		 */
		RoamingAppData: "",

		/**
		 * It might be necessary to prepend this to some of the other path tokens, depending on which context they will be used in.
		 * Meaning, if the string will be read by a Windows process, it likely needs this prefix.
		 * For Windows games running via Wine on Linux, this would be the virtual drive mapping that points to the Linux root ('Z:', which points to '/').
		 * In any other scenario, this will be an empty string.
		 */
		MaybeWineRoot: "",
	} as const,
);
