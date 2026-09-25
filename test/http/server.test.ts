import { describe, expect, it } from "vitest";
import { http_server } from "../../src/http/server.js";

describe("http_server", () => {
    it("should throw TypeError for invalid port types", async () => {
        const server = new http_server();

        await expect(server.listen(NaN as unknown as number)).rejects.toThrow(
            TypeError,
        );
        await expect(server.listen(3000.5)).rejects.toThrow(TypeError);
    });

    it("should throw RangeError for ports out of range", async () => {
        const server = new http_server();

        await expect(server.listen(0)).rejects.toThrow(RangeError);
        await expect(server.listen(-1)).rejects.toThrow(RangeError);
        await expect(server.listen(65536)).rejects.toThrow(RangeError);
        await expect(server.listen(70000)).rejects.toThrow(RangeError);
    });

    it("should listen and close properly on a valid port", async () => {
        const server = new http_server();
        expect(server.is_running).toBe(false);

        const test_port = 45123;
        await server.listen(test_port);
        expect(server.is_running).toBe(true);

        // Attempting to listen again while running should reject
        await expect(server.listen(test_port)).rejects.toThrow(
            "HTTP server is already running.",
        );

        await server.close();
        expect(server.is_running).toBe(false);

        // Closing when already closed should safely resolve
        await expect(server.close()).resolves.toBeUndefined();
    });

    it("should catch errors thrown in handler and respond with 500", async () => {
        const server = new http_server();
        server.set_handler(() => {
            throw new Error("Unexpected crash");
        });

        const test_port = 45124;
        await server.listen(test_port);

        const response = await fetch(`http://127.0.0.1:${test_port}/crash`);
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json).toEqual({ error: "Internal Server Error" });

        await server.close();
    });

    it("should return 404 if no handler is set", async () => {
        const server = new http_server();
        const test_port = 45125;
        await server.listen(test_port);

        const response = await fetch(`http://127.0.0.1:${test_port}/test`);
        const text = await response.text();

        expect(response.status).toBe(404);
        expect(text).toBe("Not Found");

        await server.close();
    });
});
