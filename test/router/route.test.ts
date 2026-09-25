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
});
