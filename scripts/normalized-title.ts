const DEMO_REGEX = /\(\s*demo\s*\)$/i;
const BRACKETS_REGEX = /\[.*?\]|\(.*?\)|\{.*?\}|<.*?>/;
const SEPARATORS_REGEX = /\s-\s.+/;

// Titles given by the game providers can have all sorts of trash.
// But we want to be able to use the titles to match some local and remote games.
// So we need to normalize the titles.
// Some ways of normalizing the titles work for some games/providers, some work for others.
// So we have a list of different normalization methods, so we can try each one later.
export function getNormalizedTitles(title: string): string[] {
  return deduplicateTitles([
    // Order is important here. First items will be attempted first.
    normalizeTitle(title),
    normalizeTitle(title.replace(DEMO_REGEX, "")),
    normalizeTitle(title.replace(BRACKETS_REGEX, "")),
    normalizeTitle(title.replace(SEPARATORS_REGEX, "")),
  ]);
}

function normalizeTitle(title: string): string {
  return title.replace(/\W+/g, "").toLowerCase();
}

export function deduplicateTitles(titles: string[]): string[] {
  const seen = new Set<string>();

  // Remove duplicates without affecting the original order:
  const deduplicated = titles.filter((normalizedTitle) => {
    return (
      normalizedTitle.length > 0 &&
      !seen.has(normalizedTitle) &&
      seen.add(normalizedTitle)
    );
  });

  return deduplicated;
}
