import { Game } from "./main.ts";
import { mergeGames } from "./merge-games.ts";
import { fetchUbisoftGames } from "./ubisoft-connect.ts";
import { fetchPCGamePassGames } from "./xbox-gamepass.ts";

const testGames: Game[] = [
  {
    ids: {
      Steam: new Set(["SteamA"]),
    },
    title: "Game A",
    engines: [
      {
        brand: "Unity",
        version: "2019.4.20f1",
      },
      {
        brand: "Unreal",
      },
    ],
  },
  {
    ids: {
      Steam: new Set(["SteamB", "SteamA"]),
    },
    title: "Game B",
    engines: [
      {
        brand: "Unity",
        version: "2019.4.20f1",
      },
      {
        brand: "Unity",
        version: "2019.4.21f1",
      },
      {
        brand: "Unreal",
        version: "2019.4.20f1",
      },
      {
        brand: "Godot",
      },
    ],
  },
  {
    ids: {
      Steam: new Set(["SteamC"]),
    },
    title: "Game C",
    engines: [
      {
        brand: "Unity",
        version: "2019.4.20f1",
      },
    ],
  },
  {
    ids: {
      Steam: new Set(["SteamE"]),
    },
    title: "Game D",
    engines: [
      {
        brand: "Unity",
        version: "2019.4.20f1",
      },
    ],
  },
];

function test() {
  console.log(JSON.stringify(mergeGames(testGames), null, 2));
}

test();
