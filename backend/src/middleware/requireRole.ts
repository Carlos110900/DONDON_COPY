import type { RequestHandler } from 'express';
import type { Role } from '../models/user';

/** Uso: router.delete('/:id', checkToken, requireRole('admin'), handler) */
export const requireRole =
  (...allowed: Role[]): RequestHandler =>
  (req, res, next) => {
    if (!req.Usuario) {
      res.status(401).json({ success: false, message: 'Necesitas iniciar sesión.' });
      return;
    }
    if (!allowed.includes(req.Usuario.role)) {
      res
        .status(403)
        .json({ success: false, message: 'No tienes permiso para realizar esta acción.' });
      return;
    }
    next();
  };
