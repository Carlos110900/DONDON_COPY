import { rateLimit } from 'express-rate-limit';

/** Frena fuerza bruta en login/registro: 20 intentos cada 15 minutos por IP. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
});
