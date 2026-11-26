import { token } from "./replacement-tokens.ts";

export function sharedModFolder(id: string): string {
	return `${token.SharedModsPath}/${id}`;
}
