import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

/** Valida y limpia req.body. Lo que no esté en el esquema nunca llega al controlador. */
export const validate =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.error.issues[0]?.message ?? 'Datos inválidos.',
        errors: result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
