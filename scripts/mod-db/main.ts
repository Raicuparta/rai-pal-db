import { MOD_DATABASE_VERSION } from "#common/versions.ts";
import stringify from "canonical-json";
import { hash } from "canonical-json/hash";
import { Mod, ModBase } from "./mod.ts";
import { getBepinexMods } from "./bepinex/bepinex.ts";
import { getUevrMods } from "./uevr/uevr.ts";
import { getUe4ssMods } from "./ue4ss/ue4ss.ts";

type ModGetter = () => Promise<ModBase[]>;

const modGetters: ModGetter[] = [
  getBepinexMods,
  getUevrMods,
  getUe4ssMods,
];

const mods: Mod[] = (await Promise.all(modGetters.map((getter) => getter())))
  .flat()
  .map((modBase) => ({ ...modBase, hash: hash(modBase) }));

const json = stringify(
  {
    mods,
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
