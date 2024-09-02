import { join } from "jsr:@std/path";
import { deepMerge } from "jsr:@std/collections";
import { fetchPcGamingWikiGames } from "./pc-gaming-wiki.ts";
import { fetchSteamGames } from "./steam.ts";
import { fetchEAGamePassGames, fetchPCGamePassGames } from "./xbox-gamepass.ts";
import { fetchEpicGamesStoreGames } from "./epic-games-store.ts";
import { getNormalizedTitles } from "./normalized-title.ts";

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

type GamesByIds = Partial<Record<IdKind, Record<string, Game>>>;

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

        const existingGame = gamesByIds[idKind][id] ?? {};

        gamesByIds[idKind][id] = deepMerge(existingGame, game);
      }
    }
  }

  await Deno.writeTextFile(outputPath, JSON.stringify(games));
}

main().catch(console.error);
