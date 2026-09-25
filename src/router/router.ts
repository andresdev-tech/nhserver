import type { http_handler } from "../http/server.js";

import {
    route,
    type http_method,
} from "./route.js";

export class router {
    private readonly routes: route[] = [];

    public add_route(
        method: http_method,
        path: string,
        handler: http_handler,
    ): void {
        const new_route = new route(
            method,
            path,
            handler,
        );

        this.routes.push(new_route);
    }

    public find_route(
        method: http_method,
        path: string,
    ): route | undefined {
        return this.routes.find(
            (current_route) =>
                current_route.matches(
                    method,
                    path,
                ),
        );
    }
}