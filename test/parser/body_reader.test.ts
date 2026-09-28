import { describe, expect, it } from "vitest";
import { Readable } from "node:stream";
import type { IncomingMessage } from "node:http";
import { body_reader } from "../../src/parser/body_reader.js";
import { payload_too_large_error } from "../../src/http/errors.js";

function create_mock_request(chunks: string[]): IncomingMessage {
    const stream = Readable.from(chunks.map((c) => Buffer.from(c)));
    const req = stream as unknown as IncomingMessage;
    req.pause = () => req;
    return req;
}

describe("body_reader", () => {
    it("should read stream and return text and buffer", async () => {
        const mock_req = create_mock_request(["hello ", "world"]);
        const reader = new body_reader(mock_req);

        const text = await reader.read_text();
        expect(text).toBe("hello world");

        // Verify cache
        const buffer = await reader.read_buffer();
        expect(buffer.toString("utf-8")).toBe("hello world");
    });

    it("should throw payload_too_large_error if stream exceeds max size limit", async () => {
        const mock_req = create_mock_request(["1234567890"]);
        const reader = new body_reader(mock_req, 5); // Max 5 bytes

        await expect(reader.read_text()).rejects.toThrow(payload_too_large_error);
    });
});
