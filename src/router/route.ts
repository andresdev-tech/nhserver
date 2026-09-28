import type { http_handler } from "../http/server.ts";

export type http_method =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

export interface route_match_result {
    matched: boolean;
    params: Record<string, string>;
}

export class route {
    public readonly method: http_method;
    public readonly path: string;
    public readonly handler: http_handler;

    private readonly is_dynamic: boolean;
    private readonly param_names: string[] = [];
    private readonly regex: RegExp | undefined;

    public constructor(
        method: http_method,
        path: string,
        handler: http_handler,
    ) {
        this.method = method;
        this.path = path;
        this.handler = handler;

        if (path.includes(":")) {
            this.is_dynamic = true;
            this.regex = this.compile_path(path);
        } else {
            this.is_dynamic = false;
        }
    }

    public matches(
        method: http_method,
        path: string,
    ): boolean {
        return this.match(method, path).matched;
    }

    public match(
        method: http_method,
        path: string,
    ): route_match_result {
        if (this.method !== method) {
            return { matched: false, params: {} };
        }

        if (!this.is_dynamic) {
            return {
                matched: this.path === path,
                params: {},
            };
        }

        if (!this.regex) {
            return { matched: false, params: {} };
        }

        const match = this.regex.exec(path);

        if (!match) {
            return { matched: false, params: {} };
        }

        const params: Record<string, string> = {};

        for (let i = 0; i < this.param_names.length; i++) {
            const param_name = this.param_names[i];
            const raw_value = match[i + 1] ?? "";
            try {
                params[param_name] = decodeURIComponent(raw_value);
            } catch {
                params[param_name] = raw_value;
            }
        }

        return {
            matched: true,
            params,
        };
    }

    private compile_path(path: string): RegExp {
        const segments = path.split("/");

        const pattern = segments
            .map((segment) => {
                if (segment.startsWith(":")) {
                    const param_name = segment.slice(1);
                    this.param_names.push(param_name);

                    return "([^/]+)";
                }

                return this.escape_regex(segment);
            })
            .join("/");

        return new RegExp(`^${pattern}$`);
    }

    private escape_regex(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}