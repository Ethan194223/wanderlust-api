// Adds `userId` to Request for the whole project
import 'express';

declare global {
  namespace Express {
    interface Request {
      /** present after `requireAuth` succeeds */
      userId?: string;
    }
  }
}

export {};            // ensures this is a module

