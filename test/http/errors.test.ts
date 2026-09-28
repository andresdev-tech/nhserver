import { describe, expect, it } from "vitest";
import {
    http_error,
    bad_request_error,
    payload_too_large_error,
} from "../../src/http/errors.js";

describe("http_errors", () => {
    it("should instantiate http_error with custom status and message", () => {
        const error = new http_error(403, "Forbidden");
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(http_error);
        expect(error.status_code).toBe(403);
        expect(error.message).toBe("Forbidden");
        expect(error.name).toBe("http_error");
    });

    it("should instantiate bad_request_error with default and custom message", () => {
        const default_error = new bad_request_error();
        expect(default_error.status_code).toBe(400);
        expect(default_error.message).toBe("Bad Request");

        const custom_error = new bad_request_error("Invalid payload");
        expect(custom_error.status_code).toBe(400);
        expect(custom_error.message).toBe("Invalid payload");
    });

    it("should instantiate payload_too_large_error with status 413", () => {
        const error = new payload_too_large_error("Max size exceeded");
        expect(error.status_code).toBe(413);
        expect(error.message).toBe("Max size exceeded");
    });
});
