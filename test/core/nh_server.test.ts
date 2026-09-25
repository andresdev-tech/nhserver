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

        it("should correctly handle query parameters by ignoring them in route matching", async () => {
            const app = new nh_server("rest");
            const port = 46002;

            app.get("/search", (req, res) => {
                res.json({ url: req.url });
            });

            await app.listen(port);

            const response = await fetch(
                `http://127.0.0.1:${port}/search?keyword=vitest&page=1`,
            );
            expect(response.status).toBe(200);
            const body = await response.json();
            expect(body).toEqual({
                url: "/search?keyword=vitest&page=1",
            });

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
