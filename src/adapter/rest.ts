import {
    type http_handler,
} from "../http/server.ts";

import {
    router,
} from "../router/router.ts";

import type {
    http_method,
} from "../router/route.ts";

export class rest_adapter {
    private readonly router: router;

    public constructor(
        router_instance: router,
    ) {
        this.router =
            router_instance;
    }

    public add_route(
        method: http_method,
        path: string,
        handler: http_handler,
    ): void {
        this.router.add_route(
            method,
            path,
            handler,
        );
    }

    public find_route(
        method: http_method,
        path: string,
    ) {
        return this.router.find_route(
            method,
            path,
        );
    }
}