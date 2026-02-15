# Technology Stack for Extt

## Overview
Extt is developed as a monorepo utilizing a combination of Rust for its core functionalities and CLI, and TypeScript for its web-based application. The project leverages modern build and package management tools to ensure efficiency and maintainability across its various components.

## Core Technologies

### Programming Languages
*   **Rust:** Used for the development of the core logic, CLI, and upcoming desktop application. Rust's focus on performance, memory safety, and concurrency makes it ideal for the backend and native components of Extt.
*   **TypeScript:** Employed for the `apps/web` component, providing type safety and enhanced developer experience for the web application.

### Frameworks
*   **Next.js:** The chosen framework for the `apps/web` project, enabling server-side rendering, static site generation, and a robust React-based development environment for the web interface of Extt.

### Build and Management Tools
*   **Cargo:** Rust's package manager and build system, used for managing Rust dependencies, compiling, and testing the `crates` within the monorepo.
*   **Bun:** A fast JavaScript runtime, bundler, test runner, and package manager, utilized for managing JavaScript/TypeScript dependencies and scripts, particularly within the web application and potentially across the monorepo for its speed benefits.
*   **Turborepo:** A high-performance build system for JavaScript and TypeScript monorepos, used to optimize the build process and manage dependencies across the `apps` and `packages` within the Extt project.
