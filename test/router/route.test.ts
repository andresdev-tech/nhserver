import { describe, expect, it, vi } from "vitest";
import { route } from "../../src/router/route.js";

describe("route", () => {
    it("should correctly initialize with method, path, and handler", () => {
        const handler = vi.fn();
        const test_route = new route("GET", "/users", handler);

        expect(test_route.method).toBe("GET");
        expect(test_route.path).toBe("/users");
        expect(test_route.handler).toBe(handler);
    });

    it("should return true when method and path match exactly", () => {
        const handler = vi.fn();
        const test_route = new route("POST", "/api/items", handler);

        expect(test_route.matches("POST", "/api/items")).toBe(true);
    });

    it("should return false when method does not match", () => {
        const handler = vi.fn();
        const test_route = new route("GET", "/api/items", handler);

        expect(test_route.matches("POST", "/api/items")).toBe(false);
    });

    it("should return false when path does not match", () => {
        const handler = vi.fn();
        const test_route = new route("GET", "/api/items", handler);

        expect(test_route.matches("GET", "/api/other")).toBe(false);
    });

    it("should match dynamic routes and extract parameter values", () => {
        const handler = vi.fn();
        const test_route = new route("GET", "/users/:id/posts/:slug", handler);

        const result = test_route.match("GET", "/users/42/posts/hello-world");
        expect(result.matched).toBe(true);
        expect(result.params).toEqual({
            id: "42",
            slug: "hello-world",
        });
    });

    it("should correctly decode percent-encoded dynamic parameters", () => {
        const handler = vi.fn();
        const test_route = new route("GET", "/search/:term", handler);

        const result = test_route.match("GET", "/search/hello%20world");
        expect(result.matched).toBe(true);
        expect(result.params).toEqual({
            term: "hello world",
        });
    });
});
