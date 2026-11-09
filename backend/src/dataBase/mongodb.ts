'use strict';
import mongoose from 'mongoose';
import { env } from '../config/env';

export const connectDB = async (): Promise<void> => {
  try {
    // Defensa contra inyección NoSQL: los objetos con operadores ($ne, $gt...) que lleguen
    // dentro de un filtro se tratan como valores literales y no como operadores.
    mongoose.set('sanitizeFilter', true);
    mongoose.set('strictQuery', true);

    await mongoose.connect(env.MONGO_URI);
    console.log('Se logro Yei');
  } catch (error) {
    // Es mejor ver el error real que solo decir "muerte fatal" para debuguear
    console.error('Error crítico al conectar a la base de datos:', error);
    process.exit(1);
  }
};
