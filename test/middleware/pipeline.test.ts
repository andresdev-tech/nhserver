import { describe, expect, it, vi } from "vitest";
import { middleware_pipeline } from "../../src/middleware/pipeline.js";
import type { nh_request } from "../../src/http/request.js";
import type { nh_response } from "../../src/http/response.js";

describe("middleware_pipeline", () => {
    it("should execute middlewares in sequence and call final handler", async () => {
        const pipeline = new middleware_pipeline();
        const execution_order: string[] = [];

        pipeline.use(async (_req, _res, next) => {
            execution_order.push("m1_in");
            await next();
            execution_order.push("m1_out");
        });

        pipeline.use(async (_req, _res, next) => {
            execution_order.push("m2_in");
            await next();
            execution_order.push("m2_out");
        });

        const final_handler = vi.fn().mockImplementation(() => {
            execution_order.push("handler");
        });

        await pipeline.execute({} as nh_request, {} as nh_response, final_handler);

        expect(final_handler).toHaveBeenCalledTimes(1);
        expect(execution_order).toEqual([
            "m1_in",
            "m2_in",
            "handler",
            "m2_out",
            "m1_out",
        ]);
    });

    it("should short-circuit and not call final handler if next() is omitted", async () => {
        const pipeline = new middleware_pipeline();
        const final_handler = vi.fn();

        pipeline.use(async () => {
            // Does not call next()
        });

        await pipeline.execute({} as nh_request, {} as nh_response, final_handler);

        expect(final_handler).not.toHaveBeenCalled();
    });

    it("should throw error if next() is called multiple times in same middleware", async () => {
        const pipeline = new middleware_pipeline();

        pipeline.use(async (_req, _res, next) => {
            await next();
            await next();
        });

        await expect(
            pipeline.execute({} as nh_request, {} as nh_response, () => {}),
        ).rejects.toThrow("next() called multiple times");
    });
});
