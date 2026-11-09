// Crea usuarios de prueba (uno por rol) y los tags iniciales. Uso: npm run seed
import mongoose from 'mongoose';
import { env } from '../config/env';
import { connectDB } from '../dataBase/mongodb';
import Tag from '../models/tag';
import type { Role } from '../models/user';
import User from '../models/user';

if (env.NODE_ENV === 'production') {
  console.error('El seed no se ejecuta en producción.');
  process.exit(1);
}

const TEST_USERS: { name: string; email: string; password: string; role: Role }[] = [
  { name: 'Admin Prueba', email: 'admin@dondo.test', password: 'Admin12345', role: 'admin' },
  {
    name: 'Publicador Prueba',
    email: 'publicador@dondo.test',
    password: 'Publisher12345',
    role: 'publisher',
  },
  { name: 'Lector Prueba', email: 'lector@dondo.test', password: 'Reader12345', role: 'reader' },
];

const SEED_TAGS = [
  'Acción',
  'Aventura',
  'Ciencia ficción',
  'Crimen',
  'Deportes',
  'Drama',
  'Superhéroes',
];

await connectDB();

for (const data of TEST_USERS) {
  const user = (await User.findOne({ email: data.email })) ?? new User({ email: data.email });
  user.name = data.name;
  user.role = data.role;
  user.status = 'active';
  await user.setPassword(data.password);
  await user.save();
  console.log(`Usuario listo: ${data.email} (${data.role})`);
}

for (const name of SEED_TAGS) {
  if (!(await Tag.exists({ name }))) await Tag.create({ name });
}
console.log('Tags listos.');

await mongoose.disconnect();
