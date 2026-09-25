import {
    http_server,
    type http_handler,
} from "../http/server.js";

import {
    router,
} from "../router/router.js";

import type {
    http_method,
} from "../router/route.js";

export type api_mode = "rest";

export class nh_server {
    private readonly mode: api_mode;

    private readonly router: router;

    private readonly http_server: http_server;

    public constructor(mode: api_mode) {
        this.validate_mode(mode);

        this.mode = mode;

        this.router = new router();

        this.http_server = new http_server();

        this.http_server.set_handler(
            async (request, response) => {
                const request_method =
                    request.method.toUpperCase();

                const request_path =
                    request.url.split("?")[0];

                const route =
                    this.router.find_route(
                        request_method as http_method,
                        request_path,
                    );

                if (!route) {
                    response
                        .status(404)
                        .send("Not Found");

                    return;
                }

                await route.handler(
                    request,
                    response,
                );
            },
        );
    }

    public get(
        path: string,
        handler: http_handler,
    ): void {
        this.router.add_route(
            "GET",
            path,
            handler,
        );
    }

    public post(
        path: string,
        handler: http_handler,
    ): void {
        this.router.add_route(
            "POST",
            path,
            handler,
        );
    }

    public put(
        path: string,
        handler: http_handler,
    ): void {
        this.router.add_route(
            "PUT",
            path,
            handler,
        );
    }

    public patch(
        path: string,
        handler: http_handler,
    ): void {
        this.router.add_route(
            "PATCH",
            path,
            handler,
        );
    }

    public delete(
        path: string,
        handler: http_handler,
    ): void {
        this.router.add_route(
            "DELETE",
            path,
            handler,
        );
    }

    public async listen(
        port: number,
    ): Promise<void> {
        await this.http_server.listen(port);
    }

    public async close(): Promise<void> {
        await this.http_server.close();
    }

    public get is_running(): boolean {
        return this.http_server.is_running;
    }

    public get api_mode(): api_mode {
        return this.mode;
    }

    private validate_mode(
        mode: api_mode,
    ): void {
        if (mode !== "rest") {
            throw new Error(
                `Unsupported API mode: ${mode}`,
            );
        }
    }
}