import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { IUser } from '../models/user';
import User, { toPublicUser } from '../models/user';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

// Se compara contra este hash cuando el correo no existe, para que tardar lo mismo
// no delate qué correos están registrados.
const DUMMY_HASH = bcrypt.hashSync('contraseña-que-nadie-usa', 12);

const BAD_CREDENTIALS =
  'Correo o contraseña incorrectos. Si te registraste con Google, usa "Continuar con Google".';

// El token solo lleva el id (sub) y la versión (tv). El rol NO va dentro: se lee de la BD.
const signToken = (user: IUser): string =>
  jwt.sign({ tv: user.tokenVersion }, env.JWT_SECRET, {
    subject: String(user._id),
    algorithm: 'HS256',
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

const sendSession = (res: Response, status: number, user: IUser): void => {
  res.status(status).json({ success: true, token: signToken(user), user: toPublicUser(user) });
};

// Registro con credenciales locales
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as { name: string; email: string; password: string };

  if (await User.exists({ email })) {
    res.status(409).json({ success: false, message: 'Ya existe una cuenta con ese correo.' });
    return;
  }

  // role, status y tokenVersion NO se toman del body: nacen con sus valores por defecto
  const user = new User({ name, email });
  await user.setPassword(password);
  await user.save();

  sendSession(res, 201, user);
};

// Login con credenciales locales
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email }).select('+password +tokenVersion');
  const valid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);

  if (!user || !user.password || !valid) {
    res.status(401).json({ success: false, message: BAD_CREDENTIALS });
    return;
  }
  if (user.status !== 'active') {
    res.status(403).json({ success: false, message: 'Tu cuenta está suspendida.' });
    return;
  }

  sendSession(res, 200, user);
};

// Login con Google Identity Services: el frontend manda el ID token y aquí se valida
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  const { idToken } = req.body as { idToken: string };

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    res.status(401).json({ success: false, message: 'No se pudo autenticar la cuenta.' });
    return;
  }
  if (!payload?.sub || !payload.email || !payload.email_verified) {
    res.status(401).json({ success: false, message: 'No se pudo autenticar la cuenta.' });
    return;
  }

  const email = payload.email.toLowerCase();
  let user =
    (await User.findOne({ googleID: payload.sub }).select('+tokenVersion')) ??
    (await User.findOne({ email }).select('+tokenVersion'));

  if (!user) {
    user = await User.create({
      name: payload.name ?? email.split('@')[0],
      email,
      googleID: payload.sub,
      photo: payload.picture ?? undefined,
    });
  } else if (!user.googleID) {
    // Misma cuenta de correo verificada por Google: se vincula a la cuenta local
    user.googleID = payload.sub;
    await user.save();
  }

  if (user.status !== 'active') {
    res.status(403).json({ success: false, message: 'Tu cuenta está suspendida.' });
    return;
  }

  sendSession(res, 200, user);
};

// Usuario actual (el frontend lo usa al recargar la página para recuperar la sesión y el rol)
export const me = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, user: req.Usuario });
};

// Cerrar sesión: subir tokenVersion invalida este token y cualquier otro emitido antes
export const logout = async (req: Request, res: Response): Promise<void> => {
  await User.updateOne({ _id: req.Usuario?.id }, { $inc: { tokenVersion: 1 } });
  res.status(200).json({ success: true, message: 'Sesión cerrada.' });
};
