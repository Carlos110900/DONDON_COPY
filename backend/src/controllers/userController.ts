// Imports
import type { Request, Response } from 'express';
import type { IUser, Role, UserStatus } from '../models/user';
import User, { toPublicUser } from '../models/user';

const getStringParam = (param: string | string[] | undefined): string | null => {
  if (!param) return null;
  return Array.isArray(param) ? param[0] : param;
};

// Vista de administración: sin password, sin tokenVersion, sin googleID
const toAdminUser = (user: IUser) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  creationDate: user.creationDate,
});

const notFound = (res: Response): void => {
  res.status(404).json({ success: false, message: 'User no encontrado' });
};

// Mostrar todos los users (solo admin)
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find({}).sort({ creationDate: -1 }).limit(500);
  res.status(200).json({ success: true, data: users.map(toAdminUser) });
};

// Mostrar usuario por ID (solo admin)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const idStr = getStringParam(req.params.id);
  if (!idStr) {
    res.status(400).json({ success: false, message: 'El ID es requerido' });
    return;
  }

  const user = await User.findById(idStr);
  if (!user) return notFound(res);

  res.status(200).json({ success: true, data: toAdminUser(user) });
};

// Cambiar rol (solo admin). No puede cambiarse el propio para no quedarse sin administradores.
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  const idStr = getStringParam(req.params.id);
  if (!idStr) {
    res.status(400).json({ success: false, message: 'El ID es requerido' });
    return;
  }
  if (idStr === req.Usuario?.id) {
    res.status(400).json({ success: false, message: 'No puedes cambiar tu propio rol.' });
    return;
  }

  const user = await User.findById(idStr);
  if (!user) return notFound(res);

  user.role = (req.body as { role: Role }).role;
  await user.save();
  res.status(200).json({ success: true, data: toAdminUser(user) });
};

// Suspender o reactivar (solo admin). Al suspender se invalidan sus sesiones abiertas.
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  const idStr = getStringParam(req.params.id);
  if (!idStr) {
    res.status(400).json({ success: false, message: 'El ID es requerido' });
    return;
  }
  if (idStr === req.Usuario?.id) {
    res.status(400).json({ success: false, message: 'No puedes suspender tu propia cuenta.' });
    return;
  }

  const user = await User.findById(idStr).select('+tokenVersion');
  if (!user) return notFound(res);

  const status = (req.body as { status: UserStatus }).status;
  user.status = status;
  if (status === 'banned') user.tokenVersion += 1;
  await user.save();
  res.status(200).json({ success: true, data: toAdminUser(user) });
};

// Eliminar usuario por ID (solo admin)
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const idStr = getStringParam(req.params.id);
  if (!idStr) {
    res.status(400).json({ success: false, message: 'El ID es requerido' });
    return;
  }
  if (idStr === req.Usuario?.id) {
    res.status(400).json({ success: false, message: 'No puedes eliminar tu propia cuenta.' });
    return;
  }

  const user = await User.findByIdAndDelete(idStr);
  if (!user) return notFound(res);

  res.status(200).json({ success: true, message: 'User eliminado correctamente' });
};

// Actualizar el propio perfil. El correo y el rol no se pueden cambiar desde aquí.
export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findByIdAndUpdate(req.Usuario?.id, req.body as object, {
    new: true,
    runValidators: true,
  });
  if (!user) return notFound(res);

  res.status(200).json({ success: true, user: toPublicUser(user) });
};
