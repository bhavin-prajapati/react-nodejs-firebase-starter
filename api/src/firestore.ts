import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/** Firestore collection that stores items (per the integration contract). */
export const ITEMS_COLLECTION = 'items';

let db: Firestore | undefined;

/**
 * Lazily initialize firebase-admin and return a Firestore client.
 *
 * - When `FIRESTORE_EMULATOR_HOST` is set, the Admin SDK automatically routes
 *   traffic to the local Firestore emulator, so only a project id is required.
 * - Otherwise, Application Default Credentials are used (e.g. in production).
 */
export function getDb(): Firestore {
  if (!db) {
    if (getApps().length === 0) {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT ?? 'demo-starter';
      initializeApp(
        process.env.FIRESTORE_EMULATOR_HOST
          ? { projectId }
          : { projectId, credential: applicationDefault() },
      );
    }
    db = getFirestore();
  }
  return db;
}
