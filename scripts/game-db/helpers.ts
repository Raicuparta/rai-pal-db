export function filterFalsy<T>(arr: (T | null | undefined)[]): T[] {
	return arr.filter(Boolean) as T[];
}

// Sources give us dates in a bunch of formats ("2013-07-05", "July 5, 2013",
// full ISO timestamps), so normalize everything to RFC 3339 for Rai Pal.
export function normalizeReleaseDate(
	date: string | null | undefined,
): string | undefined {
	if (!date) return undefined;
	const trimmed = date.trim();
	if (!trimmed) return undefined;

	const parsed = new Date(trimmed);
	if (Number.isNaN(parsed.getTime())) return undefined;

	return parsed.toISOString();
}

export function jsonReplacer(_key: string, value: unknown) {
	if (value instanceof Set) {
		return Array.from(value); // Convert Set to Array
	}
	return value; // Return all other values unchanged
}
