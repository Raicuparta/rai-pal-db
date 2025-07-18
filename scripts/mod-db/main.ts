import { getBepInExBleedingBuilds } from "./bepinex/bepinex-bleeding.ts";
import { getBepInExStableBuilds } from "./bepinex/bepinex-stable.ts";

const result = {
	...(await getBepInExStableBuilds()),
	...(await getBepInExBleedingBuilds()),
};

console.log(JSON.stringify(result, null, 2));
