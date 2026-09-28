import { describe, expect, it, vi } from "vitest";
import { router } from "../../src/router/router.js";

describe("router", () => {
    it("should add and find a matching route", () => {
        const test_router = new router();
        const handler = vi.fn();

        test_router.add_route("GET", "/test", handler);
        const found = test_router.find_route("GET", "/test");

        expect(found).toBeDefined();
        expect(found?.route.method).toBe("GET");
        expect(found?.route.path).toBe("/test");
        expect(found?.route.handler).toBe(handler);
        expect(found?.params).toEqual({});
    });

    it("should return undefined when no route matches", () => {
        const test_router = new router();
        test_router.add_route("GET", "/test", vi.fn());

        expect(test_router.find_route("POST", "/test")).toBeUndefined();
        expect(test_router.find_route("GET", "/unknown")).toBeUndefined();
    });

    it("should distinguish multiple routes with different methods or paths", () => {
        const test_router = new router();
        const get_handler = vi.fn();
        const post_handler = vi.fn();
        const users_handler = vi.fn();

        test_router.add_route("GET", "/items", get_handler);
        test_router.add_route("POST", "/items", post_handler);
        test_router.add_route("GET", "/users", users_handler);

        expect(test_router.find_route("GET", "/items")?.route.handler).toBe(get_handler);
        expect(test_router.find_route("POST", "/items")?.route.handler).toBe(post_handler);
        expect(test_router.find_route("GET", "/users")?.route.handler).toBe(users_handler);
    });

    it("should find and extract params from dynamic routes", () => {
        const test_router = new router();
        const user_handler = vi.fn();

        test_router.add_route("GET", "/users/:id", user_handler);

        const match = test_router.find_route("GET", "/users/123");
        expect(match).toBeDefined();
        expect(match?.route.handler).toBe(user_handler);
        expect(match?.params).toEqual({ id: "123" });
    });
});
