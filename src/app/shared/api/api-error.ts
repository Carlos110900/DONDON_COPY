import { HttpErrorResponse } from '@angular/common/http';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

export function toApiError(error: HttpErrorResponse): ApiError {
  return new ApiError(serverMessage(error) ?? messageFor(error.status), error.status);
}

function serverMessage(error: HttpErrorResponse): string | null {
  const body: unknown = error.error;
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return null;
}

function messageFor(status: number): string {
  if (status === 0) return 'No se pudo conectar con el servidor. Revisa que la API esté encendida.';
  if (status === 400 || status === 422) return 'Los datos enviados no son válidos.';
  if (status === 403) return 'No tienes permiso para realizar esta acción.';
  if (status === 404) return 'No encontramos el recurso solicitado.';
  if (status === 409) return 'Ya existe un registro con esos datos.';
  if (status >= 500) return 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.';
  return 'Ocurrió un error inesperado.';
}
