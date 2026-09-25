# Contributing to NHSERVER 🤝

Thank you for your interest in contributing to **NHSERVER**! We welcome contributions, bug reports, and suggestions from the community.

To maintain code quality, modularity, and a clean Git history, please read and follow this guide carefully before submitting your contributions.

---

## 🌳 Branching Strategy & Workflow (IMPORTANT)

NHSERVER uses a strict branch separation policy to keep development, releases, and testing environments clearly decoupled.

```text
  main (Stable, tagged releases)
   ▲
   │ (Release PRs)
  develop (Active feature & core development - NO test suites here)
   ▲
   │ (Feature / Fix PRs)
  feature/*, fix/*, refactor/*, docs/*

  test-server (Dedicated testing branch: Vitest suites & test cases)
   ▲
   │ (Test PRs)
  test/*
```

### 1. `main`
* Contains only production-ready, tagged, and released code.
* Direct commits are not permitted.

### 2. `develop` (Core Development)
* The active integration branch for framework core development, features, adapters, and documentation.
* **CRITICAL RULE**: **Unit tests and test suites do NOT belong in `develop`.** PRs submitted to `develop` must focus solely on source code (`src/`), examples (`examples/`), or project documentation.

### 3. `test-server` (Specialized Testing Branch)
* **The dedicated branch for all unit, integration, and E2E test suites (`test/`).**
* All test maintenance, new Vitest test cases, and mock setups are developed and PR'd directly against `test-server`.
* This keeps the core source lean while providing an independent environment for rigorous automated validation.

---

## 🛠️ Step-by-Step Contribution Guide

### Contributing Features, Fixes, or Core Code

1. **Fork the repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/nhserver.git
   cd nhserver
   ```
3. **Branch from `develop`**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   # or fix/your-fix-name
   ```
4. **Make your changes** inside `src/` or `examples/`.
5. **Verify TypeScript types**:
   ```bash
   npx tsc --noEmit
   ```
6. **Commit and Push**:
   ```bash
   git commit -m "feat(router): add regex path matching support"
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** targeting the **`develop`** branch. Ensure no test files (`test/`) are included in this PR.

---

### Contributing Tests or Test Suites

1. **Checkout the `test-server` branch**:
   ```bash
   git checkout test-server
   git pull origin test-server
   git checkout -b test/your-test-suite
   ```
2. **Add or update test files** under the `test/` directory.
3. **Run Vitest**:
   ```bash
   pnpm test
   ```
4. **Commit and Push**:
   ```bash
   git commit -m "test(http): add comprehensive error status tests"
   git push origin test/your-test-suite
   ```
5. **Open a Pull Request** targeting the **`test-server`** branch.

---

## 📏 Coding Conventions & Guidelines

* **File Naming**: All filenames must be lowercase with words separated by underscores (e.g., `nh_server.ts`, `route.test.ts`). No camelCase, PascalCase, or kebab-case filenames.
* **No `index.ts`**: Do not use `index.ts` as an entrypoint. Use explicit filenames and export from `src/app.ts`.
* **TypeScript Strictness**: Always keep `strict: true`. Avoid using `any` unless absolutely required and documented.
* **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat:` New features
  - `fix:` Bug fixes
  - `docs:` Documentation updates
  - `refactor:` Code restructuring without behavioral changes
  - `test:` Test additions or modifications (targeting `test-server`)

---

## 💬 Questions or Suggestions?

Feel free to open an issue on GitHub for discussions, feature requests, or architecture proposals. Thank you for making NHSERVER better!
