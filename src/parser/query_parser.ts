export type query_params = Record<
    string,
    string | string[]
>;

export function parse_query(url: string): query_params {
    const query_index = url.indexOf("?");

    if (query_index === -1) {
        return {};
    }

    const query_string = url.slice(query_index + 1);

    if (query_string.length === 0) {
        return {};
    }

    const search_params = new URLSearchParams(query_string);
    const result: query_params = {};

    for (const [key, value] of search_params.entries()) {
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

    return result;
}
