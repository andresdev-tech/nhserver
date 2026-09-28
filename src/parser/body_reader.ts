import type { IncomingMessage } from "node:http";
import { payload_too_large_error } from "../http/errors.ts";

export const DEFAULT_MAX_BODY_SIZE = 1024 * 1024; // 1 MB

export class body_reader {
    private readonly request: IncomingMessage;
    private readonly max_size: number;
    private cached_buffer: Buffer | undefined;
    private cached_text: string | undefined;

    public constructor(
        request: IncomingMessage,
        max_size: number = DEFAULT_MAX_BODY_SIZE,
    ) {
        this.request = request;
        this.max_size = max_size;
    }

    public async read_buffer(): Promise<Buffer> {
        if (this.cached_buffer !== undefined) {
            return this.cached_buffer;
        }

        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            let received_bytes = 0;

            const on_data = (chunk: Buffer): void => {
                received_bytes += chunk.length;

                if (received_bytes > this.max_size) {
                    cleanup();
                    this.request.pause();
                    reject(
                        new payload_too_large_error(
                            `Payload exceeds maximum limit of ${this.max_size} bytes.`,
                        ),
                    );
                    return;
                }

                chunks.push(chunk);
            };

            const on_end = (): void => {
                cleanup();
                this.cached_buffer = Buffer.concat(chunks);
                resolve(this.cached_buffer);
            };

            const on_error = (error: Error): void => {
                cleanup();
                reject(error);
            };

            const cleanup = (): void => {
                this.request.removeListener("data", on_data);
                this.request.removeListener("end", on_end);
                this.request.removeListener("error", on_error);
            };

            // If the stream has already ended or is not readable
            if (this.request.readableEnded) {
                this.cached_buffer = Buffer.concat(chunks);
                resolve(this.cached_buffer);
                return;
            }

            this.request.on("data", on_data);
            this.request.once("end", on_end);
            this.request.once("error", on_error);
        });
    }

    public async read_text(): Promise<string> {
        if (this.cached_text !== undefined) {
            return this.cached_text;
        }

        const buffer = await this.read_buffer();
        this.cached_text = buffer.toString("utf-8");
        return this.cached_text;
    }
}
