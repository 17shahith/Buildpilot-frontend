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

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Write tests and ensure the lint passes.
4. Submit a pull request with a clear description of your changes.

Make sure to adhere to the existing code style and linting configuration.

## License

This project is licensed under the MIT License – see the `LICENSE` file for details.
