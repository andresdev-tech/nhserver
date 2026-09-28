import { describe, expect, it } from "vitest";
import { Readable } from "node:stream";
import type { IncomingMessage } from "node:http";
import { nh_request } from "../../src/http/request.js";

function mock_incoming_message(options: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: string;
}): IncomingMessage {
    const stream = Readable.from(options.body ? [Buffer.from(options.body)] : []);
    const req = stream as unknown as IncomingMessage;
    req.method = options.method;
    req.url = options.url;
    req.headers = options.headers ?? {};
    req.pause = () => req;
    return req;
}

describe("nh_request", () => {
    it("should initialize with values from IncomingMessage", () => {
        const mock_incoming = mock_incoming_message({
            method: "POST",
            url: "/api/test?page=1",
            headers: {
                "content-type": "application/json",
                authorization: "Bearer token",
            },
        });

        const request = new nh_request(mock_incoming);

        expect(request.method).toBe("POST");
        expect(request.url).toBe("/api/test?page=1");
        expect(request.headers).toEqual({
            "content-type": "application/json",
            authorization: "Bearer token",
        });
        expect(request.query).toEqual({ page: "1" });
        expect(request.params).toEqual({});
    });

    it("should provide fallback defaults when method or url are undefined", () => {
        const mock_incoming = mock_incoming_message({});

        const request = new nh_request(mock_incoming);

        expect(request.method).toBe("");
        expect(request.url).toBe("/");
        expect(request.headers).toEqual({});
        expect(request.query).toEqual({});
        expect(request.params).toEqual({});
    });

    it("should read and parse JSON body", async () => {
        const mock_incoming = mock_incoming_message({
            body: JSON.stringify({ hello: "world" }),
        });

        const request = new nh_request(mock_incoming);
        const data = await request.json<{ hello: string }>();

        expect(data).toEqual({ hello: "world" });
    });

    it("should read and parse XML body", async () => {
        const mock_incoming = mock_incoming_message({
            body: "<tag>content</tag>",
        });

        const request = new nh_request(mock_incoming);
        const data = await request.xml<{ tag: string }>();

        expect(data).toEqual({ tag: "content" });
    });

    it("should read and parse Form body", async () => {
        const mock_incoming = mock_incoming_message({
            body: "a=1&b=2",
        });

        const request = new nh_request(mock_incoming);
        const data = await request.form();

        expect(data).toEqual({ a: "1", b: "2" });
    });

    it("should auto-parse body according to content-type header", async () => {
        const mock_incoming = mock_incoming_message({
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ auto: true }),
        });

        const request = new nh_request(mock_incoming);
        const data = await request.body<{ auto: boolean }>();

        expect(data).toEqual({ auto: true });
    });

    it("should set and update route params", () => {
        const mock_incoming = mock_incoming_message({ url: "/users/100" });
        const request = new nh_request(mock_incoming);

        request.set_params({ id: "100" });
        expect(request.params).toEqual({ id: "100" });
    });
});
