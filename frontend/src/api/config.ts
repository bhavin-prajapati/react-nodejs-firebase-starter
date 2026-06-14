// Base URL of the API, supplied at build time via Vite env.
// Falls back to localhost for local Compose development.
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
