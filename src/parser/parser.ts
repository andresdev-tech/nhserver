import { parse_json } from "./json_parser.ts";
import { parse_xml } from "./xml_parser.ts";
import { parse_form } from "./form_parser.ts";

export function parse_body_by_content_type<T = unknown>(
    raw_text: string,
    content_type_header: string = "",
): T {
    const normalized = content_type_header.toLowerCase().split(";")[0].trim();

    if (normalized === "application/json") {
        return parse_json<T>(raw_text);
    }

    if (normalized === "application/xml" || normalized === "text/xml") {
        return parse_xml<T>(raw_text);
    }

    if (normalized === "application/x-www-form-urlencoded") {
        return parse_form<T>(raw_text);
    }

    // Default or text/plain
    return raw_text as unknown as T;
}
