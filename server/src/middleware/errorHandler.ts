import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  error: string;
  status: number;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const error: ErrorResponse = {
    status: err instanceof AppError ? err.status : 500,
    error: err.message || 'Internal Server Error',
  };

  console.error(err);
  res.status(error.status).json(error);
}
