import {
    createServer,
    type IncomingMessage,
    type Server as node_server,
    type ServerResponse,
} from "node:http";

import { nh_request } from "./request.js";
import { nh_response } from "./response.js";

export type http_handler = (
    request: nh_request,
    response: nh_response,
) => void | Promise<void>;

export class http_server {
    private readonly server: node_server;

    private handler: http_handler | undefined;

    private running: boolean = false;

    public constructor() {
        this.server = createServer(
            (request, response) => {
                void this.handle_request(
                    request,
                    response,
                );
            },
        );
    }

    public set_handler(
        handler: http_handler,
    ): void {
        this.handler = handler;
    }

    public async listen(
        port: number,
    ): Promise<void> {
        this.validate_port(port);

        if (this.running) {
            throw new Error(
                "HTTP server is already running.",
            );
        }

        await new Promise<void>(
            (resolve, reject) => {
                const handle_error = (
                    error: Error,
                ): void => {
                    this.server.removeListener(
                        "listening",
                        handle_listening,
                    );

                    reject(error);
                };

                const handle_listening = (): void => {
                    this.server.removeListener(
                        "error",
                        handle_error,
                    );

                    this.running = true;

                    resolve();
                };

                this.server.once(
                    "error",
                    handle_error,
                );

                this.server.once(
                    "listening",
                    handle_listening,
                );

                this.server.listen(port);
            },
        );
    }

    public async close(): Promise<void> {
        if (!this.running) {
            return;
        }

        await new Promise<void>(
            (resolve, reject) => {
                this.server.close(
                    (error) => {
                        if (error) {
                            reject(error);

                            return;
                        }

                        this.running = false;

                        resolve();
                    },
                );
            },
        );
    }

    public get is_running(): boolean {
        return this.running;
    }

    private async handle_request(
        request: IncomingMessage,
        response: ServerResponse,
    ): Promise<void> {
        const request_instance =
            new nh_request(request);

        const response_instance =
            new nh_response(response);

        if (!this.handler) {
            response_instance
                .status(404)
                .send("Not Found");

            return;
        }

        try {
            await this.handler(
                request_instance,
                response_instance,
            );
        } catch {
            if (!response_instance.ended) {
                response_instance
                    .status(500)
                    .json({
                        error:
                            "Internal Server Error",
                    });
            }
        }
    }

    private validate_port(
        port: number,
    ): void {
        if (!Number.isInteger(port)) {
            throw new TypeError(
                "Port must be an integer.",
            );
        }

        if (
            port < 1 ||
            port > 65535
        ) {
            throw new RangeError(
                "Port must be between 1 and 65535.",
            );
        }
    }
}