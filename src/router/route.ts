import type { http_handler } from "../http/server.js";

export type http_method =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

export class route {
    public readonly method: http_method;
    public readonly path: string;
    public readonly handler: http_handler;

    public constructor(
        method: http_method,
        path: string,
        handler: http_handler,
    ) {
        this.method = method;
        this.path = path;
        this.handler = handler;
    }

    public matches(
        method: http_method,
        path: string,
    ): boolean {
        return (
            this.method === method &&
            this.path === path
        );
    }
}