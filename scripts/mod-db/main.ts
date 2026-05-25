import { MOD_DATABASE_VERSION } from "#common/versions.ts";
import { getMods } from "./mods/mods.ts";
import stringify from "canonical-json";

const json = stringify(
  {
    mods: await getMods(),
  },
  undefined,
  2,
);

if (!json) {
  throw new Error("Failed to convert mods output to JSON");
}

await Deno.writeTextFile(
  `../mod-db/${MOD_DATABASE_VERSION}/mods.json`,
  json,
);
