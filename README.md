# NHSERVER 🚀

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18.svg)](https://vitest.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](#)

> A lightweight, modular, and strongly-typed HTTP server framework for Node.js built with TypeScript and zero external production dependencies.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [`nh_server`](#nh_server)
  - [`nh_request`](#nh_request)
  - [`nh_response`](#nh_response)
  - [Middlewares & Pipeline](#middlewares--pipeline)
  - [HTTP Errors](#http-errors)
- [Project Architecture & Request Flow](#project-architecture--request-flow)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Roadmap & Versioning](#roadmap--versioning)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**NHSERVER** is designed to establish a solid, predictable, and extensible foundation for building web servers in Node.js. 

Rather than overloading the core with heavyweight third-party dependencies or complex magic from day one, **NHSERVER v1.1.0** focuses on high performance and developer ergonomics: **providing a clean, robust, and strongly typed REST HTTP server with dynamic routing, asynchronous multi-format body parsing (JSON, XML, URL-Encoded, Text), structured query parameter extraction, cascading middlewares, and automatic error recovery.**

The framework introduces an adapter-friendly architecture that allows future API modalities (such as GraphQL) to be integrated smoothly without bloating the core engine.

---

## ✨ Key Features

- ⚡ **Zero Production Dependencies**: Built directly on top of Node.js native `http` module for maximum speed, security, and minimal bundle footprint.
- 🔒 **Strict TypeScript Support**: 100% written in modern TypeScript with strict type checking, explicit return types, generics for payloads, and full autocompletion.
- 🎯 **Dynamic & Static Routing**: Full support for standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with parameterized dynamic paths (`/users/:id`, `/posts/:category/:slug`).
- 📦 **Multi-format Body Parsing**: Built-in, zero-dependency async parsers for `JSON`, `XML`, `x-www-form-urlencoded`, and raw `Text`, with anti-DoS payload size limits.
- 🔍 **Structured Query Parameters**: Automatic extraction of query strings (`req.query`) with support for unique keys and arrays (`?tag=ts&tag=node`).
- 🧅 **Onion Middleware Pipeline**: Async middleware chaining mechanism (`app.use()`) with `next()` execution and short-circuit capabilities for guards, auth, and loggers.
- 🛡️ **Typed HTTP Error Recovery**: Automatic `400 Bad Request` handling for malformed payloads and `500 Internal Server Error` fallbacks.
- 🧪 **100% Tested**: Comprehensive unit and integration test suite across all layers using **Vitest**.

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
| :--- | :--- |
| **Node.js (ESM)** | Native runtime environment utilizing ECMAScript Modules. |
| **TypeScript** | Type-safe development with strict compiler configuration (`strict: true`, `NodeNext`). |
| **Node Native `http`** | High-performance underlying HTTP server engine without third-party overhead. |
| **Vitest** | Next-generation testing framework for unit and integration testing. |
| **pnpm** | Fast, disk space-efficient package manager. |

---

## 📦 Installation

```bash
# Using pnpm (recommended)
pnpm add nhserver

# Using npm
npm install nhserver

# Using yarn
yarn add nhserver
```

---

## 🚀 Quick Start

Create a file named `server.ts` (or `server.js`):

```ts
import { nh_server } from "nhserver";

// 1. Initialize the server in 'rest' mode
const app = new nh_server("rest");

// 2. Register Global Middlewares
app.use(async (req, res, next) => {
    res.set_header("X-Powered-By", "NHSERVER");
    const start = Date.now();
    await next();
    console.log(`${req.method} ${req.url} - ${Date.now() - start}ms`);
});

// 3. Define Static & Dynamic Routes
app.get("/", (_req, res) => {
    res.json({
        message: "Welcome to NHSERVER v1.1.0!",
        status: "active",
    });
});

// Dynamic Route Parameters: req.params
app.get("/users/:id", (req, res) => {
    res.json({
        user_id: req.params.id,
        status: "found",
    });
});

// Structured Query Parameters: req.query
app.get("/search", (req, res) => {
    res.json({
        query: req.query,
    });
});

// Typed Request Body Parsing: req.json<T>()
interface CreateUserDto {
    name: string;
    role: string;
}

app.post("/users", async (req, res) => {
    const data = await req.json<CreateUserDto>();

    res.status(201).json({
        message: "User created successfully",
        user: data,
    });
});

// 4. Start listening on a port
const PORT = 3000;
await app.listen(PORT);

console.log(`🚀 Server running at http://localhost:${PORT}`);
```

---

## 📚 API Reference

### `nh_server`

The main application class managing the server lifecycle, middlewares, and route registration.

#### Constructor

```ts
new nh_server(mode: "rest")
```
- `mode`: The API modality. Currently, `"rest"` is supported.

#### Middleware Registration

```ts
app.use(middleware: http_middleware): void
```
Registers an asynchronous middleware function executed on every incoming request.

#### Routing Methods

```ts
app.get(path: string, handler: http_handler): void
app.post(path: string, handler: http_handler): void
app.put(path: string, handler: http_handler): void
app.patch(path: string, handler: http_handler): void
app.delete(path: string, handler: http_handler): void
```
- `path`: Static (e.g. `/users`) or Dynamic parameterized route (e.g. `/users/:id`, `/posts/:category/:slug`).
- `handler`: Asynchronous function receiving `(request: nh_request, response: nh_response)`.

#### Lifecycle Methods & Properties

- **`listen(port: number): Promise<void>`**: Starts listening on the specified port (`1` - `65535`).
- **`close(): Promise<void>`**: Gracefully shuts down the HTTP server.
- **`is_running: boolean`**: Getter returning `true` if the server is actively listening.
- **`api_mode: api_mode`**: Getter returning the initialized API mode (`"rest"`).

---

### `nh_request`

Encapsulates the incoming HTTP request with properties, query parameters, route parameters, and multi-format asynchronous body parsers.

#### Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `method` | `string` | The HTTP method (e.g., `"GET"`, `"POST"`). |
| `url` | `string` | The raw URL requested (including query string). |
| `headers` | `IncomingHttpHeaders` | Dictionary of incoming request headers. |
| `query` | `Record<string, string \| string[]>` | Structured query parameters extracted from URL. |
| `params` | `Record<string, string>` | Dynamic route parameters extracted from path (e.g. `req.params.id`). |
| `raw` | `IncomingMessage` | Direct reference to native Node.js request stream. |

#### Body Parsing Methods

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `text()` | `Promise<string>` | Reads request stream and returns raw UTF-8 text string. |
| `json<T = unknown>()` | `Promise<T>` | Parses payload as JSON. Throws `400 Bad Request` if invalid. |
| `xml<T = unknown>()` | `Promise<T>` | Parses XML payload to JS object. Throws `400 Bad Request` if invalid. |
| `form<T = Record<string, string \| string[]>>()` | `Promise<T>` | Parses `application/x-www-form-urlencoded` payloads. |
| `body<T = unknown>()` | `Promise<T>` | Auto-dispatches to the corresponding parser based on `Content-Type`. |

---

### `nh_response`

Provides a chainable, type-safe interface for formatting and sending HTTP responses.

| Method / Property | Return Type | Description |
| :--- | :--- | :--- |
| `status(code: number)` | `this` | Sets the HTTP status code (e.g., `200`, `201`, `400`, `404`). |
| `set_header(name, value)` | `this` | Sets a custom response header. |
| `send(body: string)` | `void` | Sends a plain text response (`Content-Type: text/plain; charset=utf-8`). |
| `json(body: unknown)` | `void` | Serializes and sends a JSON response (`Content-Type: application/json; charset=utf-8`). |
| `ended` | `boolean` | `true` if the response stream has finished. |
| `header_sent` | `boolean` | `true` if response headers have already been transmitted. |

---

### Middlewares & Pipeline

Middlewares follow the standard **Onion Architecture**. A middleware can inspect/modify the request/response, execute code before and after subsequent layers, or short-circuit the execution.

```ts
import type { http_middleware, next_function } from "nhserver";

const authGuard: http_middleware = async (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return; // Intercepts the request (does not call next)
    }

    await next(); // Proceeds to the next middleware / route handler
};

app.use(authGuard);
```

---

### HTTP Errors

NHSERVER provides strongly-typed error classes:

- **`http_error`**: Base class containing `status_code: number`.
- **`bad_request_error`**: HTTP `400 Bad Request` (thrown automatically on malformed JSON/XML).
- **`payload_too_large_error`**: HTTP `413 Payload Too Large` (thrown when body exceeds max limit).

---

## 📐 Project Architecture & Request Flow

```text
 Client Request
       │
       ▼
┌──────────────┐
│  Node http   │ (Native server)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ http_server  │ ──► Wraps into `nh_request` & `nh_response`
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ middleware_pipeline  │ ──► Runs global middlewares in sequence (`app.use`)
└──────┬───────────────┘
       │ [next() called]
       ▼
┌──────────────┐
│  nh_server   │ ──► Normalizes method, strips query, extracts query params
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    router    │ ──► Matches route (Static / Dynamic RegExp) & extracts `req.params`
└──────┬───────┘
       ├─────────────────────────────────────┐
       ▼ [Match Found]                       ▼ [No Match]
┌──────────────┐                      ┌──────────────┐
│ User Handler │                      │ 404 Response │ ("Not Found")
│  (req.json,  │                      └──────────────┘
│  req.xml...) │
└──────┬───────┘
       ▼
┌──────────────┐
│   Response   │ (JSON / Text sent to client)
└──────────────┘
```

---

## 📂 Project Structure

```text
nhserver/
├── src/
│   ├── core/
│   │   └── nh_server.ts        # Primary server entrypoint & facade
│   ├── http/
│   │   ├── server.ts           # Native Node http.Server wrapper & error handling
│   │   ├── request.ts          # Request abstraction (nh_request, query, params)
│   │   ├── response.ts         # Response abstraction & helpers (nh_response)
│   │   └── errors.ts           # HTTP Error classes (400, 413, generic)
│   ├── parser/
│   │   ├── body_reader.ts      # Stream consumer with size limit and caching
│   │   ├── json_parser.ts      # Safe JSON parser (syntax error recovery)
│   │   ├── xml_parser.ts       # Zero-deps XML parser (nested tags, attributes)
│   │   ├── form_parser.ts      # x-www-form-urlencoded parser
│   │   ├── query_parser.ts     # URLSearchParams query parser
│   │   └── parser.ts           # Content-Type parser dispatcher
│   ├── middleware/
│   │   ├── middleware.ts       # Middleware type definitions
│   │   └── pipeline.ts         # Cascading onion middleware runner
│   ├── router/
│   │   ├── router.ts           # Route registry & lookup
│   │   └── route.ts            # Route entity with dynamic RegExp compiler
│   ├── adapter/
│   │   └── rest.ts             # REST adapter implementation
│   └── app.ts                  # Public package composition & exports
├── test/                       # (Maintained in 'test/tests-server' branch)
│   ├── core/
│   ├── http/
│   ├── middleware/
│   ├── parser/
│   ├── router/
│   └── adapter/
├── examples/
│   └── basic_service.ts        # Complete runnable example
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

---

## 🧪 Testing

NHSERVER uses **Vitest** for automated unit and integration testing. 

> [!IMPORTANT]
> **Branch Separation for Tests**: Unit and integration test suites are maintained independently in the specialized **`test/tests-server`** branch. The `develop` and `main` branches remain clean and focus strictly on core library source code.

To run the automated tests (available in `test/tests-server`):

```bash
# Run test suite once
pnpm test

# Run tests in watch mode
pnpm run test:watch
```

---

## 🗺️ Roadmap & Versioning

NHSERVER adheres to [Semantic Versioning (SemVer)](https://semver.org/): `MAJOR.MINOR.PATCH`.

- **v1.0.0**:
  - Stable core architecture and REST mode.
  - Native HTTP server lifecycle management.
  - Static routing for `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- **v1.1.0 (Current)**:
  - Dynamic path parameters (`/users/:id`, `/posts/:category/:slug`).
  - Structured query parameter parser (`req.query`).
  - Multi-format request body parsing utilities (`req.json()`, `req.xml()`, `req.form()`, `req.text()`, `req.body()`).
  - Cascading middleware pipeline (`app.use()`, `next()`).
  - Typed HTTP error recovery (`400 Bad Request` automatic handling).
- **v2.0.0 (Planned)**:
  - Additional API modalities (GraphQL adapter integration).
  - Dual REST + GraphQL engine mode.

---

## 🤝 Contributing & Git Branching Strategy

Contributions are welcome! Please read our [**CONTRIBUTING.md**](./CONTRIBUTING.md) for full details on our branch isolation policy.

### Branch Overview

| Branch | Purpose | PR Target For |
| :--- | :--- | :--- |
| **`main`** | Production releases & tagged versions | Release PRs |
| **`develop`** | Active feature & core library development (*No test suites*) | `feature/*`, `fix/*`, `refactor/*`, `docs/*` |
| **`test/tests-server`** | Dedicated testing branch for Vitest suites | `test/*` |

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).