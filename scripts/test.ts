import { getNormalizedTitles } from "./normalized-title.ts";
import { fetchUbisoftGames } from "./ubisoft-connect.ts";
import { fetchPCGamePassGames } from "./xbox-gamepass.ts";

function test() {
  console.log(getNormalizedTitles("Tetris® Effect: Connected"));
}

test();
