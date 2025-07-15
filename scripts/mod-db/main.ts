import { getLatestBuildURls } from "./bepinex.ts";

console.log(JSON.stringify(await getLatestBuildURls(), null, 2));
