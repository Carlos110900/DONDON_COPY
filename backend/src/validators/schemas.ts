import { z } from 'zod';
import { COMIC_STATUSES } from '../models/comic';
import { ROLES, USER_STATUSES } from '../models/user';

// z.string() rechaza objetos: { "email": { "$ne": null } } nunca pasa la validación.
const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'El correo es demasiado largo.')
  .pipe(z.email('Escribe un correo válido.'));
const password = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .max(72, 'La contraseña no puede pasar de 72 caracteres.'); // límite de bcrypt
const name = z.string().trim().min(1, 'El nombre es obligatorio.').max(60);

// .strict(): cualquier campo extra (por ejemplo "role") se rechaza, no se ignora
export const registerSchema = z.object({ name, email, password }).strict();
export const loginSchema = z
  .object({ email, password: z.string().min(1, 'La contraseña es obligatoria.').max(72) })
  .strict();
export const googleSchema = z.object({ idToken: z.string().min(20).max(4096) }).strict();

export const roleSchema = z.object({ role: z.enum(ROLES, 'Rol inválido.') }).strict();
export const statusSchema = z
  .object({ status: z.enum(USER_STATUSES, 'Estado inválido.') })
  .strict();
export const profileSchema = z
  .object({
    name: name.optional(),
    descripcion: z.string().trim().max(300).optional(),
    photo: z.string().trim().max(500).optional(),
  })
  .strict();

export const tagSchema = z
  .object({ name: z.string().trim().min(1, 'El tag es obligatorio.').max(40) })
  .strict();

// Los campos desconocidos (id, chapters...) se descartan; los capítulos llegarán con S3.
export const comicInputSchema = z.object({
  title: z.string().trim().min(3).max(80),
  description: z.string().trim().min(20).max(500),
  publisher: z.string().trim().min(1).max(80),
  cover: z.string().max(1_000_000),
  status: z.enum(COMIC_STATUSES),
  genres: z.array(z.string().trim().min(1).max(40)).min(1).max(10),
  involved: z
    .array(z.object({ name: z.string().trim().min(2).max(80), role: z.enum(['writer', 'artist']) }))
    .max(40),
});
export const comicUpdateSchema = comicInputSchema.partial();

export type ComicInput = z.infer<typeof comicInputSchema>;
