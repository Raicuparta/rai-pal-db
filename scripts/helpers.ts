export function filterFalsy<T>(arr: (T | null | undefined)[]): T[] {
	return arr.filter(Boolean) as T[];
}

export function jsonReplacer(_key: string, value: unknown) {
	if (value instanceof Set) {
		return Array.from(value); // Convert Set to Array
	}
	return value; // Return all other values unchanged
}
