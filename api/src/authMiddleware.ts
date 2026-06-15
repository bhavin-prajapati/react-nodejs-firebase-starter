import type { NextFunction, Request, Response } from 'express';
import { getAdminAuth } from './firestore';
import type { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Extends the Express Request to carry the decoded Firebase ID token
 * after successful authentication.
 */
export interface AuthenticatedRequest extends Request {
  auth: DecodedIdToken;
}

/**
 * Express middleware that verifies a Firebase ID token from the
 * `Authorization: Bearer <token>` header.
 *
 * On success, the decoded token is attached to `req.auth`.
 * On failure, responds with `401 Unauthorized`.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    (req as AuthenticatedRequest).auth = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
