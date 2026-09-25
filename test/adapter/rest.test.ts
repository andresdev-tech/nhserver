import { describe, expect, it, vi } from "vitest";
import { rest_adapter } from "../../src/adapter/rest.js";
import { router } from "../../src/router/router.js";

describe("rest_adapter", () => {
    it("should delegate route addition and route finding to router", () => {
        const underlying_router = new router();
        const adapter = new rest_adapter(underlying_router);
        const handler = vi.fn();

        adapter.add_route("GET", "/api/v1/users", handler);
        const matched = adapter.find_route("GET", "/api/v1/users");

        expect(matched).toBeDefined();
        expect(matched?.method).toBe("GET");
        expect(matched?.path).toBe("/api/v1/users");
        expect(matched?.handler).toBe(handler);
    });

    it("should return undefined for unmatched routes", () => {
        const underlying_router = new router();
        const adapter = new rest_adapter(underlying_router);

        expect(adapter.find_route("POST", "/missing")).toBeUndefined();
    });
});
