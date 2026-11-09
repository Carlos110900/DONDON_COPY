import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import comicRoutes from './routes/comics';
import tagRoutes from './routes/tags';
import userRoutes from './routes/users';
import { connectDB } from './dataBase/mongodb';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// 1 MB: alcanza para la portada comprimida que manda el formulario (hasta que exista S3)
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tags', tagRoutes);
app.use('/comics', comicRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Aplicación corriendo en http://localhost:${env.PORT}`);
  });
};

void start().catch((error: unknown) => {
  console.error('No se pudo iniciar la aplicación:', error);
  process.exitCode = 1;
});
