import { Response } from 'express';
import { AppError } from '../shared/error/AppError';

export function globalErrors(error: Error, response: Response) {
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
