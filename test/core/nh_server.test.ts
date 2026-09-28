import { describe, expect, it } from "vitest";
import { nh_server, type api_mode } from "../../src/core/nh_server.js";

describe("nh_server", () => {
    describe("initialization and validation", () => {
        it("should instantiate successfully with 'rest' mode", () => {
            const app = new nh_server("rest");

            expect(app).toBeInstanceOf(nh_server);
            expect(app.api_mode).toBe("rest");
            expect(app.is_running).toBe(false);
        });

        it("should throw an error for unsupported API modes", () => {
            expect(() => {
                new nh_server("graphql" as api_mode);
            }).toThrow("Unsupported API mode: graphql");
        });
    });

    describe("HTTP methods and routing integration", () => {
        it("should register and handle GET, POST, PUT, PATCH, DELETE requests", async () => {
            const app = new nh_server("rest");
            const port = 46001;

            app.get("/items", (_req, res) => {
                res.status(200).json({ action: "get_items" });
            });

            app.post("/items", (_req, res) => {
                res.status(201).json({ action: "created_item" });
            });

            app.put("/items", (_req, res) => {
                res.status(200).json({ action: "updated_item" });
            });

            app.patch("/items", (_req, res) => {
                res.status(200).json({ action: "patched_item" });
            });

            app.delete("/items", (_req, res) => {
                res.status(200).json({ action: "deleted_item" });
            });

            await app.listen(port);
            expect(app.is_running).toBe(true);

            // Test GET
            const get_res = await fetch(`http://127.0.0.1:${port}/items`);
            expect(get_res.status).toBe(200);
            expect(await get_res.json()).toEqual({ action: "get_items" });

            // Test POST
            const post_res = await fetch(`http://127.0.0.1:${port}/items`, {
                method: "POST",
            });
            expect(post_res.status).toBe(201);
            expect(await post_res.json()).toEqual({ action: "created_item" });

            // Test PUT
            const put_res = await fetch(`http://127.0.0.1:${port}/items`, {
                method: "PUT",
            });
            expect(put_res.status).toBe(200);
            expect(await put_res.json()).toEqual({ action: "updated_item" });

            // Test PATCH
            const patch_res = await fetch(`http://127.0.0.1:${port}/items`, {
                method: "PATCH",
            });
            expect(patch_res.status).toBe(200);
            expect(await patch_res.json()).toEqual({ action: "patched_item" });

            // Test DELETE
            const delete_res = await fetch(`http://127.0.0.1:${port}/items`, {
                method: "DELETE",
            });
            expect(delete_res.status).toBe(200);
            expect(await delete_res.json()).toEqual({ action: "deleted_item" });

            await app.close();
            expect(app.is_running).toBe(false);
        });

        it("should correctly handle structured query parameters", async () => {
            const app = new nh_server("rest");
            const port = 46002;

            app.get("/search", (req, res) => {
                res.json({ query: req.query });
            });

            await app.listen(port);

            const response = await fetch(
                `http://127.0.0.1:${port}/search?keyword=vitest&page=1`,
            );
            expect(response.status).toBe(200);
            const body = await response.json();
            expect(body).toEqual({
                query: { keyword: "vitest", page: "1" },
            });

            await app.close();
        });

        it("should handle dynamic path parameters", async () => {
            const app = new nh_server("rest");
            const port = 46005;

            app.get("/users/:userId/books/:bookId", (req, res) => {
                res.json({
                    userId: req.params.userId,
                    bookId: req.params.bookId,
                });
            });

            await app.listen(port);

            const response = await fetch(
                `http://127.0.0.1:${port}/users/u123/books/b456`,
            );
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({
                userId: "u123",
                bookId: "b456",
            });

            await app.close();
        });

        it("should parse incoming request JSON body", async () => {
            const app = new nh_server("rest");
            const port = 46006;

            app.post("/api/user", async (req, res) => {
                const data = await req.json<{ username: string }>();
                res.status(201).json({ created: data.username });
            });

            await app.listen(port);

            const response = await fetch(`http://127.0.0.1:${port}/api/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: "andres" }),
            });
            expect(response.status).toBe(201);
            expect(await response.json()).toEqual({ created: "andres" });

            await app.close();
        });

        it("should return 400 Bad Request when JSON body is malformed", async () => {
            const app = new nh_server("rest");
            const port = 46007;

            app.post("/api/user", async (req, res) => {
                await req.json();
                res.send("OK");
            });

            await app.listen(port);

            const response = await fetch(`http://127.0.0.1:${port}/api/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: '{"invalid": json',
            });
            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({
                error: "Invalid JSON payload.",
                status_code: 400,
            });

            await app.close();
        });

        it("should execute global middleware pipeline", async () => {
            const app = new nh_server("rest");
            const port = 46008;

            app.use(async (req, res, next) => {
                res.set_header("X-Framework", "NHSERVER");
                if (req.url === "/blocked") {
                    res.status(403).json({ error: "Access Denied" });
                    return;
                }
                await next();
            });

            app.get("/allowed", (_req, res) => {
                res.json({ access: "granted" });
            });

            app.get("/blocked", (_req, res) => {
                res.json({ access: "should_not_reach" });
            });

            await app.listen(port);

            // Allowed
            const r_allowed = await fetch(`http://127.0.0.1:${port}/allowed`);
            expect(r_allowed.status).toBe(200);
            expect(r_allowed.headers.get("x-framework")).toBe("NHSERVER");
            expect(await r_allowed.json()).toEqual({ access: "granted" });

            // Blocked by middleware
            const r_blocked = await fetch(`http://127.0.0.1:${port}/blocked`);
            expect(r_blocked.status).toBe(403);
            expect(await r_blocked.json()).toEqual({ error: "Access Denied" });

            await app.close();
        });

        it("should return 404 for non-existent routes", async () => {
            const app = new nh_server("rest");
            const port = 46003;

            app.get("/hello", (_req, res) => {
                res.send("Hello");
            });

            await app.listen(port);

            const response = await fetch(`http://127.0.0.1:${port}/non-existent`);
            expect(response.status).toBe(404);
            expect(await response.text()).toBe("Not Found");

            await app.close();
        });

        it("should return 500 when handler throws an unhandled exception", async () => {
            const app = new nh_server("rest");
            const port = 46004;

            app.get("/broken", () => {
                throw new Error("Something broke inside handler");
            });

            await app.listen(port);

            const response = await fetch(`http://127.0.0.1:${port}/broken`);
            expect(response.status).toBe(500);
            expect(await response.json()).toEqual({
                error: "Internal Server Error",
            });

            await app.close();
        });
    });
});
