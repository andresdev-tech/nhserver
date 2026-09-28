import type { http_handler } from "../http/server.ts";

import {
    route,
    type http_method,
} from "./route.ts";

export interface route_match {
    route: route;
    params: Record<string, string>;
}

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
    ): route_match | undefined {
        for (const current_route of this.routes) {
            const match_result =
                current_route.match(
                    method,
                    path,
                );

            if (match_result.matched) {
                return {
                    route: current_route,
                    params: match_result.params,
                };
            }
        }

        return undefined;
    }
}