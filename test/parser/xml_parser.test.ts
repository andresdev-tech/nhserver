import { describe, expect, it } from "vitest";
import { parse_xml } from "../../src/parser/xml_parser.js";
import { bad_request_error } from "../../src/http/errors.js";

describe("xml_parser", () => {
    it("should parse simple XML string to JavaScript object", () => {
        const xml = "<user><name>John</name><age>28</age></user>";
        const result = parse_xml<{ user: { name: string; age: string } }>(xml);

        expect(result).toEqual({
            user: {
                name: "John",
                age: "28",
            },
        });
    });

    it("should parse XML with attributes", () => {
        const xml = '<item id="42" category="books"><title>TypeScript Guide</title></item>';
        const result = parse_xml(xml);

        expect(result).toEqual({
            item: {
                "@id": "42",
                "@category": "books",
                title: "TypeScript Guide",
            },
        });
    });

    it("should parse repeated elements into arrays", () => {
        const xml = "<list><item>one</item><item>two</item><item>three</item></list>";
        const result = parse_xml(xml);

        expect(result).toEqual({
            list: {
                item: ["one", "two", "three"],
            },
        });
    });

    it("should return null for empty string or whitespace", () => {
        expect(parse_xml("")).toBeNull();
        expect(parse_xml("   ")).toBeNull();
    });

    it("should throw bad_request_error for unclosed or mismatched XML tags", () => {
        expect(() => {
            parse_xml("<user><name>John</user>");
        }).toThrow(bad_request_error);

        expect(() => {
            parse_xml("<user><name>John</name>");
        }).toThrow("Invalid XML payload: unclosed tags.");
    });
});
