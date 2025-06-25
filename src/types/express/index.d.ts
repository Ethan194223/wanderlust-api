// src/types/express/index.d.ts

declare global {
  namespace Express {
    interface Request {
      // Add the 'userId' property to the Request interface.
      // Make it optional ('?') so that routes without auth don't cause type errors.
      userId?: string;
    }
  }
}

// If this file is not a module, you'll need to add this line to make it one.
export {};