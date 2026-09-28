import { describe, expect, it } from "vitest";
import { parse_query } from "../../src/parser/query_parser.js";

describe("query_parser", () => {
    it("should parse query string from url", () => {
        const result = parse_query("/users?page=2&limit=20&sort=asc");
        expect(result).toEqual({
            page: "2",
            limit: "20",
            sort: "asc",
        });
    });

    it("should parse multiple values for same key into arrays", () => {
        const result = parse_query("/search?filter=active&filter=pending");
        expect(result).toEqual({
            filter: ["active", "pending"],
        });
    });

    it("should return empty object when no query string is present", () => {
        expect(parse_query("/users")).toEqual({});
        expect(parse_query("/users?")).toEqual({});
    });
});
