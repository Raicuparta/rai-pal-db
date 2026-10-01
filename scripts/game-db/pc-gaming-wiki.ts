import { EngineBrand, IdMap } from "./main.ts";
import { Engine, engineBrands, type Game } from "./main.ts";

type PCGamingWikiGame = {
	title: string;
	engineBrand?: string;
	engineVersion?: string;
	steamIds?: string;
	gogIds?: string;
};

type PCGamingWikiResponse = {
	cargoquery?: { title: PCGamingWikiGame }[];
	error?: { code?: string; info?: string };
};

type LoginTokenResponse = {
	query?: { tokens?: { logintoken?: string } };
	error?: { code?: string; info?: string };
};

type LoginResponse = {
	login?: {
		result?: string;
		reason?: string;
		lgusername?: string;
		token?: string;
	};
	error?: { code?: string; info?: string };
};

// PCGamingWiki seems to allow for this many elements per page for now.
// If this limit goes down, we might have problems.
const limitPerPage = 500;

const apiUrl = "https://www.pcgamingwiki.com/w/api.php";

const userAgent = "rai-pal-db/1.0 (+https://github.com/Raicuparta/rai-pal-db)";

// PCGamingWiki only allows `cargoquery` for logged-in accounts with the
// "runcargoqueries" permission (anonymous access was revoked to stop scrapers
// from hammering their backend). See Special:BotPasswords for creating a bot
// account, then set PCGAMINGWIKI_USERNAME (e.g. "Account@Bot") and
// PCGAMINGWIKI_PASSWORD. Without them we still try anonymously, which their API
// currently rejects.
const username = Deno.env.get("PCGAMINGWIKI_USERNAME");
const password = Deno.env.get("PCGAMINGWIKI_PASSWORD");

// Cookie jar for the MediaWiki session. Login tokens are bound to the session,
// so the cookies from the token request must be reused for the login request
// and every subsequent query.
const cookies = new Map<string, string>();

function storeCookies(response: Response): void {
	const setCookies = response.headers.getSetCookie?.() ?? [];
	for (const setCookie of setCookies) {
		const [pair] = setCookie.split(";");
		const separatorIndex = pair.indexOf("=");
		if (separatorIndex === -1) continue;
		const name = pair.slice(0, separatorIndex).trim();
		const value = pair.slice(separatorIndex + 1).trim();
		if (name) cookies.set(name, value);
	}
}

function getCookieHeader(): string | undefined {
	if (cookies.size === 0) return undefined;
	return [...cookies]
		.map(([name, value]) => `${name}=${value}`)
		.join("; ");
}

async function request<T>(
	params: URLSearchParams,
	method: "GET" | "POST" = "GET",
): Promise<T> {
	const headers: Record<string, string> = { "User-Agent": userAgent };
	const cookieHeader = getCookieHeader();
	if (cookieHeader) {
		headers["Cookie"] = cookieHeader;
	}

	const response = method === "POST"
		? await fetch(apiUrl, { method, headers, body: params })
		: await fetch(`${apiUrl}?${params.toString()}`, { headers });

	storeCookies(response);

	if (!response.ok) {
		throw new Error(
			`PCGamingWiki request failed with HTTP ${response.status} ${response.statusText}`,
		);
	}

	try {
		return (await response.json()) as T;
	} catch (error) {
		throw new Error(`PCGamingWiki returned a non-JSON response: ${error}`);
	}
}

function describeApiError(
	error: { code?: string; info?: string } | undefined,
): string {
	const code = error?.code ?? "unknown";
	const info = error?.info ?? "no details";
	const hint = code === "permissiondenied"
		? ` Cargo queries require a logged-in account with the "runcargoqueries" permission; ` +
			`set PCGAMINGWIKI_USERNAME and PCGAMINGWIKI_PASSWORD.`
		: "";
	return `${code} - ${info}.${hint}`;
}

async function login(): Promise<void> {
	if (!username || !password) {
		console.warn(
			"PCGAMINGWIKI_USERNAME / PCGAMINGWIKI_PASSWORD are not set. " +
				"Querying PCGamingWiki anonymously, which their API currently rejects.",
		);
		return;
	}

	console.log(`Logging in to PCGamingWiki as ${username}...`);

	const tokenData = await request<LoginTokenResponse>(
		new URLSearchParams({
			action: "query",
			meta: "tokens",
			type: "login",
			format: "json",
			formatversion: "2",
		}),
		"POST",
	);

	if (tokenData.error) {
		throw new Error(
			`PCGamingWiki login token request failed: ${
				describeApiError(tokenData.error)
			}`,
		);
	}

	const loginToken = tokenData.query?.tokens?.logintoken;
	if (!loginToken) {
		throw new Error(
			`PCGamingWiki did not return a login token: ${JSON.stringify(tokenData)}`,
		);
	}

	// `NeedToken` can happen if the token was stale, in which case the response
	// includes a fresh one to retry with.
	const attempt = async (token: string): Promise<LoginResponse> =>
		await request<LoginResponse>(
			new URLSearchParams({
				action: "login",
				lgname: username,
				lgpassword: password,
				lgtoken: token,
				format: "json",
				formatversion: "2",
			}),
			"POST",
		);

	let loginData = await attempt(loginToken);
	if (loginData.error) {
		throw new Error(
			`PCGamingWiki login failed: ${describeApiError(loginData.error)}`,
		);
	}

	if (loginData.login?.result === "NeedToken" && loginData.login.token) {
		loginData = await attempt(loginData.login.token);
	}

	const result = loginData.login?.result;
	if (result !== "Success") {
		throw new Error(
			`PCGamingWiki login failed for ${username}: ${result ?? "no result"}${
				loginData.login?.reason ? ` - ${loginData.login.reason}` : ""
			}`,
		);
	}

	console.log(
		`Logged in to PCGamingWiki as ${loginData.login?.lgusername ?? username}.`,
	);
}

let loginPromise: Promise<void> | undefined;

function ensureLoggedIn(): Promise<void> {
	loginPromise ??= login();
	return loginPromise;
}

function getEngineBrand(game: PCGamingWikiGame): EngineBrand | undefined {
	if (!game.engineBrand) return undefined;
	const engineBrand = game.engineBrand.toLowerCase();

	if (engineBrand.includes("unreal")) return "Unreal";
	if (engineBrand.includes("unity")) return "Unity";
	if (engineBrand.includes("godot")) return "Godot";
	if (engineBrand.includes("gamemaker")) return "GameMaker";

	return undefined;
}

function commaSeparatedToArray(commaSeparated: string): Set<string> {
	return new Set(commaSeparated.split(",").map((id) => id.trim()));
}

function getProviderIds(game: PCGamingWikiGame): IdMap {
	const result: IdMap = {};

	if (game.steamIds) {
		result.Steam = commaSeparatedToArray(game.steamIds);
	}

	if (game.gogIds) {
		result.Gog = commaSeparatedToArray(game.gogIds);
	}

	return result;
}

function getEngineVersion(game: PCGamingWikiGame): string | undefined {
	if (game.engineVersion) return game.engineVersion;

	if (game.engineBrand) {
		// Some engines in PCGamingWiki have the version number in the brand,
		// like "Unreal Engine 4".
		const versionMatch = game.engineBrand.match(/\d+(\.\d+)*/);
		if (versionMatch) return versionMatch[0];
	}

	return undefined;
}

function getEngine(game: PCGamingWikiGame): Engine | undefined {
	const brand = getEngineBrand(game);
	if (!brand) {
		return undefined;
	}

	return {
		brand,
		version: getEngineVersion(game),
	};
}

async function fetchGamesByEngine(engineName: string): Promise<Game[]> {
	const allGames: Game[] = [];
	const gamesByTitle: Partial<Record<string, Game>> = {};
	let offset = 0;

	while (true) {
		console.log(
			`Fetching games for engine ${engineName} with offset ${offset}...`,
		);

		const params = new URLSearchParams({
			action: "cargoquery",
			// Table names are the ones PCGamingWiki currently exposes; the old
			// "Infobox_game_engine"/"Infobox_game" names were renamed.
			tables: "GameEngine=Engine,Game=Game",
			join_on: "Game._pageName=Engine._pageName",
			fields:
				"Game._pageName=title,Engine.Engine=engineBrand,Game.Steam_AppID=steamIds,Game.GOGcom_ID=gogIds,Engine.Build=engineVersion",
			where: `Engine LIKE "Engine:${engineName}%"`,
			format: "json",
			limit: String(limitPerPage),
			offset: String(offset),
		});

		const data = await request<PCGamingWikiResponse>(params);

		// PCGamingWiki returns HTTP 200 with an `error` object when the query is not allowed.
		// This used to silently return an empty game list, which made the whole DB lose
		// all non-Steam games (see the `gamesWithEngines` filter in main.ts).
		if (data.error) {
			throw new Error(
				`PCGamingWiki API error for engine ${engineName}: ${
					describeApiError(data.error)
				}`,
			);
		}

		if (data.cargoquery) {
			const games: Game[] = [];
			const entries = data.cargoquery.map((entry) => entry.title);

			for (const pcGamingWikiGame of entries) {
				const engine = getEngine(pcGamingWikiGame);
				if (!engine) continue;

				const ids = getProviderIds(pcGamingWikiGame);
				if (Object.keys(ids).length === 0) continue;

				const gameBase: Game = gamesByTitle[pcGamingWikiGame.title] ?? {
					ids,
					title: pcGamingWikiGame.title,
				};

				games.push({
					...gameBase,
					engines: [...(gameBase.engines ?? []), engine],
				});
			}

			allGames.push(...games);

			if (entries.length < limitPerPage) {
				break;
			}

			offset += limitPerPage;
		} else {
			console.warn(
				`PCGamingWiki returned no "cargoquery" field for engine ${engineName} at offset ${offset}. Response keys: ${
					Object.keys(data).join(", ") || "none"
				}. Stopping pagination for this engine.`,
			);
			break;
		}
	}

	console.log(
		`Fetched ${allGames.length} games for engine ${engineName} from PCGamingWiki.`,
	);

	return allGames;
}

export async function fetchPcGamingWikiGames(): Promise<Game[]> {
	await ensureLoggedIn();
	const games = await Promise.all(engineBrands.map(fetchGamesByEngine));
	return games.flat();
}
