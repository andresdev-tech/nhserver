import type {
    IncomingHttpHeaders,
    IncomingMessage,
} from "node:http";

export class nh_request {
    public readonly method: string;
    public readonly url: string;
    public readonly headers: IncomingHttpHeaders;

    public constructor(request: IncomingMessage) {
        this.method = request.method ?? "";
        this.url = request.url ?? "/";
        this.headers = request.headers;
    }
}