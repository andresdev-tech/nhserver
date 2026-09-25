import { describe, expect, it } from "vitest";
import type { IncomingMessage } from "node:http";
import { nh_request } from "../../src/http/request.js";

describe("nh_request", () => {
    it("should initialize with values from IncomingMessage", () => {
        const mock_incoming = {
            method: "POST",
            url: "/api/test",
            headers: {
                "content-type": "application/json",
                authorization: "Bearer token",
            },
        } as unknown as IncomingMessage;

        const request = new nh_request(mock_incoming);

        expect(request.method).toBe("POST");
        expect(request.url).toBe("/api/test");
        expect(request.headers).toEqual({
            "content-type": "application/json",
            authorization: "Bearer token",
        });
    });

    it("should provide fallback defaults when method or url are undefined", () => {
        const mock_incoming = {
            method: undefined,
            url: undefined,
            headers: {},
        } as unknown as IncomingMessage;

        const request = new nh_request(mock_incoming);

        expect(request.method).toBe("");
        expect(request.url).toBe("/");
        expect(request.headers).toEqual({});
    });
});
