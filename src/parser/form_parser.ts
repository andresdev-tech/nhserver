export function parse_form<T = Record<string, string | string[]>>(
    raw: string,
): T {
    const trimmed = raw.trim();

    if (trimmed.length === 0) {
        return {} as T;
    }

    const params = new URLSearchParams(trimmed);
    const result: Record<string, string | string[]> = {};

    for (const [key, value] of params.entries()) {
        if (result[key] !== undefined) {
            if (Array.isArray(result[key])) {
                (result[key] as string[]).push(value);
            } else {
                result[key] = [result[key] as string, value];
            }
        } else {
            result[key] = value;
        }
    }

    return result as T;
}
