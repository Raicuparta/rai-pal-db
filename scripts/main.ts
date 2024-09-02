import { join } from "jsr:@std/path";
import { deepMerge } from "jsr:@std/collections";
import { fetchPcGamingWikiGames } from "./pc-gaming-wiki.ts";
import { fetchSteamGames } from "./steam.ts";
import { fetchEAGamePassGames, fetchPCGamePassGames } from "./xbox-gamepass.ts";
import { fetchEpicGamesStoreGames } from "./epic-games-store.ts";
import { deduplicateTitles, getNormalizedTitles } from "./normalized-title.ts";
import { fetchUbisoftGames } from "./ubisoft-connect.ts";

// If any backwards-incompatible changes are made to the database, increment this number.
// This will be used as the folder name where the database files are stored,
// which means the database URLs also change.
const databaseVersion = 0;

// These are all the engines that exist in the universe.
export const engineNames = ["GameMaker", "Unity", "Godot", "Unreal"] as const;

export type Provider = "Steam" | "Gog" | "Epic" | "Xbox" | "Ubisoft" | "Ea";
export type IdKind = Provider | "NormalizedTitle";
export type EngineBrand = "GameMaker" | "Unity" | "Godot" | "Unreal";
export type Engine = { brand: EngineBrand; version?: string };
export type IdMap = Partial<Record<IdKind, string[]>>;
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

type GamesByIds = Partial<Record<IdKind, Record<string, GameWithUniqueIndex>>>;

async function main() {
  const outputPath = join("..", "game-db", `${databaseVersion}`, "games.json");
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

  const gamesByIds: GamesByIds = {};
  const uniqueGames: Game[] = [];

  for (const game of games) {
    if (!game.title) continue;

    const normalizedTitles = getNormalizedTitles(game.title);
    if (normalizedTitles.length == 0) continue;

    game.ids = {
      ...game.ids,
      NormalizedTitle: normalizedTitles,
    };

    for (const [idKind, ids] of Object.entries(game.ids) as [
      IdKind,
      string[]
    ][]) {
      for (const id of ids) {
        if (!gamesByIds[idKind]) {
          gamesByIds[idKind] = {};
        }

        const existingGame: GameWithUniqueIndex | undefined =
          gamesByIds[idKind][id];
        const uniqueIndex = existingGame?.uniqueIndex ?? uniqueGames.length;

        const mergedGame: GameWithUniqueIndex = {
          uniqueIndex,
          ...deepMerge(existingGame ?? {}, game),
        };

        const normalizedTitles = mergedGame.ids["NormalizedTitle"];
        if (normalizedTitles) {
          mergedGame.ids["NormalizedTitle"] =
            deduplicateTitles(normalizedTitles);
        }

        gamesByIds[idKind][id] = mergedGame;
        uniqueGames[uniqueIndex] = mergedGame;
      }
    }
  }

  await Deno.writeTextFile(outputPath, JSON.stringify(uniqueGames, null, 2));
}

main().catch(console.error);
