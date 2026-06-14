# react-nodejs-firebase-starter

A production-ready starter monorepo wiring a TypeScript React SPA to a Node API
backed by Firestore, with local Docker Compose development and GitHub Actions
deployment to OpenShift.

- **Frontend** — TypeScript, React (Vite), zustand, React Query, Bootstrap,
  ESLint, PostCSS, Jest + React Testing Library.
- **API** — NodeJS, Express, `@google-cloud/functions-framework`, `firebase-admin`.
- **Database** — Firestore (via the Firebase Emulator locally).
- **Local dev** — `docker compose` running `frontend`, `api`, and `firebase`.
- **Deploy** — GitHub Actions building images and deploying the frontend and API
  to OpenShift / Kubernetes.

> No NGINX: the production frontend image serves the built assets with a small
> Node/Express static server (`frontend/server.cjs`) on port 8080.

See [`CONTRACT.md`](./CONTRACT.md) for the shared interface contract (service
names, ports, routes, and environment variables) that ties the components
together.

## Project layout

```text
.
├── frontend/   # Vite + React + TS SPA (zustand, React Query, Bootstrap, Jest)
├── api/        # Express + functions-framework + firebase-admin (TypeScript)
├── firebase/   # Firebase Tools image + Firestore emulator config
├── k8s/        # OpenShift manifests (Deployment/Service/Route) for frontend & api
├── .github/workflows/deploy.yml   # CI: build images + deploy to OpenShift
├── docker-compose.yml             # Local dev stack
└── CONTRACT.md                    # Shared interface contract
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose v2 (for the
  local stack).
- [Node.js 20 LTS](https://nodejs.org/) + npm (for running a service directly).

## Quick start (Docker Compose)

```bash
docker compose up --build
```

This starts three services:

| Service    | URL                          | Description                     |
| ---------- | ---------------------------- | ------------------------------- |
| frontend   | http://localhost:5173        | Vite dev server (hot reload)    |
| api        | http://localhost:8080        | Express via functions-framework |
| firebase   | http://localhost:4000        | Firebase Emulator UI            |
| firestore  | localhost:8081               | Firestore emulator endpoint     |

Try it:

```bash
curl http://localhost:8080/healthz
curl http://localhost:8080/api/items
curl -X POST http://localhost:8080/api/items \
  -H 'Content-Type: application/json' -d '{"name":"hello"}'
```

The API talks to the Firestore emulator because Compose sets
`FIRESTORE_EMULATOR_HOST=firebase:8081` (see `CONTRACT.md`).

## Working on a single service

### Frontend

```bash
cd frontend
npm install
npm run dev      # Vite dev server on :5173
npm run build    # type-check + production build to dist/
npm run lint
npm test         # Jest + React Testing Library
npm start        # serve dist/ with the Node static server on :8080
```

Configure the API base URL with `VITE_API_BASE_URL` (see `frontend/.env.example`).

### API

```bash
cd api
npm install
npm run build
npm start        # functions-framework --target=api on :8080
npm run lint
npm test         # Jest + supertest (firebase-admin mocked)
```

To run the API against a local emulator outside Compose, start the emulator and
export `FIRESTORE_EMULATOR_HOST=localhost:8081` and
`GOOGLE_CLOUD_PROJECT=demo-starter` before `npm start`.

## Building production images

```bash
docker build -t rnf-frontend ./frontend
docker build -t rnf-api ./api
```

Both images run as a non-root user and listen on port 8080.

## Deployment (OpenShift via GitHub Actions)

`.github/workflows/deploy.yml` runs on pushes to `main` (and via
`workflow_dispatch`):

1. Builds and pushes `rnf-frontend` and `rnf-api` images to GHCR, tagged with
   the commit SHA and `latest`.
2. Logs into OpenShift, applies `k8s/`, points the Deployments at the
   SHA-tagged images, and waits for rollout.

### Required GitHub configuration

Secrets:

- `OPENSHIFT_SERVER` — OpenShift API server URL (e.g. `https://api.cluster:6443`).
- `OPENSHIFT_TOKEN` — token for `oc login` (a service account is recommended).
- `OPENSHIFT_NAMESPACE` — target project/namespace.

Optional repository variables:

- `IMAGE_OWNER` — registry owner/org (defaults to the GitHub owner, lowercased).
- `VITE_API_BASE_URL` — baked into the frontend bundle at build time
  (e.g. the public URL of the API Route).

### Manual apply

The manifests use `IMAGE_REGISTRY/IMAGE_OWNER/...:IMAGE_TAG` placeholders.
Substitute them (or let CI do it) before applying:

```bash
oc apply -f k8s/
oc set image deployment/api api=ghcr.io/<owner>/rnf-api:<tag>
oc set image deployment/frontend frontend=ghcr.io/<owner>/rnf-frontend:<tag>
```
