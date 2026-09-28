import { describe, expect, it } from "vitest";
import { parse_form } from "../../src/parser/form_parser.js";

describe("form_parser", () => {
    it("should parse url-encoded form data", () => {
        const result = parse_form("username=juan&role=developer");
        expect(result).toEqual({
            username: "juan",
            role: "developer",
        });
    });

    it("should group repeated keys into arrays", () => {
        const result = parse_form("tag=typescript&tag=nodejs&tag=vitest");
        expect(result).toEqual({
            tag: ["typescript", "nodejs", "vitest"],
        });
    });

    it("should return empty object for empty string", () => {
        expect(parse_form("")).toEqual({});
        expect(parse_form("   ")).toEqual({});
    });
});
