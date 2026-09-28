import type { nh_request } from "../http/request.ts";
import type { nh_response } from "../http/response.ts";

export type next_function = () => Promise<void> | void;

export type http_middleware = (
    request: nh_request,
    response: nh_response,
    next: next_function,
) => Promise<void> | void;
