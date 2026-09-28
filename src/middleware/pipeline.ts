import type { nh_request } from "../http/request.ts";
import type { nh_response } from "../http/response.ts";
import type { http_middleware } from "./middleware.ts";

export class middleware_pipeline {
    private readonly middlewares: http_middleware[] = [];

    public use(middleware: http_middleware): void {
        this.middlewares.push(middleware);
    }

    public async execute(
        request: nh_request,
        response: nh_response,
        final_handler: () => Promise<void> | void,
    ): Promise<void> {
        let index = -1;

        const dispatch = async (i: number): Promise<void> => {
            if (i <= index) {
                throw new Error("next() called multiple times in middleware pipeline.");
            }

            index = i;

            if (i === this.middlewares.length) {
                await final_handler();
                return;
            }

            const middleware = this.middlewares[i];

            await middleware(
                request,
                response,
                () => dispatch(i + 1),
            );
        };

        await dispatch(0);
    }
}
