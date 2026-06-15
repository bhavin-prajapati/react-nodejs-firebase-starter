import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/** Firestore collection that stores items (per the integration contract). */
export const ITEMS_COLLECTION = 'items';

let db: Firestore | undefined;
let adminAuth: Auth | undefined;

/**
 * Lazily initialize firebase-admin and return a Firestore client.
 *
 * - When `FIRESTORE_EMULATOR_HOST` is set, the Admin SDK automatically routes
 *   traffic to the local Firestore emulator, so only a project id is required.
 * - Otherwise, Application Default Credentials are used (e.g. in production).
 */
export function getDb(): Firestore {
  if (!db) {
    ensureAppInitialized();
    db = getFirestore();
  }
  return db;
}

/**
 * Lazily initialize firebase-admin and return the Auth service.
 * Used by the auth middleware to verify ID tokens.
 */
export function getAdminAuth(): Auth {
  if (!adminAuth) {
    ensureAppInitialized();
    adminAuth = getAuth();
  }
  return adminAuth;
}

/** Ensure the Firebase Admin app is initialized exactly once. */
function ensureAppInitialized(): void {
  if (getApps().length === 0) {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT ?? 'demo-starter';
    const isEmulator =
      !!process.env.FIRESTORE_EMULATOR_HOST ||
      !!process.env.FIREBASE_AUTH_EMULATOR_HOST;
    initializeApp(
      isEmulator
        ? { projectId }
        : { projectId, credential: applicationDefault() },
    );
  }
}
