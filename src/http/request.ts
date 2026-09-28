import type {
    IncomingHttpHeaders,
    IncomingMessage,
} from "node:http";

import { body_reader } from "../parser/body_reader.ts";
import { parse_json } from "../parser/json_parser.ts";
import { parse_xml } from "../parser/xml_parser.ts";
import { parse_form } from "../parser/form_parser.ts";
import { parse_body_by_content_type } from "../parser/parser.ts";
import {
    parse_query,
    type query_params,
} from "../parser/query_parser.ts";

export class nh_request {
    public readonly method: string;
    public readonly url: string;
    public readonly headers: IncomingHttpHeaders;
    public readonly query: query_params;
    public params: Record<string, string> = {};

    private readonly raw_request: IncomingMessage;
    private readonly reader: body_reader;

    public constructor(request: IncomingMessage) {
        this.method = request.method ?? "";
        this.url = request.url ?? "/";
        this.headers = request.headers;
        this.query = parse_query(this.url);
        this.raw_request = request;
        this.reader = new body_reader(request);
    }

    public set_params(
        params: Record<string, string>,
    ): void {
        this.params = params;
    }

    public get raw(): IncomingMessage {
        return this.raw_request;
    }

    public async text(): Promise<string> {
        return this.reader.read_text();
    }

    public async json<T = unknown>(): Promise<T> {
        const raw_text = await this.text();

        return parse_json<T>(raw_text);
    }

    public async xml<T = unknown>(): Promise<T> {
        const raw_text = await this.text();

        return parse_xml<T>(raw_text);
    }

    public async form<
        T = Record<string, string | string[]>,
    >(): Promise<T> {
        const raw_text = await this.text();

        return parse_form<T>(raw_text);
    }

    public async body<T = unknown>(): Promise<T> {
        const raw_text = await this.text();
        const content_type =
            this.headers["content-type"] ?? "";

        return parse_body_by_content_type<T>(
            raw_text,
            content_type,
        );
    }
}