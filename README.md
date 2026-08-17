# Buildpilot Frontend

## Reorganized Repository Architecture

The Buildpilot frontend has been consolidated into a clean, modern, and production-ready structure. The `frontend/` directory serves as the **one and only** authoritative workspace root for the React + TypeScript application.

```text
Buildpilot/
├── .github/      - CI/CD configurations
├── .gitignore    - Git ignore patterns
├── README.md     - Main repository documentation
└── frontend/     - Authoritative BuildPilot React App
```

All documentation has been moved to [frontend/docs/](file:///d:/Buildpilot-frontend/frontend/docs/) and scripts to [frontend/scripts/](file:///d:/Buildpilot-frontend/frontend/scripts/).

---

## Getting Started

To run the application locally:

```bash
# 1. Navigate into the frontend root
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

The app will run locally at `http://localhost:5173` (or the port specified by Vite).

---

## Production Build & Deploy

To verify TypeScript and compile the project for production, navigate to the `frontend/` directory and run:

```bash
# Compile and build assets
npm run build
```

The optimized static assets will be emitted to `frontend/dist/` ready to be served.

---

## Administrative Scripts

Database seeding and expert-role creation scripts are located in `frontend/scripts/` and can be run via:

```bash
# Run database seeding
npm run seed

# Create admin user
npm run make-admin

# Create expert/pro user
npm run make-pro
```
