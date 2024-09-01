import { EngineBrand, ProviderIdMap } from "./game-db.ts";
import { Engine, engineNames, type Game } from "./game-db.ts";

type PCGamingWikiGame = {
  title: string;
  engineBrand?: string;
  engineVersion?: string;
  steamIds?: string;
  gogIds?: string;
};

type PCGamingWikiResponse = {
  cargoquery?: PCGamingWikiGame[];
};

// PCGamingWiki seems to allow for this many elements per page for now.
// If this limit goes down, we might have problems.
const limitPerPage = 500;

function getEngineBrand(game: PCGamingWikiGame): EngineBrand | undefined {
  if (!game.engineBrand) return undefined;
  const engineBrand = game.engineBrand.toLowerCase();

  if (engineBrand.includes("unreal")) return "Unreal";
  if (engineBrand.includes("unity")) return "Unity";
  if (engineBrand.includes("godot")) return "Godot";
  if (engineBrand.includes("gamemaker")) return "GameMaker";

  return undefined;
}

function commaSeparatedToArray(commaSeparated: string): string[] {
  return commaSeparated.split(",").map((id) => id.trim());
}

function getProviderIds(game: PCGamingWikiGame): ProviderIdMap | undefined {
  const result: ProviderIdMap = {};

  if (game.steamIds) {
    result.Steam = commaSeparatedToArray(game.steamIds);
  }

  if (game.gogIds) {
    result.Gog = commaSeparatedToArray(game.gogIds);
  }

  return result;
}

function getEngineVersion(game: PCGamingWikiGame): string | undefined {
  if (game.engineVersion) return game.engineVersion;

  if (game.engineBrand) {
    // Some engines in PCGamingWiki have the version number in the brand,
    // like "Unreal Engine 4".
    const versionMatch = game.engineBrand.match(/\d+(\.\d+)*/);
    if (versionMatch) return versionMatch[0];
  }

  return undefined;
}

function getEngine(game: PCGamingWikiGame): Engine | undefined {
  const brand = getEngineBrand(game);
  if (!brand) return undefined;

  return {
    brand,
    version: getEngineVersion(game),
  };
}

async function fetchGamesByEngine(engineName: string): Promise<Game[]> {
  const url = "https://www.pcgamingwiki.com/w/api.php";
  let allGames: Game[] = [];
  const gamesByTitle: Partial<Record<string, Game>> = {};
  let offset = 0;

  while (true) {
    console.log(
      `Fetching games for engine ${engineName} with offset ${offset}...`
    );

    const params = new URLSearchParams({
      action: "cargoquery",
      tables: "Infobox_game_engine=Engine,Infobox_game=Game",
      join_on: "Game._pageName=Engine._pageName",
      fields:
        "Game._pageName=title,Engine.Engine=engineBrand,Game.Steam_AppID=steamIds,Game.GOGcom_ID=gogIds,Engine.Build=engineVersion",
      where: `Engine LIKE "Engine:${engineName}%"`,
      format: "json",
      limit: String(limitPerPage),
      offset: String(offset),
    });

    const urlWithParams = `${url}?${params.toString()}`;
    console.log(`Requesting from ${urlWithParams}`);
    const response = await fetch(urlWithParams);
    const data = (await response.json()) as PCGamingWikiResponse;

    if (data.cargoquery) {
      const games: Game[] = [];

      for (const pcGamingWikiGame of data.cargoquery) {
        const engine = getEngine(pcGamingWikiGame);
        if (!engine) continue;

        const gameBase: Game = gamesByTitle[pcGamingWikiGame.title] ?? {
          engines: [],
          providerIds: getProviderIds(pcGamingWikiGame),
          title: pcGamingWikiGame.title,
        };

        games.push({
          ...gameBase,
          engines: [...gameBase.engines, engine],
        });
      }

      allGames = allGames.concat(games);

      if (games.length < limitPerPage) {
        break;
      }

      offset += limitPerPage;
    } else {
      break;
    }
  }

  return allGames;
}

export async function fetchPcGamingWikiGames(): Promise<Game[]> {
  return await Promise.all(engineNames.map(fetchGamesByEngine)).then((games) =>
    games.flat()
  );
}
