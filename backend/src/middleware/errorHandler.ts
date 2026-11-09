import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Ruta no encontrada - ${req.originalUrl}` });
};

const isDuplicateKey = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;

// Express 5 manda aquí también los errores de los controladores async
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ success: false, message: 'Identificador inválido.' });
    return;
  }
  if (isDuplicateKey(error)) {
    res.status(409).json({ success: false, message: 'Ya existe un registro con esos datos.' });
    return;
  }

  const status = (error as { status?: number }).status;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    res.status(status).json({
      success: false,
      message: status === 413 ? 'El contenido enviado es demasiado grande.' : 'Solicitud inválida.',
    });
    return;
  }

  console.error('Error no controlado:', error);
  res.status(500).json({ success: false, message: 'Error en el servidor.' });
};
