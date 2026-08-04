# Buildpilot Frontend

## Overview

**Buildpilot Frontend** is a modern, production‑ready web interface built with **React**, **TypeScript**, and **Vite**. It provides a fast, hot‑module‑reloaded development experience while adhering to strict linting rules via **Oxlint**. The UI serves as the client side of the Buildpilot platform, enabling users to interact with AI‑assisted construction and property marketplace features.

## Features

- **Lightning‑fast development** with Vite's native HMR.
- **Type‑safe** React components powered by TypeScript.
- **Robust linting** using Oxlint with optional type‑aware rules.
- **Extensible plugin architecture** – add React or SWC plugins as needed.
- **Responsive design** that works across desktops, tablets, and mobile devices.

## Requirements

- **Node.js** >= 18.x
- **npm** (or **pnpm/yarn**) for package management
- **Git** for version control
- **Vite** (installed automatically as a dev dependency)

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/Buildpilot-frontend.git
cd Buildpilot-frontend

# Install dependencies
npm install
```

## Development

Start the development server with hot reloading:

```bash
npm run dev
```

Open your browser at `http://localhost:5174` (or the port shown in the console). The app will automatically reload as you edit source files.

## Building for Production

```bash
npm run build
```

The optimized static assets will be emitted to the `dist/` directory, ready for deployment to any static hosting provider.

## Linting & Formatting

```bash
# Run Oxlint with the default configuration
npm run lint

# Automatically fix lintable issues
npm run lint:fix
```

To enable type‑aware linting, install the optional plugin:

```bash
npm install -D oxlint-tsgolint
```

Then update `.oxlintrc.json` as described in the documentation.

## Branch Strategy & CI/CD Pipeline

We follow a strict branching model:
- `main` represents production. Direct pushes are blocked.
- `develop` is the integration branch.
- Feature/bugfix development occurs in `feature/*` or `fix/*` branches.

### CI/CD Workflow

On every pull request to `main` or `develop`, a validation workflow runs:
1. **Secret Scanning**: Runs Gitleaks to detect exposed credentials.
2. **Quality Checks**: Resolves dependencies (`npm ci`), runs Oxlint, typechecks via TypeScript, runs placeholder unit tests, and verifies compilation.
3. **Dependency Security**: Scans for vulnerabilities via `npm audit --audit-level=high`.

Upon merging to `main` or `develop`, the **Frontend CD** workflow deploys the build artifact automatically to Vercel (using Vercel CLI and prebuilt binaries).

### Environment Management

A template `.env.example` is located in the `frontend/` folder. All browser-facing variables must be prefixed with `VITE_` (e.g., `VITE_API_BASE_URL`). Do not store secrets or backend credentials here.

## Contributing

Contributions are welcome! Please follow these steps:
1. Create a branch from `develop`.
2. Ensure `npm run lint`, `npm run typecheck`, and `npm run build` pass successfully.
3. Submit a pull request targeting `develop`.

## License

This project is licensed under the MIT License – see the `LICENSE` file for details.

