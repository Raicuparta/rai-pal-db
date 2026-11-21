// These IDs need to match the ones in the games database and in Rai Pal.
export const providerIds = [
	"Amazon",
	"Ea",
	"Epic",
	"Gog",
	"Itch",
	"Steam",
	"Ubisoft",
	"Xbox",
] as const;

export const idProviders = [...providerIds, "NormalizedTitle"] as const;

export type ProviderId = (typeof providerIds)[number];
export type IdProvider = (typeof idProviders)[number];
