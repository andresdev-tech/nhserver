export class http_error extends Error {
    public readonly status_code: number;

    public constructor(
        status_code: number,
        message: string,
    ) {
        super(message);
        this.status_code = status_code;
        this.name = "http_error";
    }
}

export class bad_request_error extends http_error {
    public constructor(
        message: string = "Bad Request",
    ) {
        super(400, message);
        this.name = "bad_request_error";
    }
}

export class payload_too_large_error extends http_error {
    public constructor(
        message: string = "Payload Too Large",
    ) {
        super(413, message);
        this.name = "payload_too_large_error";
    }
}
