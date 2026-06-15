# Integration Contract

This file is the single source of truth for cross-component interfaces in this
starter. Every component (`frontend/`, `api/`, `firebase/`, infra) MUST conform
to the names, ports, routes, and environment variables defined here so the
pieces integrate without rework. Do not deviate from this contract.

## Components & Ownership
- `frontend/` — Vite + React + TypeScript SPA. Owned by the frontend agent.
- `api/` — Express + `@google-cloud/functions-framework` + `firebase-admin`
  (TypeScript). Owned by the api agent.
- `firebase/` — Firebase Tools image + emulator config. Owned by the infra agent.
- `k8s/`, `docker-compose.yml`, `.env.example`, `.github/workflows/`, `README.md`
  — Owned by the infra agent.

## Compose Service Names
- `frontend`
- `api`
- `firebase`

These exact names are used as DNS hostnames on the Compose network.

## Ports
- Frontend dev server (Vite): `5173`
- Frontend production container (Node static server): `8080`
- API container (functions-framework): `8080`
- Firestore emulator: `8081`
- Firebase Auth emulator: `9099`
- Firebase Emulator UI: `4000`

## API Routes
The API exposes a single functions-framework HTTP function whose target is
`api`. That function is an Express app mounting:
- `GET /healthz` → `200` with body `{ "status": "ok" }`
- `GET /api/items` → `200` with `{ "items": Item[] }` — **public, no auth required**
- `POST /api/items` → `201` with the created `Item`; request body `{ "name": string }` — **requires `Authorization: Bearer <Firebase ID Token>` header**

### Item shape
```json
{ "id": "string", "name": "string", "createdAt": "ISO-8601 string" }
```

Items are stored in the Firestore collection named `items`. Each item also has
a `createdBy` field containing the UID of the authenticated user who created it.

### Authentication
The API uses `firebase-admin` to verify Firebase ID tokens. The frontend
obtains an ID token from the Firebase client SDK and sends it in the
`Authorization` header as a Bearer token for write operations.

Unauthenticated requests to `POST /api/items` receive a `401` response:
```json
{ "error": "Missing or malformed Authorization header" }
```

## Environment Variables
### API
- `PORT=8080`
- `FUNCTION_TARGET=api`
- `GOOGLE_CLOUD_PROJECT=demo-starter`
- `FIRESTORE_EMULATOR_HOST=firebase:8081` (local/compose only; unset in prod)
- `FIREBASE_AUTH_EMULATOR_HOST=firebase:9099` (local/compose only; unset in prod)

### Frontend
- `VITE_API_BASE_URL` — base URL of the API.
  - Local Compose dev value: `http://localhost:8080`
  - The frontend calls API routes as `${VITE_API_BASE_URL}/api/items` etc.
- `VITE_FIREBASE_API_KEY` — Firebase client API key (safe to commit).
  - Local Compose dev value: `demo-api-key`
- `VITE_FIREBASE_AUTH_DOMAIN` — Firebase Auth domain.
  - Local Compose dev value: `demo-starter.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID` — Firebase project ID.
  - Local Compose dev value: `demo-starter`

## Runtime / Tooling
- Node 20 LTS, npm.
- Application container images run as a non-root user and listen on `8080`.
- Do NOT use NGINX anywhere. The production frontend image serves built assets
  with a small Node/Express static server (`server.cjs`) that implements SPA
  fallback and exposes `GET /healthz`.

## Firestore Project
- Project id: `demo-starter` (matches `GOOGLE_CLOUD_PROJECT`).

## Kubernetes / OpenShift
- Two Deployments: `frontend` and `api`, each with a `Service` and a `Route`.
- Containers listen on `8080`; probes hit `GET /healthz`.
- Security contexts must be OpenShift-compatible (non-root, no fixed UID,
  `runAsNonRoot: true`, drop all capabilities).
- Image references use placeholders: `IMAGE_REGISTRY/IMAGE_OWNER/rnf-frontend`
  and `IMAGE_REGISTRY/IMAGE_OWNER/rnf-api`.
