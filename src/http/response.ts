import type { ServerResponse } from "node:http";

export class nh_response {
    private readonly response: ServerResponse;

    public constructor(response: ServerResponse) {
        this.response = response;
    }

    public status(status_code: number): this {
        this.response.statusCode = status_code;

        return this;
    }

    public set_header(
        name: string,
        value: string | string[],
    ): this {
        this.response.setHeader(name, value);

        return this;
    }

    public send(body: string): void {
        if (this.response.writableEnded) {
            return;
        }

        if (!this.response.hasHeader("Content-Type")) {
            this.response.setHeader(
                "Content-Type",
                "text/plain; charset=utf-8",
            );
        }

        this.response.end(body);
    }

    public json(body: unknown): void {
        if (this.response.writableEnded) {
            return;
        }

        this.response.setHeader(
            "Content-Type",
            "application/json; charset=utf-8",
        );

        this.response.end(JSON.stringify(body));
    }

    public get header_sent(): boolean {
        return this.response.headersSent;
    }

    public get ended(): boolean {
        return this.response.writableEnded;
    }
}