import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../shared/error/AppError';

import authConfig from '../config/auth';

interface ITokenPayload {
  firstName: string;
  lastName: string;
  iat: number;
  exp: number;
  sub: string;
}

export function userAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret || '');

    const { sub, firstName, lastName } = decoded as ITokenPayload;

    req.user = {
      id: sub,
      firstName,
      lastName,
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
