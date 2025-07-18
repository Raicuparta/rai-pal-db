import { join } from "jsr:@std/path";
import { fetchPcGamingWikiGames } from "./pc-gaming-wiki.ts";
import { fetchSteamGames } from "./steam.ts";
import { fetchEAGamePassGames, fetchPCGamePassGames } from "./xbox-gamepass.ts";
import { fetchEpicGamesStoreGames } from "./epic-games-store.ts";
import { fetchUbisoftGames } from "./ubisoft-connect.ts";
import { jsonReplacer } from "./helpers.ts";
import { mergeGames } from "./merge-games.ts";
import { createDatabase } from "./sqlite.ts";
import { DATABASE_VERSION } from "#common/version.ts";

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

async function main(pretty: boolean) {
	const folder = join("..", "game-db", `${DATABASE_VERSION}`);
	await Deno.mkdir(folder, { recursive: true });

	const outputPath = join(folder, "games.json");
	const games = (
		await Promise.allSettled([
			fetchPcGamingWikiGames(),
			fetchSteamGames(),
			fetchPCGamePassGames(),
			fetchEAGamePassGames(),
			fetchEpicGamesStoreGames(),
			fetchUbisoftGames(),
		])
	)
		.map((result) => {
			if (result.status === "fulfilled") {
				return result.value;
			}

			console.error(
				`Failed to fetch games: ${result.reason} ${result.reason.stack}`
			);
			return [];
		})
		.flat();

	const mergedGames = mergeGames(games);

	const gamesWithEngines = mergedGames.filter(
		(game) => game.engines && game.engines.length > 0
	);

	createDatabase(join(folder, "games.db"), gamesWithEngines);

	await Deno.writeTextFile(
		outputPath,
		JSON.stringify(gamesWithEngines, jsonReplacer, pretty ? 2 : undefined)
	);
}

main(false).catch(console.error);
