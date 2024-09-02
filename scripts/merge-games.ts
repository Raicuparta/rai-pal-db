import { deepMerge } from "@std/collections";
import { Game } from "./main.ts";
import { addNormalizedTitles } from "./normalized-title.ts";

function findConnectedComponents(games: Game[]): Game[][] {
  const idToGameMap = new Map<string, Game>();
  const visited = new Set<Game>();
  const components: Game[][] = [];

  // Helper function to perform DFS and find all connected nodes
  function dfs(game: Game, component: Game[]): void {
    visited.add(game);
    component.push(game);

    for (const idSet of Object.values(game.ids)) {
      if (idSet) {
        for (const id of idSet) {
          const connectedGame = idToGameMap.get(id);
          if (connectedGame && !visited.has(connectedGame)) {
            dfs(connectedGame, component);
          }
        }
      }
    }
  }

  // Populate idToGameMap to quickly find connections
  games.forEach((game) => {
    for (const idSet of Object.values(game.ids)) {
      if (idSet) {
        for (const id of idSet) {
          idToGameMap.set(id, game);
        }
      }
    }
  });

  // Find all connected components
  games.forEach((game) => {
    if (!visited.has(game)) {
      const component: Game[] = [];
      dfs(game, component);
      components.push(component);
    }
  });

  return components;
}

export function mergeGames(games: Game[]): Game[] {
  games.forEach(addNormalizedTitles);

  return findConnectedComponents(games).map((connectedGames) => {
    let mergedGame: Game = connectedGames[0];
    for (const game of connectedGames.slice(1)) {
      mergedGame = deepMerge(mergedGame, game, {
        arrays: "merge",
        maps: "merge",
        sets: "merge",
      });
    }
    return mergedGame;
  });
}
