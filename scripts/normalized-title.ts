import { Game } from "./main.ts";

// Hey! If you're changing this, note that Rai Pal also has a very similar algo for normalizing titles,
// and these need to be mostly in sync with each other.
// It's annoying, but I couldn't think of a good way around this,
// other than not doing the merging on the db side at all,
// which would make the db a lot bigger and move a lot of work to the frontend.

const DEMO_REGEX = /\(\s*demo\s*\)$/i;
const BRACKETS_REGEX = /\[.*?\]|\(.*?\)|\{.*?\}|<.*?>/;
const SEPARATORS_REGEX = /\s-\s.+/;

// Titles given by the game providers can have all sorts of trash.
// But we want to be able to use the titles to match games from different providers.
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
  game.ids["Manual"] = normalizedTitles;
}
