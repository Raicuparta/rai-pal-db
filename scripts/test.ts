import { Game } from "#game-db/main.ts";
import { mergeGames } from "#game-db/merge-games.ts";
import { getBepInExBleedingReleases } from "#loader-db/bepinex/bepinex-bleeding.ts";
import { getBepInExStableReleases } from "#loader-db/bepinex/bepinex-stable.ts";

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

async function test() {
	const result = Object.entries({
		...(await getBepInExStableReleases()),
		...(await getBepInExBleedingReleases()),
	})
		.sort((a, b) => b[0].localeCompare(a[0]))
		.map(([version, builds]) => ({
			version,
			builds,
		}));

	await Deno.writeTextFile("./test.json", JSON.stringify(result, null, 2));
}

await test();
