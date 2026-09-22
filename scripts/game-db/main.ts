import { join } from "jsr:@std/path";
import { fetchPcGamingWikiGames } from "./pc-gaming-wiki.ts";
import { fetchSteamGames } from "./steam.ts";
import { fetchEAGamePassGames, fetchPCGamePassGames } from "./xbox-gamepass.ts";
import { fetchEpicGamesStoreGames } from "./epic-games-store.ts";
import { fetchUbisoftGames } from "./ubisoft-connect.ts";
import { jsonReplacer } from "./helpers.ts";
import { mergeGames } from "./merge-games.ts";
import { createDatabase } from "./sqlite.ts";
import { GAME_DATABASE_VERSION } from "../common/versions.ts";

// These are all the engines that exist in the universe.
export const engineBrands = ["GameMaker", "Unity", "Godot", "Unreal"] as const;

export const providerIds = [
	"Ea",
	"Epic",
	"Gog",
	"Itch",
	"Manual",
	"Steam",
	"Ubisoft",
	"Xbox",
] as const;

export const gameSubscriptions = [
	"XboxGamePass",
	"EaPlay",
	"UbisoftClassics",
	"UbisoftPremium",
] as const;

export type ProviderId = (typeof providerIds)[number];
export type EngineBrand = (typeof engineBrands)[number];
export type GameSubscription = (typeof gameSubscriptions)[number];

export type Engine = { brand: EngineBrand; version?: string };
export type IdMap = Partial<Record<ProviderId, Set<string>>>;

export type Game = {
	title?: string;
	ids: IdMap;
	engines?: Engine[];
	subscriptions?: GameSubscription[];
};

interface GameWithUniqueIndex extends Game {
	uniqueIndex: number;
}

type GamesByIds = Partial<
	Record<ProviderId, Record<string, GameWithUniqueIndex>>
>;

// Each game source we fetch from. These are named so we can log exactly which
// source succeeded/failed, instead of silently producing a half-empty database.
const gameSources = [
	{ name: "PCGamingWiki", fetch: fetchPcGamingWikiGames },
	{ name: "Steam", fetch: fetchSteamGames },
	{ name: "PC Game Pass", fetch: fetchPCGamePassGames },
	{ name: "EA Game Pass", fetch: fetchEAGamePassGames },
	{ name: "Epic Games Store", fetch: fetchEpicGamesStoreGames },
	{ name: "Ubisoft Connect", fetch: fetchUbisoftGames },
] as const;

// The DB is not much use if a whole source disappears, and a run that loses most
// of its games is almost certainly a bug/outage rather than a real shrink.
// Refuse to overwrite the existing database when that happens.
const minimumRetainedGameRatio = 0.5;

// Set ALLOW_PARTIAL_GAME_DB=1 to still write the database when a source fails.
// Not recommended, since it publishes a database missing that source's data.
const allowPartialDatabase = Deno.env.get("ALLOW_PARTIAL_GAME_DB") === "1";

function getExistingGameCount(path: string): number | undefined {
	try {
		const existing = JSON.parse(Deno.readTextFileSync(path)) as unknown[];
		return existing.length;
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) return undefined;
		console.warn(`Could not read existing database at ${path}: ${error}`);
		return undefined;
	}
}

async function main(pretty: boolean) {
	const folder = join("..", "game-db", `${GAME_DATABASE_VERSION}`);
	await Deno.mkdir(folder, { recursive: true });

	const outputPath = join(folder, "games.json");

	const results = await Promise.allSettled(
		gameSources.map((source) => source.fetch()),
	);

	const failedSources: string[] = [];

	const games = results
		.flatMap((result, index) => {
			const { name } = gameSources[index];
			if (result.status === "fulfilled") {
				console.log(`Fetched ${result.value.length} games from ${name}.`);
				if (result.value.length === 0) {
					failedSources.push(name);
					console.warn(
						`Source ${name} returned 0 games. If this is unexpected, the database will be missing data for it.`,
					);
				}
				return result.value;
			}

			failedSources.push(name);
			const reason = result.reason as Error | undefined;
			console.error(
				`Failed to fetch games from ${name}: ${reason} ${reason?.stack ?? ""}`,
			);
			return [];
		});

	if (games.length === 0) {
		throw new Error("Every game source failed or returned nothing. Aborting.");
	}

	if (failedSources.length > 0 && !allowPartialDatabase) {
		throw new Error(
			`These game sources failed or returned no games: ${
				failedSources.join(", ")
			}. ` +
				`Refusing to overwrite the database with partial data, because that silently drops ` +
				`everything those sources contribute (e.g. titles and non-Steam store entries). ` +
				`Fix the sources above and run again, or set ALLOW_PARTIAL_GAME_DB=1 to write anyway.`,
		);
	}

	const mergedGames = mergeGames(games);

	const gamesWithEngines = mergedGames.filter(
		(game) => game.engines && game.engines.length > 0,
	);

	console.log(
		`Merged ${games.length} fetched games into ${mergedGames.length} games, ${gamesWithEngines.length} of which have engine data (and will be saved).`,
	);

	const existingGameCount = getExistingGameCount(outputPath);
	if (existingGameCount !== undefined) {
		const ratio = gamesWithEngines.length / existingGameCount;
		console.log(
			`Existing database has ${existingGameCount} games; new database would have ${gamesWithEngines.length} (${
				(ratio * 100).toFixed(1)
			}%).`,
		);
		if (ratio < minimumRetainedGameRatio) {
			throw new Error(
				`Refusing to overwrite ${outputPath}: the new database would only keep ${
					(ratio * 100).toFixed(1)
				}% of the existing games. ` +
					`This usually means one or more sources above failed or returned incomplete data. ` +
					`Fix the source, then run again. (To force the update anyway, delete ${outputPath} or lower minimumRetainedGameRatio.)`,
			);
		}
	}

	createDatabase(join(folder, "games.db"), gamesWithEngines);

	await Deno.writeTextFile(
		outputPath,
		JSON.stringify(gamesWithEngines, jsonReplacer, pretty ? 2 : undefined),
	);
}

main(false).catch((error) => {
	console.error(error);
	Deno.exit(1);
});
