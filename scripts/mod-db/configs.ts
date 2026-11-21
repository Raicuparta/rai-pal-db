import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { GAME_DATABASE_VERSION } from "../common/versions.ts";
import type { IdProvider } from "../common/game-provider.ts";
import type { GameIds, ModBase } from "./mod.ts";
import { token } from "./replacement-tokens.ts";
import { tags, type TagId } from "./tags.ts";

const CONFIG_DATABASE_VERSION = 0;
const CONFIG_DATABASE_BASE_URL = `https://dev.rai-pal.pages.dev/config-db/${CONFIG_DATABASE_VERSION}`;

interface ConfigDbEntry {
	modId: string;
	file: string;
	version: number;
}

interface ConfigDbFile {
	configs: ConfigDbEntry[];
}

interface GameDbEntry {
	title?: string;
	ids: GameIds;
}

interface ConfigFolderAlias {
	steamId: string;
	title?: string;
}

const configFolderAliases: Record<string, ConfigFolderAlias> = {
	"abzugame-win64-shipping": { steamId: "384190" },
	dew: { steamId: "241320" },
	disco: { steamId: "632470" },
	id2: { steamId: "395620" },
	ksp_x64: { steamId: "220200" },
	"lake haven - chrysalis": {
		steamId: "1696960",
		title: "Lake Haven - Chrysalis",
	},
	untitled: { steamId: "837470" },
	ynglet: { steamId: "1015920", title: "Ynglet" },
	yookalaylee64: { steamId: "360830" },
	zerograve: { steamId: "1218580", title: "Zerograve" },
};

function normalizeId(value: string): string {
	return value.replace(/\W+/g, "").toLowerCase();
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function addId(ids: GameIds, provider: IdProvider, id: string) {
	const values = (ids[provider] ??= []);

	if (!values.includes(id)) {
		values.push(id);
	}
}

function addIds(target: GameIds, source: GameIds) {
	for (const [provider, values] of Object.entries(source) as [
		IdProvider,
		string[],
	][]) {
		for (const id of values) {
			addId(target, provider, id);
		}
	}
}

function getConfigTag(gameMod: ModBase): TagId {
	for (const modTag of gameMod.tags ?? []) {
		const configTag = `${modTag}-config`;

		if (configTag in tags) {
			return configTag as TagId;
		}
	}

	throw new Error(
		`Mod \`${gameMod.id}\` has a config but no matching config tag.`,
	);
}

function buildGameIndexes(games: GameDbEntry[]) {
	const byNormalizedId = new Map<string, GameDbEntry[]>();
	const bySteamId = new Map<string, GameDbEntry[]>();

	for (const game of games) {
		for (const values of Object.values(game.ids)) {
			for (const id of values ?? []) {
				const normalized = normalizeId(id);
				const matches = byNormalizedId.get(normalized) ?? [];
				matches.push(game);
				byNormalizedId.set(normalized, matches);
			}
		}

		for (const steamId of game.ids.Steam ?? []) {
			const matches = bySteamId.get(steamId) ?? [];
			matches.push(game);
			bySteamId.set(steamId, matches);
		}
	}

	return { byNormalizedId, bySteamId };
}

function getGameIdsForFolder(
	folder: string,
	indexes: ReturnType<typeof buildGameIndexes>,
): { gameIds: GameIds; gameTitle: string } {
	const normalizedFolder = normalizeId(folder);
	const alias = configFolderAliases[folder];
	const matches = [
		...(indexes.byNormalizedId.get(normalizedFolder) ?? []),
		...(alias ? (indexes.bySteamId.get(alias.steamId) ?? []) : []),
	];
	const uniqueMatches = [...new Set(matches)];
	const gameIds: GameIds = {};

	for (const game of uniqueMatches) {
		addIds(gameIds, game.ids);
	}

	addId(gameIds, "NormalizedTitle", normalizedFolder);

	if (alias) {
		addId(gameIds, "Steam", alias.steamId);
	}

	const gameTitle =
		uniqueMatches.find((game) => game.title)?.title ?? alias?.title ?? folder;

	return { gameIds, gameTitle };
}

export async function getConfigMods(mods: ModBase[]): Promise<ModBase[]> {
	const configFolder = join("..", "config-db", String(CONFIG_DATABASE_VERSION));
	const gamesPath = join(
		"..",
		"game-db",
		String(GAME_DATABASE_VERSION),
		"games.json",
	);

	const [gamesJson, folderEntries] = await Promise.all([
		readFile(gamesPath, "utf8"),
		readdir(configFolder, { withFileTypes: true }),
	]);

	const games = JSON.parse(gamesJson) as GameDbEntry[];
	const gameIndexes = buildGameIndexes(games);
	const modsById = new Map(mods.map((mod) => [mod.id, mod]));
	const folders = folderEntries
		.filter((entry) => entry.isDirectory() && entry.name !== "schema")
		.map((entry) => entry.name)
		.sort();

	const pending = await Promise.all(
		folders.map(async (folder) => {
			const configFile = JSON.parse(
				await readFile(join(configFolder, folder, "configs.json"), "utf8"),
			) as ConfigDbFile;

			return Promise.all(
				configFile.configs.map(async (config) => {
					const gameMod = modsById.get(config.modId);

					if (!gameMod) {
						throw new Error(
							`Config in \`${folder}\` references unknown mod \`${config.modId}\`.`,
						);
					}

					const configTarget = gameMod.paths?.find(
						(path) => path.id === "config",
					);

					if (!configTarget) {
						throw new Error(
							`Config in \`${folder}\` references mod \`${config.modId}\`, which has no \`config\` path.`,
						);
					}

					const configTag = getConfigTag(gameMod);
					const content = await readFile(
						join(configFolder, folder, "configs", config.file),
					);
					const contentHash = createHash("sha256")
						.update(content)
						.digest("hex")
						.slice(0, 12);

					return {
						folder,
						config,
						gameMod,
						configTag,
						configTarget,
						contentHash,
					};
				}),
			);
		}),
	);

	const entries = pending.flat();
	const tagCounts = new Map<string, number>();

	for (const entry of entries) {
		const key = `${entry.folder}:${entry.configTag}`;
		tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
	}

	const seenCounts = new Map<string, number>();

	return entries.map((entry) => {
		const { folder, config, gameMod, configTag, configTarget, contentHash } =
			entry;
		const { gameIds, gameTitle } = getGameIdsForFolder(folder, gameIndexes);
		const tagBase = configTag.replace(/-config$/, "");
		const countKey = `${folder}:${configTag}`;
		const seen = (seenCounts.get(countKey) ?? 0) + 1;
		seenCounts.set(countKey, seen);
		const suffix = (tagCounts.get(countKey) ?? 0) > 1 ? `-${seen}` : "";
		const id = `config-${slugify(folder)}-${tagBase}${suffix}`;
		const configUrl = `${CONFIG_DATABASE_BASE_URL}/${encodeURIComponent(
			folder,
		)}/configs/${encodeURIComponent(config.file)}?v=${config.version}-${contentHash}`;
		const install =
			configTarget.type === "Folder"
				? {
						manifestPath: `${token.GameInstalledModsPath}/manifests/${id}.json`,
						extract: [
							{
								source: ".",
								destination: configTarget.path,
							},
						],
					}
				: {
						manifestPath: `${token.GameInstalledModsPath}/manifests/${id}.json`,
						copy: [{ destination: configTarget.path }],
					};

		return {
			id,
			gameIds,
			tags: [configTag],
			hideFromGameModsList: true,
			title: `${gameMod.title} Config for ${gameTitle}`,
			author: gameMod.author,
			website: gameMod.website,
			description: `Recommended ${gameMod.title} config for ${gameTitle}.`,
			download: {
				id: String(config.version),
				url: configUrl,
			},
			install,
			paths: [
				{
					id: "config",
					title: configTarget.title,
					type: configTarget.type,
					path: configTarget.path,
				},
			],
		} satisfies ModBase;
	});
}
