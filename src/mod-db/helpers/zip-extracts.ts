import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ArrayBufferReader, HTTPRangeReader, unzip } from "unzipit";
import { publicFolder } from "../../common/paths.ts";
import type { ModBase, ModDownload } from "../mod.ts";
import { getPreviousMods } from "../previous-mods.ts";

export type ExtractEntry = NonNullable<
	NonNullable<ModBase["install"]>["extract"]
>[number];

const localUrlPrefix = "{{DatabaseUrlBase}}/";
const zipEntryCache = new Map<string, Promise<Set<string>>>();

function normalizePath(path: string): string {
	return path.replace(/\/+$/, "");
}

function joinPath(base: string, child: string): string {
	return `${normalizePath(base)}/${child}`;
}

function comparePaths(a: string, b: string): number {
	return a < b ? -1 : a > b ? 1 : 0;
}

async function readZipEntries(download: ModDownload): Promise<Set<string>> {
	if (download.url.startsWith(localUrlPrefix)) {
		const path = join(publicFolder, download.url.slice(localUrlPrefix.length));
		const contents = await readFile(path);
		const buffer = contents.buffer.slice(
			contents.byteOffset,
			contents.byteOffset + contents.byteLength,
		);
		const { entries } = await unzip(new ArrayBufferReader(buffer));
		return new Set(Object.keys(entries).map(normalizePath));
	}

	const { entries } = await unzip(new HTTPRangeReader(download.url));
	return new Set(Object.keys(entries).map(normalizePath));
}

export function getCachedZipEntries(
	download: ModDownload,
): Promise<Set<string>> | undefined {
	return zipEntryCache.get(download.url);
}

export function getZipEntries(download: ModDownload): Promise<Set<string>> {
	let entries = zipEntryCache.get(download.url);

	if (!entries) {
		entries = readZipEntries(download);
		zipEntryCache.set(download.url, entries);
	}

	return entries;
}

async function reusePreviousContents(
	download: ModDownload,
	source: string,
	destination: string,
): Promise<ExtractEntry[] | undefined> {
	const previousMods = await getPreviousMods();
	const normalizedSource = normalizePath(source);
	const prefix = normalizedSource === "." ? "" : `${normalizedSource}/`;
	const normalizedDestination = normalizePath(destination);

	for (const mod of previousMods) {
		if (
			mod.download?.id !== download.id ||
			mod.download.url !== download.url
		) {
			continue;
		}

		const reused: ExtractEntry[] = [];

		for (const extract of mod.install?.extract ?? []) {
			const previousSource = normalizePath(extract.source);

			if (
				previousSource === normalizedSource ||
				!previousSource.startsWith(prefix)
			) {
				continue;
			}

			const relative = previousSource.slice(prefix.length);
			if (!relative || relative.includes("/")) {
				continue;
			}

			if (
				normalizePath(extract.destination) !==
				joinPath(normalizedDestination, relative)
			) {
				continue;
			}

			reused.push(extract);
		}

		if (reused.length > 0) {
			return reused.sort((a, b) => comparePaths(a.source, b.source));
		}
	}

	return undefined;
}

export async function extractZipContents(
	download: ModDownload,
	source: string,
	destination: string,
): Promise<ExtractEntry[]> {
	const reused = await reusePreviousContents(download, source, destination);
	if (reused) {
		return reused;
	}

	const entries = await getZipEntries(download);
	const prefix = source === "." ? "" : `${normalizePath(source)}/`;
	const children = new Set<string>();

	for (const entry of entries) {
		if (!entry.startsWith(prefix)) {
			continue;
		}

		const rest = entry.slice(prefix.length);
		if (!rest) {
			continue;
		}

		const child = rest.split("/")[0];
		if (child) {
			children.add(child);
		}
	}

	if (children.size === 0) {
		throw new Error(`Zip folder is empty or missing: ${source}`);
	}

	return [...children].sort(comparePaths).map((child) => ({
		source: joinPath(source, child),
		destination: joinPath(destination, child),
	}));
}

export function zipHasSource(entries: Set<string>, source: string): boolean {
	const normalized = normalizePath(source);

	if (normalized === ".") {
		return entries.size > 0;
	}

	if (entries.has(normalized)) {
		return true;
	}

	const prefix = `${normalized}/`;
	for (const entry of entries) {
		if (entry.startsWith(prefix)) {
			return true;
		}
	}

	return false;
}
