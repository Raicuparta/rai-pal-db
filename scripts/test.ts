import { fetchUbisoftGames } from "./ubisoft-connect.ts";
import { fetchPCGamePassGames } from "./xbox-gamepass.ts";

function test() {
  fetchUbisoftGames().then(console.log);
}

test();
