import type { ModBase } from "../mod.ts";
import {
	bepinexConfigFolder,
	bepinexFolder,
	bepinexLogOutputPath,
} from "./bepinex-paths.ts";

type ModInstall = NonNullable<ModBase["install"]>;
type ModInstallExtract = NonNullable<ModInstall["extract"]>[number];
type ModPath = NonNullable<ModBase["paths"]>[number];

export function bepinexModBase(id: string) {
	const pluginFolder = `${bepinexFolder}/plugins/${id}`;
	const patcherFolder = `${bepinexFolder}/patchers/${id}`;

	return {
		id,
		base: {
			engine: "Unity",
			requiredDependencies: [{ tag: "bepinex" }],
		} satisfies Pick<ModBase, "engine" | "requiredDependencies">,
		installKind: "PerGame" as const,
		pluginFolder,
		patcherFolder,
		extract: {
			plugin: (source = "plugins"): ModInstallExtract => ({
				source,
				destination: pluginFolder,
			}),
			patcher: (source = "patchers"): ModInstallExtract => ({
				source,
				destination: patcherFolder,
			}),
		},
		paths: {
			plugin: (): ModPath => ({
				path: pluginFolder,
				type: "Folder",
			}),
			patcher: (): ModPath => ({
				path: patcherFolder,
				type: "Folder",
			}),
			config: (fileName: string): ModPath => ({
				path: `${bepinexConfigFolder}/${fileName}`,
				type: "File",
			}),
			logOutput: (): ModPath => ({
				path: bepinexLogOutputPath,
				type: "File",
			}),
		},
	};
}

export function bepinexConfig({
	id,
	title,
	engineVersionRange,
	content,
}: {
	id: string;
	title: string;
	engineVersionRange: ModBase["engineVersionRange"];
	content: string;
}): ModBase {
	const configPath = `${bepinexConfigFolder}/BepInEx.cfg`;

	return {
		id,
		tags: ["bepinex-config"],
		title,
		author: "BepInEx",
		website: "https://github.com/BepInEx/BepInEx",
		description: "Default BepInEx config",
		engine: "Unity",
		engineVersionRange,
		install: {
			installKind: "PerGame" as const,
			dependencyOnly: true,
			write: [{ content, destination: configPath }],
		},
		paths: [{ path: configPath, type: "File" }],
	};
}
