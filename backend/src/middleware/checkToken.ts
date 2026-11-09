import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { PublicUser } from '../models/user';
import User, { toPublicUser } from '../models/user';

declare module 'express-serve-static-core' {
  interface Request {
    Usuario?: PublicUser;
  }
}

const unauthorized = (res: Response, message: string): void => {
  res.status(401).json({ success: false, message });
};

export async function checkToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.header('Authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : undefined;

  if (!token) {
    unauthorized(res, 'Necesitas iniciar sesión.');
    return;
  }

  let payload: JwtPayload & { tv?: number };
  try {
    payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload & {
      tv?: number;
    };
  } catch (error) {
    const expired = error instanceof Error && error.name === 'TokenExpiredError';
    unauthorized(res, expired ? 'Tu sesión expiró. Inicia sesión de nuevo.' : 'Token inválido.');
    return;
  }

  // El rol y el estado se leen de la base de datos en cada petición: si cambian el rol
  // desde MongoDB o suspenden la cuenta, el efecto es inmediato.
  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user || user.tokenVersion !== payload.tv || user.status !== 'active') {
    unauthorized(res, 'Tu sesión ya no es válida. Inicia sesión de nuevo.');
    return;
  }

  req.Usuario = toPublicUser(user);
  next();
}
