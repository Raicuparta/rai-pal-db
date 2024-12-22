import { Game, IdMap, ProviderId, Engine, GameSubscription } from "./main.ts";
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

function mergeIds(idsA: IdMap, idsB: IdMap): IdMap {
  const mergedIds: IdMap = {};
  for (const idKind of new Set([
    ...Object.keys(idsA),
    ...Object.keys(idsB),
  ] as ProviderId[])) {
    const idSetA = idsA[idKind] || new Set();
    const idSetB = idsB[idKind] || new Set();
    mergedIds[idKind] = new Set([...idSetA, ...idSetB]);
  }
  return mergedIds;
}

function mergeAllEngines(
  enginesA: Engine[] | undefined,
  enginesB: Engine[] | undefined
): Engine[] | undefined {
  const mergedEngines: Engine[] = [];
  const allEngines = [...(enginesA ?? []), ...(enginesB ?? [])];
  for (const engine of allEngines) {
    if (
      mergedEngines.some(
        (mergedEngine) =>
          mergedEngine.brand === engine.brand &&
          mergedEngine.version === engine.version
      )
    ) {
      continue;
    }

    if (
      !engine.version &&
      mergedEngines.some((mergedEngine) => mergedEngine.brand === engine.brand)
    ) {
      continue;
    }

    const engineWithSameBrand = mergedEngines.find(
      (mergedEngine) =>
        mergedEngine.brand === engine.brand && !mergedEngine.version
    );
    if (engineWithSameBrand) {
      engineWithSameBrand.version = engine.version;
      continue;
    }

    mergedEngines.push(engine);
  }

  if (mergedEngines.length === 0) return undefined;

  return mergedEngines;
}

export function mergeSubscriptions(
  subscriptionsA?: GameSubscription[],
  subscriptionsB?: GameSubscription[]
): GameSubscription[] | undefined {
  if (!subscriptionsA) return subscriptionsB;
  if (!subscriptionsB) return subscriptionsA;

  return Array.from(new Set([...subscriptionsA, ...subscriptionsB]));
}

export function mergeGames(games: Game[]): Game[] {
  games.forEach(addNormalizedTitles);

  let biggestMerge = 0;
  return findConnectedComponents(games).map((connectedGames) => {
    let mergedGame: Game = connectedGames[0];
    for (const game of connectedGames.slice(1)) {
      mergedGame = {
        ids: mergeIds(mergedGame.ids, game.ids),
        title: mergedGame.title || game.title,
        engines: mergeAllEngines(mergedGame.engines, game.engines),
        subscriptions: mergeSubscriptions(
          mergedGame.subscriptions,
          game.subscriptions
        ),
      };
    }
    if (connectedGames.length > biggestMerge) {
      biggestMerge = connectedGames.length;
      console.log(`Biggest merge: ${biggestMerge}, ${mergedGame.title}`);
    }
    return mergedGame;
  });
}
