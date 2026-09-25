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
- [Project Architecture & Request Flow](#project-architecture--request-flow)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Roadmap & Versioning](#roadmap--versioning)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**NHSERVER** is designed to establish a solid, predictable, and extensible foundation for building web servers in Node.js. 

Rather than overloading the core with heavyweight middleware, ORMs, or complex abstractions from day one, NHSERVER v1.0.0 focuses on doing one thing exceptionally well: **providing a clean, robust, and strongly typed REST HTTP server with seamless routing and error handling.**

The framework introduces an adapter-friendly architecture that allows future API modalities (such as GraphQL) to be integrated smoothly without bloating the core engine.

---

## ✨ Key Features

- ⚡ **Zero Production Dependencies**: Built directly on top of Node.js native `http` module for maximum performance and security.
- 🔒 **Strict TypeScript Support**: 100% written in modern TypeScript with strict type checking, explicit return types, and complete autocompletion.
- 🎯 **Explicit Routing**: Direct support for standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- 🛡️ **Built-in Error Recovery**: Automatic `500 Internal Server Error` fallbacks on unhandled handler errors to prevent server crashes.
- 🧩 **Modular Design**: Clear separation of concerns across Core, HTTP Abstractions, Router, and Adapters.
- 🧪 **100% Tested**: Comprehensive test coverage across all layers using **Vitest**.

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

// 2. Define your routes
app.get("/", (_req, res) => {
    res.json({
        message: "Welcome to NHSERVER!",
        status: "active",
    });
});

app.get("/health", (_req, res) => {
    res.status(200).send("OK");
});

app.post("/api/users", (_req, res) => {
    res.status(201).json({
        id: 1,
        name: "Developer",
        created_at: new Date().toISOString(),
    });
});

// 3. Start listening on a port
const PORT = 3000;
await app.listen(PORT);

console.log(`🚀 Server running at http://localhost:${PORT}`);
```

---

## 📚 API Reference

### `nh_server`

The main application class managing the server lifecycle and route registration.

#### Constructor

```ts
new nh_server(mode: "rest")
```
- `mode`: The API modality. Currently, `"rest"` is supported.

#### Routing Methods

```ts
app.get(path: string, handler: http_handler): void
app.post(path: string, handler: http_handler): void
app.put(path: string, handler: http_handler): void
app.patch(path: string, handler: http_handler): void
app.delete(path: string, handler: http_handler): void
```

#### Lifecycle Methods & Properties

- **`listen(port: number): Promise<void>`**  
  Starts listening on the specified port (`1` - `65535`).
- **`close(): Promise<void>`**  
  Gracefully shuts down the HTTP server.
- **`is_running: boolean`**  
  Getter returning `true` if the server is actively listening.
- **`api_mode: api_mode`**  
  Getter returning the initialized API mode (`"rest"`).

---

### `nh_request`

Encapsulates the incoming HTTP request.

| Property | Type | Description |
| :--- | :--- | :--- |
| `method` | `string` | The HTTP method of the request (e.g., `"GET"`, `"POST"`). |
| `url` | `string` | The raw URL requested (including query parameters). |
| `headers` | `IncomingHttpHeaders` | Dictionary of incoming request headers. |

---

### `nh_response`

Provides a chainable, type-safe interface for formatting and sending HTTP responses.

| Method / Property | Return Type | Description |
| :--- | :--- | :--- |
| `status(code: number)` | `this` | Sets the HTTP status code (e.g., `200`, `201`, `404`). |
| `set_header(name, value)` | `this` | Sets a custom response header. |
| `send(body: string)` | `void` | Sends a plain text response (sets `Content-Type: text/plain; charset=utf-8` by default). |
| `json(body: unknown)` | `void` | Serializes and sends a JSON response (sets `Content-Type: application/json; charset=utf-8`). |
| `ended` | `boolean` | `true` if the response stream has completed. |
| `header_sent` | `boolean` | `true` if headers have already been transmitted. |

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
┌──────────────┐
│  nh_server   │ ──► Normalizes method & extracts path (strips query)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    router    │ ──► Finds matching `route` (Method + Path)
└──────┬───────┘
       ├─────────────────────────────────────┐
       ▼ [Match Found]                       ▼ [No Match]
┌──────────────┐                      ┌──────────────┐
│ User Handler │                      │ 404 Response │ ("Not Found")
└──────┬───────┘                      └──────────────┘
       ▼
┌──────────────┐
│   Response   │ (JSON / Text sent to client)
└──────────────┘
```

---

## 📂 Project Structure

Following strict separation of concerns, the repository follows a clean, lowercase file naming convention:

```text
nhserver/
├── src/
│   ├── core/
│   │   └── nh_server.ts        # Primary server entrypoint & facade
│   ├── http/
│   │   ├── server.ts           # Native Node http.Server wrapper & lifecycle
│   │   ├── request.ts          # Request abstraction (nh_request)
│   │   └── response.ts         # Response abstraction & helpers (nh_response)
│   ├── router/
│   │   ├── router.ts           # Route registry & lookup
│   │   └── route.ts            # Route definition entity (Method + Path + Handler)
│   ├── adapter/
│   │   └── rest.ts             # REST adapter implementation
│   └── app.ts                  # Public package composition & exports
├── test/
│   ├── core/
│   │   └── nh_server.test.ts   # Core & end-to-end integration tests
│   ├── http/
│   │   ├── server.test.ts      # Server lifecycle and error recovery tests
│   │   ├── request.test.ts     # Request normalization tests
│   │   └── response.test.ts    # Response output & header tests
│   ├── router/
│   │   ├── router.test.ts      # Router match tests
│   │   └── route.test.ts       # Route entity tests
│   └── adapter/
│       └── rest.test.ts        # REST adapter tests
├── examples/
│   └── basic_service.ts        # Complete runnable example
├── CONTEXT.md                  # Architectural context and development blueprint
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

---

## 🧪 Testing

NHSERVER uses **Vitest** for automated unit and integration testing. 

> [!IMPORTANT]
> **Branch Separation for Tests**: Unit and integration test suites are maintained independently in the specialized **`test-server`** branch. The `develop` and `main` branches remain clean and focus strictly on core library source code.

To run the automated tests (available in `test-server` or during test development):

```bash
# Run test suite once
pnpm test

# Run tests in watch mode
pnpm vitest
```

---

## 🗺️ Roadmap & Versioning

NHSERVER adheres to [Semantic Versioning (SemVer)](https://semver.org/): `MAJOR.MINOR.PATCH`.

- **v1.0.0 (Current)**:
  - Stable core architecture.
  - REST mode implementation.
  - Native HTTP server lifecycle management.
  - Static routing for `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
  - Automated test coverage with Vitest on `test-server`.
- **v1.1.x (Planned)**:
  - Dynamic path parameters (e.g. `/users/:id`).
  - Structured query parameter parser.
  - Enhanced request body parsing utilities.
  - Basic middleware chaining mechanism.
- **v1.2.x+**:
  - Additional API modalities (e.g., GraphQL adapter).

---

## 🤝 Contributing & Git Branching Strategy

Contributions are welcome! Please read our [**CONTRIBUTING.md**](./CONTRIBUTING.md) for full details on our branch isolation policy.

### Branch Overview

| Branch | Purpose | PR Target For |
| :--- | :--- | :--- |
| **`main`** | Production releases & tagged versions | Release PRs |
| **`develop`** | Active feature & core library development (*No test suites*) | `feature/*`, `fix/*`, `refactor/*`, `docs/*` |
| **`test-server`** | Dedicated testing branch for Vitest suites | `test/*` |

### Quick Workflow

1. **For Core Features / Fixes**:
   * Branch from `develop` -> Create `feature/<name>` or `fix/<name>`.
   * Submit PR against `develop` (do NOT include `test/` files).
2. **For Test Suites & Test Cases**:
   * Branch from `test-server` -> Create `test/<name>`.
   * Submit PR against `test-server`.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).