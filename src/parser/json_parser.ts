import { bad_request_error } from "../http/errors.ts";

export function parse_json<T = unknown>(raw: string): T {
    const trimmed = raw.trim();

    if (trimmed.length === 0) {
        return null as T;
    }

    try {
        return JSON.parse(trimmed) as T;
    } catch {
        throw new bad_request_error("Invalid JSON payload.");
    }
}
