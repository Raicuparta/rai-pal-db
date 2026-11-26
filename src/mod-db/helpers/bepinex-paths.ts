import { token } from "../replacement-tokens.ts";

export const bepinexFolder = `${token.GameInstalledModsPath}/bepinex/BepInEx`;
export const bepinexConfigFolder = `${bepinexFolder}/config`;
export const bepinexLogOutputPath = `${bepinexFolder}/LogOutput.log`;

export function bepinexConfigPath(fileName: string): string {
	return `${bepinexConfigFolder}/${fileName}`;
}
