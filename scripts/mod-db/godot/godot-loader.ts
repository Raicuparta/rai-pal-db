import { ModBase } from "../mod.ts";
import { token } from "../replacement-tokens.ts";

// The loader zips (each containing only `script-loader.gd`) are published to
// the rai-pal-db repo releases, like the other mods in this database.
const downloadBase =
	"https://github.com/Raicuparta/rai-pal-db/releases/download/godot-v0.1.0";

const sourceCode = "https://github.com/Raicuparta/everyone";

const loaderGd4 = `extends Node

func _ready() -> void:
	var base_dir = get_script().resource_path.get_base_dir()
	var mods_path = base_dir.path_join("mods")

	var gd_files = _get_mod_scripts(mods_path)
	var mod_counter = 1

	for file_path in gd_files:
		var script_res = load(file_path)
		if script_res:
			var instance = script_res.new()
			if instance is Node:
				# Name them sequentially: RaiPalMod_1, RaiPalMod_2, etc.
				instance.name = "RaiPalMod_" + str(mod_counter)
				mod_counter += 1

				get_tree().root.call_deferred("add_child", instance)
				print("Loaded Mod: ", instance.name, " from ", file_path)

func _get_mod_scripts(mods_path: String) -> Array[String]:
	var result: Array[String] = []

	if not DirAccess.dir_exists_absolute(mods_path):
		print("No 'mods' directory found at: ", mods_path)
		return result

	var mod_folders = DirAccess.get_directories_at(mods_path)

	for mod_name in mod_folders:
		var mod_path = mods_path.path_join(mod_name)
		var files = DirAccess.get_files_at(mod_path)

		for file_name in files:
			if file_name.ends_with(".gd"):
				result.append(mod_path.path_join(file_name))

	return result`;

const loaderGd3 = `extends Node

func _ready() -> void:
	var base_dir = get_script().resource_path.get_base_dir()
	var mods_path = base_dir.plus_file("mods")

	var gd_files = _get_mod_scripts(mods_path)
	var mod_counter = 1

	for file_path in gd_files:
		var script_res = load(file_path)
		if script_res:
			var instance = script_res.new()
			if instance is Node:
				# Name them sequentially: RaiPalMod_1, RaiPalMod_2, etc.
				instance.name = "RaiPalMod_" + str(mod_counter)
				mod_counter += 1

				get_tree().root.call_deferred("add_child", instance)
				print("Loaded Mod: ", instance.name, " from ", file_path)

func _get_mod_scripts(mods_path: String) -> Array:
	var result = []
	var mods_dir = Directory.new()

	if mods_dir.open(mods_path) == OK:
		mods_dir.list_dir_begin(true, true)
		var mod_folder_name = mods_dir.get_next()

		while mod_folder_name != "":
			if mods_dir.current_is_dir():
				var mod_path = mods_path.plus_file(mod_folder_name)
				var inner_dir = Directory.new()

				if inner_dir.open(mod_path) == OK:
					inner_dir.list_dir_begin(true, true)
					var file_name = inner_dir.get_next()

					while file_name != "":
						if not inner_dir.current_is_dir() and file_name.ends_with(".gd"):
							result.append(mod_path.plus_file(file_name))
						file_name = inner_dir.get_next()

					inner_dir.list_dir_end()

			mod_folder_name = mods_dir.get_next()

		mods_dir.list_dir_end()
	else:
		print("No 'mods' directory found at: ", mods_path)

	return result`;

function godotLoader(major: 3 | 4): ModBase {
	const id = `godot-loader-${major}`;
	return {
		id,
		family: "godot",
		engine: "Godot",
		engineVersionRange: {
			minimum: { major },
			...(major === 3 ? { maximum: { major } } : {}),
		},
		title: `Godot ${major} Mod Loader`,
		author: "Raicuparta",
		sourceCode,
		description: `Mod loader for Godot ${major} games.`,
		install: {
			manifestPath: `${token.GameInstalledModsPath}/manifests/${id}.json`,
			write: [
				{
					content: major === 3 ? loaderGd3 : loaderGd4,
					destination: `${token.GameInstalledModsPath}/script-loader.gd`,
				},
				{
					content: `[autoload]
ModLoaderStore="${token.MaybeWineRoot}${token.GameInstalledModsPath}/script-loader.gd"
`,
					destination: `${token.GameExecutableFolderPath}/override.cfg`,
				},
			],
			mainInstalledFolderPath: token.GameInstalledModsPath,
		},
	};
}

// deno-lint-ignore require-await
export async function getGodotLoaderMods() {
	return [godotLoader(3), godotLoader(4)];
}
