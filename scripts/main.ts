import { join } from "std/path";
import { fetchPcGamingWikiGames } from "./pc-gaming-wiki.ts";
import { fetchSteamGames } from "./steam.ts";
import { fetchEAGamePassGames, fetchPCGamePassGames } from "./xbox-gamepass.ts";

// If any backwards-incompatible changes are made to the database, increment this number.
// This will be used as the folder name where the database files are stored,
// which means the database URLs also change.
const databaseVersion = 0;

// These are all the engines that exist in the universe.
export const engineNames = ["GameMaker", "Unity", "Godot", "Unreal"] as const;

export type Provider = "Steam" | "Gog" | "Epic";
export type EngineBrand = "GameMaker" | "Unity" | "Godot" | "Unreal";
export type Engine = { brand: EngineBrand; version?: string };
export type ProviderIdMap = Partial<Record<Provider, string[]>>;

export type Game = {
  title?: string;
  providerIds?: ProviderIdMap;
  engines: Engine[];
};

async function main() {
  const outputPath = join("..", "game-db", `${databaseVersion}`, "games.json");
  const games = await Promise.allSettled([
    fetchPcGamingWikiGames(),
    fetchSteamGames(),
    fetchPCGamePassGames(),
    fetchEAGamePassGames(),
  ]);

  await Deno.writeTextFile(outputPath, JSON.stringify(games));
}

main().catch(console.error);
