import { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    console.error('[Zod Validation Error]', JSON.stringify(err.issues, null, 2));
    res.status(400).json({
      error: 'Validation Error',
      details: err.issues,
    });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      error: err.message,
    });
    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
): void => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
  });
};
