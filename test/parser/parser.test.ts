import { describe, expect, it } from "vitest";
import { parse_body_by_content_type } from "../../src/parser/parser.js";

describe("parse_body_by_content_type", () => {
    it("should dispatch to JSON parser for application/json", () => {
        const result = parse_body_by_content_type('{"key":"value"}', "application/json; charset=utf-8");
        expect(result).toEqual({ key: "value" });
    });

    it("should dispatch to XML parser for application/xml", () => {
        const result = parse_body_by_content_type("<note><text>hi</text></note>", "application/xml");
        expect(result).toEqual({ note: { text: "hi" } });
    });

    it("should dispatch to Form parser for application/x-www-form-urlencoded", () => {
        const result = parse_body_by_content_type("name=juan", "application/x-www-form-urlencoded");
        expect(result).toEqual({ name: "juan" });
    });

    it("should return raw text for text/plain or unknown content types", () => {
        const result = parse_body_by_content_type("plain raw string", "text/plain");
        expect(result).toBe("plain raw string");
    });
});
