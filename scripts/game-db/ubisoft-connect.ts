import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { Game, GameSubscription } from "./main.ts";
import { filterFalsy } from "./helpers.ts";

type AlgoliaResponse = {
	hits: {
		title: string;
		id: string;
		image_link: string;
		short_title: string;
		release_date: string;
		partofSubscriptionOffer: string[];
	}[];
};

async function getApiURL(): Promise<URL> {
	const response = await fetch("https://store.ubisoft.com/us/games");
	const html = await response.text();
	const document = new DOMParser().parseFromString(html, "text/html");
	const mooncakeData = document.querySelector("mooncake-data");
	if (!mooncakeData) {
		throw new Error("Could not find mooncake data");
	}

	const algoliaAppId = mooncakeData.getAttribute("algolia-app-id");
	const algoliaApiKey = mooncakeData.getAttribute("algolia-api-key");
	if (!algoliaAppId || !algoliaApiKey) {
		throw new Error("Could not find Algolia app ID or API key");
	}

	const params = new URLSearchParams({
		"x-algolia-application-id": algoliaAppId,
		"x-algolia-api-key": algoliaApiKey,
	});

	console.log(
		`Found Algolia app ID: ${algoliaAppId} and API key: ${algoliaApiKey}`
	);
	return new URL(
		`https://${algoliaAppId}-dsn.algolia.net/1/indexes/production__us_ubisoft__products__en_US__release_date/query?&${params}`
	);
}

function getSubscription(subscription: string): GameSubscription | null {
	const lowerCaseSubscription = subscription.toLowerCase();
	if (lowerCaseSubscription.includes("premium")) {
		return "UbisoftPremium";
	} else if (lowerCaseSubscription.includes("classics")) {
		return "UbisoftClassics";
	}
	return null;
}

const requestBody = {
	query: "",
	attributesToRetrieve: [
		"title",
		"image_link",
		"short_title",
		"id",
		"MasterID",
		"release_date",
		"partofSubscriptionOffer",
	],
	attributesToHighlight: [],
	hitsPerPage: 9999,
	facetFilters: [["partOfUbisoftPlus:true"], [], [], []],
};

export async function fetchUbisoftGames(): Promise<Game[]> {
	const url = await getApiURL();
	console.log(`Fetching Ubisoft games from ${url}`);
	const response = await fetch(url, {
		body: JSON.stringify(requestBody),
		method: "POST",
	});
	if (!response.ok) {
		throw new Error(`Could not fetch Ubisoft games: ${response.statusText}`);
	}
	const data = (await response.json()) as AlgoliaResponse;
	return data.hits.map(
		(hit): Game => ({
			title: hit.title,
			ids: {
				Ubisoft: new Set([hit.id]),
			},
			subscriptions: filterFalsy(
				hit.partofSubscriptionOffer.map(getSubscription)
			),
		})
	);
}
