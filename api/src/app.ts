import cors from 'cors';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { getDb, ITEMS_COLLECTION } from './firestore';

/** Shape of an item as returned by the API (per the integration contract). */
export interface Item {
  id: string;
  name: string;
  createdAt: string;
}

/**
 * Small wrapper so async route handlers forward rejections to Express'
 * error-handling middleware instead of crashing the process.
 */
function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check.
  app.get('/healthz', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // List items, newest first.
  app.get(
    '/api/items',
    asyncHandler(async (_req: Request, res: Response) => {
      const snapshot = await getDb()
        .collection(ITEMS_COLLECTION)
        .orderBy('createdAt', 'desc')
        .get();

      const items: Item[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name as string,
          createdAt: data.createdAt as string,
        };
      });

      res.status(200).json({ items });
    }),
  );

  // Create an item.
  app.post(
    '/api/items',
    asyncHandler(async (req: Request, res: Response) => {
      const name: unknown = req.body?.name;

      if (typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ error: 'name is required and must be a non-empty string' });
        return;
      }

      const createdAt = new Date().toISOString();
      const ref = await getDb().collection(ITEMS_COLLECTION).add({ name, createdAt });

      const item: Item = { id: ref.id, name, createdAt };
      res.status(201).json(item);
    }),
  );

  // Centralized error handler.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ error: 'internal server error' });
  });

  return app;
}
