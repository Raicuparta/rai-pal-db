import { Game } from "./main.ts";

const DEMO_REGEX = /\(\s*demo\s*\)$/i;
const BRACKETS_REGEX = /\[.*?\]|\(.*?\)|\{.*?\}|<.*?>/;
const SEPARATORS_REGEX = /\s-\s.+/;

// Titles given by the game providers can have all sorts of trash.
// But we want to be able to use the titles to match some local and remote games.
// So we need to normalize the titles.
// Some ways of normalizing the titles work for some games/providers, some work for others.
// So we have a list of different normalization methods, so we can try each one later.
function getNormalizedTitles(title: string): Set<string> {
  return new Set([
    normalizeTitle(title),
    normalizeTitle(title.replace(DEMO_REGEX, "")),
    normalizeTitle(title.replace(BRACKETS_REGEX, "")),
    normalizeTitle(title.replace(SEPARATORS_REGEX, "")),
  ]);
}

function normalizeTitle(title: string): string {
  return title.replace(/\W+/g, "").toLowerCase();
}

export function addNormalizedTitles(game: Game) {
  if (!game.title) return;
  const normalizedTitles = getNormalizedTitles(game.title);
  if (normalizedTitles.size === 0) return;
  game.ids["NormalizedTitle"] = normalizedTitles;
}
