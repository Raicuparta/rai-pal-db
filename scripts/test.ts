import { fetchPCGamePassGames } from "./xbox-gamepass.ts";

function test() {
  fetchPCGamePassGames().then(console.log);
}

test();
