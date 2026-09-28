import { describe, expect, it } from "vitest";
import { parse_json } from "../../src/parser/json_parser.js";
import { bad_request_error } from "../../src/http/errors.js";

describe("json_parser", () => {
    it("should parse valid JSON object", () => {
        const result = parse_json<{ name: string; age: number }>('{"name":"Alice","age":30}');
        expect(result).toEqual({ name: "Alice", age: 30 });
    });

    it("should return null for empty string or whitespace", () => {
        expect(parse_json("")).toBeNull();
        expect(parse_json("   ")).toBeNull();
    });

    it("should throw bad_request_error when JSON is malformed", () => {
        expect(() => {
            parse_json('{"name": "Alice", age: }');
        }).toThrow(bad_request_error);

        expect(() => {
            parse_json('{ unclosed: "json"');
        }).toThrow("Invalid JSON payload.");
    });
});
