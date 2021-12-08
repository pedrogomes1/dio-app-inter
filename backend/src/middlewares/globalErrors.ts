import { NextFunction, Request, Response } from 'express';
import { AppError } from '../shared/error/AppError';

export function globalErrors(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      data: error?.data,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
