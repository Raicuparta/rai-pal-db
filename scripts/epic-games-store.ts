import { Game } from "./main.ts";

// Someone was nice enough to do all the work for mapping Epic Games Store item IDs to game titles.
const epicGamesStoreItemsUrl =
  "https://raw.githubusercontent.com/nachoaldamav/items-tracker/main/database/titles.json";

type EpicGamesStoreItem = {
  id: string;
  title: string;
};

export async function fetchEpicGamesStoreGames(): Promise<Game[]> {
  const response = await fetch(epicGamesStoreItemsUrl);
  const items = (await response.json()) as EpicGamesStoreItem[];

  return items
    .filter(
      (item) =>
        !item.title.toLowerCase().endsWith("audience") &&
        !item.title.toLowerCase().includes("_")
    )
    .map(
      (item): Game => ({
        title: item.title,
        ids: {
          Epic: new Set([item.id]),
        },
      })
    );
}
