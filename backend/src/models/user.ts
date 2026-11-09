// Imports
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
// bcryptjs (v3 ya trae sus tipos)

const saltRounds = 12;

export const ROLES = ['reader', 'publisher', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ['active', 'banned'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

// Interfaz
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Opcional por googleID
  role: Role;
  status: UserStatus;
  /** Se incrementa al cerrar sesión o suspender: invalida todos los tokens anteriores. */
  tokenVersion: number;
  creationDate: Date;
  photo: string;
  descripcion?: string;
  googleID?: string;
  setPassword(password: string): Promise<void>;
  validatePassword(unhashed: string): Promise<boolean>;
}

/** Lo único que el cliente puede ver de un usuario (nunca hash ni versión de token). */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  photo: string;
}

export const toPublicUser = (user: IUser): PublicUser => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  photo: user.photo,
});

// Schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /@/,
  },
  password: {
    type: String,
    required: false,
    select: false, // nunca sale en una consulta salvo que se pida con .select('+password')
  },
  // Por defecto todos nacen como lector; publisher/admin se asignan desde MongoDB o por un admin
  role: {
    type: String,
    enum: ROLES,
    default: 'reader',
    required: true,
  },
  status: {
    type: String,
    enum: USER_STATUSES,
    default: 'active',
    required: true,
  },
  tokenVersion: {
    type: Number,
    default: 0,
    select: false,
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  // revisar
  photo: {
    type: String,
    required: false,
    default: 'default.png',
  },
  descripcion: {
    type: String,
    required: false,
    default: '',
  },
  // golge id
  googleID: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
});

userSchema.method('setPassword', async function (this: IUser, password: string): Promise<void> {
  this.password = await bcrypt.hash(password, saltRounds);
});

userSchema.method(
  'validatePassword',
  async function (this: IUser, unhashed: string): Promise<boolean> {
    // puede ser falso por google
    if (!this.password) return false;
    return bcrypt.compare(unhashed, this.password);
  },
);

// Exports
const user = mongoose.model<IUser>('User', userSchema);
export default user;
