# react-nodejs-firebase-starter

A production-ready starter monorepo:

- **Frontend** — TypeScript, React (Vite), zustand, React Query, Bootstrap,
  ESLint, PostCSS, Jest + React Testing Library.
- **API** — NodeJS, Express, `@google-cloud/functions-framework`.
- **Database** — Firestore (via the Firebase Emulator locally).
- **Local dev** — `docker-compose` running `frontend`, `api`, and `firebase`.
- **Deploy** — GitHub Actions building images and deploying the frontend and API
  to OpenShift / Kubernetes.

> This README is a baseline placeholder and will be expanded with full setup,
> development, and deployment instructions during implementation.

See [`CONTRACT.md`](./CONTRACT.md) for the shared interface contract (service
names, ports, routes, and environment variables) that ties the components
together.
