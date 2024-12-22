import { join } from "jsr:@std/path";
import { fetchPcGamingWikiGames } from "./pc-gaming-wiki.ts";
import { fetchSteamGames } from "./steam.ts";
import { fetchEAGamePassGames, fetchPCGamePassGames } from "./xbox-gamepass.ts";
import { fetchEpicGamesStoreGames } from "./epic-games-store.ts";
import { fetchUbisoftGames } from "./ubisoft-connect.ts";
import { jsonReplacer } from "./helpers.ts";
import { mergeGames } from "./merge-games.ts";

// If any backwards-incompatible changes are made to the database, increment this number.
// This will be used as the folder name where the database files are stored,
// which means the database URLs also change.
const databaseVersion = 1;

// These are all the engines that exist in the universe.
export const engineNames = ["GameMaker", "Unity", "Godot", "Unreal"] as const;

// These IDs need to match the Provider IDs in Rai Pal
export type ProviderId =
  | "Ea"
  | "Epic"
  | "Gog"
  | "Itch"
  | "Manual"
  | "Steam"
  | "Ubisoft"
  | "Xbox";

export type EngineBrand = "GameMaker" | "Unity" | "Godot" | "Unreal";
export type Engine = { brand: EngineBrand; version?: string };
export type IdMap = Partial<Record<ProviderId, Set<string>>>;
export type GameSubscription =
  | "XboxGamePass"
  | "EaPlay"
  | "UbisoftClassics"
  | "UbisoftPremium";

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
  const folder = join("..", "game-db", `${databaseVersion}`);
  await Deno.mkdir(folder, { recursive: true });

  const outputPath = join(folder, "games.json");
  const games = (
    await Promise.allSettled([
      fetchPcGamingWikiGames(),
      fetchSteamGames(),
      fetchPCGamePassGames(),
      fetchEAGamePassGames(),
      fetchPCGamePassGames(),
      fetchEpicGamesStoreGames(),
      fetchUbisoftGames(),
    ])
  )
    .map((result) => {
      if (result.status === "fulfilled") {
        return result.value;
      }

      console.error(`Failed to fetch games: ${result.reason}`);
      return [];
    })
    .flat();

  const mergedGames = mergeGames(games);

  const gamesWithEngines = mergedGames.filter(
    (game) => game.engines && game.engines.length > 0
  );

  await Deno.writeTextFile(
    outputPath,
    JSON.stringify(gamesWithEngines, jsonReplacer, pretty ? 2 : undefined)
  );
}

main(false).catch(console.error);
