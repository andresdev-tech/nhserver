import { describe, expect, it, vi } from "vitest";
import type { ServerResponse } from "node:http";
import { nh_response } from "../../src/http/response.js";

function create_mock_response() {
    const headers: Record<string, string | string[]> = {};
    const mock = {
        statusCode: 200,
        headersSent: false,
        writableEnded: false,
        setHeader: vi.fn((name: string, value: string | string[]) => {
            headers[name.toLowerCase()] = value;
        }),
        hasHeader: vi.fn((name: string) => {
            return name.toLowerCase() in headers;
        }),
        end: vi.fn((_body?: string) => {
            mock.writableEnded = true;
            mock.headersSent = true;
        }),
    };
    return { mock: mock as unknown as ServerResponse, state: mock, headers };
}

describe("nh_response", () => {
    it("should set status code and return self for chaining", () => {
        const { mock, state } = create_mock_response();
        const response = new nh_response(mock);

        const result = response.status(201);

        expect(result).toBe(response);
        expect(state.statusCode).toBe(201);
    });

    it("should set custom header and return self for chaining", () => {
        const { mock, state } = create_mock_response();
        const response = new nh_response(mock);

        const result = response.set_header("X-Custom", "value");

        expect(result).toBe(response);
        expect(state.setHeader).toHaveBeenCalledWith("X-Custom", "value");
    });

    it("should send text body with default text/plain Content-Type", () => {
        const { mock, state, headers } = create_mock_response();
        const response = new nh_response(mock);

        response.send("Hello World");

        expect(headers["content-type"]).toBe("text/plain; charset=utf-8");
        expect(state.end).toHaveBeenCalledWith("Hello World");
        expect(response.ended).toBe(true);
        expect(response.header_sent).toBe(true);
    });

    it("should respect preexisting Content-Type header on send()", () => {
        const { mock, state, headers } = create_mock_response();
        const response = new nh_response(mock);

        response.set_header("Content-Type", "text/html");
        response.send("<h1>Hello</h1>");

        expect(headers["content-type"]).toBe("text/html");
        expect(state.end).toHaveBeenCalledWith("<h1>Hello</h1>");
    });

    it("should send json body with application/json Content-Type", () => {
        const { mock, state, headers } = create_mock_response();
        const response = new nh_response(mock);

        response.json({ message: "success", count: 42 });

        expect(headers["content-type"]).toBe("application/json; charset=utf-8");
        expect(state.end).toHaveBeenCalledWith(
            JSON.stringify({ message: "success", count: 42 }),
        );
        expect(response.ended).toBe(true);
    });

    it("should not send again if response has already ended", () => {
        const { mock, state } = create_mock_response();
        const response = new nh_response(mock);

        response.send("First");
        response.send("Second");
        response.json({ duplicate: true });

        expect(state.end).toHaveBeenCalledTimes(1);
        expect(state.end).toHaveBeenCalledWith("First");
    });
});
