import { Game } from "./main.ts";

const APIIds = {
  console: "f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e",
  pc: "fdd9e2a7-0fee-49f6-ad69-4354098401ff",
  eaPlay: "b8900d09-a491-44cc-916e-32b5acae621b",
} as const;

type PassType = keyof typeof APIIds;

type Market =
  | "US"
  | "DZ"
  | "AR"
  | "AU"
  | "AT"
  | "BH"
  | "BD"
  | "BE"
  | "BR"
  | "BG"
  | "CA"
  | "CL"
  | "CN"
  | "CO"
  | "CR"
  | "HR"
  | "CY"
  | "CZ"
  | "DK"
  | "EG"
  | "EE"
  | "FI"
  | "FR"
  | "DE"
  | "GR"
  | "GT"
  | "HK"
  | "HU"
  | "IS"
  | "IN"
  | "ID"
  | "IQ"
  | "IE"
  | "IL"
  | "IT"
  | "JP"
  | "JO"
  | "KZ"
  | "KE"
  | "KW"
  | "LV"
  | "LB"
  | "LI"
  | "LT"
  | "LU"
  | "MY"
  | "MT"
  | "MR"
  | "MX"
  | "MA"
  | "NL"
  | "NZ"
  | "NG"
  | "NO"
  | "OM"
  | "PK"
  | "PE"
  | "PH"
  | "PL"
  | "PT"
  | "QA"
  | "RO"
  | "RU"
  | "SA"
  | "RS"
  | "SG"
  | "SK"
  | "SI"
  | "ZA"
  | "KR"
  | "ES"
  | "SE"
  | "CH"
  | "TW"
  | "TH"
  | "TT"
  | "TN"
  | "TR"
  | "UA"
  | "AE"
  | "GB"
  | "VN"
  | "YE"
  | "LY"
  | "LK"
  | "UY"
  | "VE"
  | "AF"
  | "AX"
  | "AL"
  | "AS"
  | "AO"
  | "AI"
  | "AQ"
  | "AG"
  | "AM"
  | "AW"
  | "BO"
  | "BQ"
  | "BA"
  | "BW"
  | "BV"
  | "IO"
  | "BN"
  | "BF"
  | "BI"
  | "KH"
  | "CM"
  | "CV"
  | "KY"
  | "CF"
  | "TD"
  | "TL"
  | "DJ"
  | "DM"
  | "DO"
  | "EC"
  | "SV"
  | "GQ"
  | "ER"
  | "ET"
  | "FK"
  | "FO"
  | "FJ"
  | "GF"
  | "PF"
  | "TF"
  | "GA"
  | "GM"
  | "GE"
  | "GH"
  | "GI"
  | "GL"
  | "GD"
  | "GP"
  | "GU"
  | "GG"
  | "GN"
  | "GW"
  | "GY"
  | "HT"
  | "HM"
  | "HN"
  | "AZ"
  | "BS"
  | "BB"
  | "BY"
  | "BZ"
  | "BJ"
  | "BM"
  | "BT"
  | "KM"
  | "CG"
  | "CD"
  | "CK"
  | "CX"
  | "CC"
  | "CI"
  | "CW"
  | "JM"
  | "SJ"
  | "JE"
  | "KI"
  | "KG"
  | "LA"
  | "LS"
  | "LR"
  | "MO"
  | "MK"
  | "MG"
  | "MW"
  | "IM"
  | "MH"
  | "MQ"
  | "MU"
  | "YT"
  | "FM"
  | "MD"
  | "MN"
  | "MS"
  | "MZ"
  | "MM"
  | "NA"
  | "NR"
  | "NP"
  | "MV"
  | "ML"
  | "NC"
  | "NI"
  | "NE"
  | "NU"
  | "NF"
  | "PW"
  | "PS"
  | "PA"
  | "PG"
  | "PY"
  | "RE"
  | "RW"
  | "BL"
  | "MF"
  | "WS"
  | "ST"
  | "SN"
  | "MP"
  | "PN"
  | "SX"
  | "SB"
  | "SO"
  | "SC"
  | "SL"
  | "GS"
  | "SH"
  | "KN"
  | "LC"
  | "PM"
  | "VC"
  | "TJ"
  | "TZ"
  | "TG"
  | "TK"
  | "TO"
  | "TM"
  | "TC"
  | "TV"
  | "UM"
  | "UG"
  | "VI"
  | "VG"
  | "WF"
  | "EH"
  | "ZM"
  | "ZW"
  | "UZ"
  | "VU"
  | "SR"
  | "SZ"
  | "AD"
  | "MC"
  | "SM"
  | "ME"
  | "VA"
  | "NEUTRAL";

type IdsResponseItem = {
  id: string;
};

type IdsResponse = [
  {
    sigId: (typeof APIIds)["pc"];
  },
  ...IdsResponseItem[]
];

type PropertiesResponse = {
  Products: {
    ProductId: string;
    LocalizedProperties: {
      ProductTitle: string;
      Images: {
        ImagePurpose: "string";
        Uri: string;
        FileSizeInBytes: string;
      };
    }[];
    MarketProperties: {
      OriginalReleaseDate: string;
    }[];
  }[];
};

async function fetchGameIDs(
  passType: PassType,
  market: Market
): Promise<string[]> {
  console.log(
    `Fetching ${passType} Game Pass game IDs for market "${market}"...`
  );
  return await fetch(
    `https://catalog.gamepass.com/sigls/v2?id=${APIIds[passType]}&language=en-us&market=${market}`
  )
    .then((response) => response.json())
    .then((data: IdsResponse) =>
      data
        .filter(
          (entry) => entry != null && typeof entry === "object" && "id" in entry
        )
        .map((entry) => entry.id)
    );
}

async function fetchGameProperties(
  gameIds: string[],
  passType: PassType,
  market: Market
) {
  console.log(
    `Fetching game properties for ${gameIds.length} ${passType} games for market "${market}"...`
  );
  return await fetch(
    `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${gameIds}&market=${market}&languages=en-us`
  )
    .then((response) => response.json())
    .then((data: PropertiesResponse) => {
      return data.Products;
    });
}

async function fetchGames(passType: PassType): Promise<Game[]> {
  const ids = await fetchGameIDs(passType, "US");
  const properties = await fetchGameProperties(ids, passType, "US");
  return properties.map((product) => ({
    engines: [],
    title: product.LocalizedProperties[0].ProductTitle,
    providerIds: {
      Xbox: [product.ProductId],
    },
  }));
}

export async function fetchPCGamePassGames(): Promise<Game[]> {
  return await fetchGames("pc");
}

export async function fetchEAGamePassGames(): Promise<Game[]> {
  return await fetchGames("eaPlay");
}
