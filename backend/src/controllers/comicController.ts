import type { Request, Response } from 'express';
import Comic from '../models/comic';
import type { ComicInput } from '../validators/schemas';
import { slugify } from '../utils/slugify';

const idParam = (req: Request): string => String(req.params.id);

const notFound = (res: Response): void => {
  res.status(404).json({ success: false, message: 'Cómic no encontrado.' });
};

// Mismo contrato que json-server: GET /comics y GET /comics?id=slug (validador asíncrono)
export const getComics = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.query.id === 'string' ? req.query.id : null;
  const comics = await (id ? Comic.find({ _id: id }) : Comic.find({}).sort({ createdAt: 1 }));
  res.status(200).json(comics);
};

export const getComic = async (req: Request, res: Response): Promise<void> => {
  const comic = await Comic.findById(idParam(req));
  if (!comic) return notFound(res);
  res.status(200).json(comic);
};

// publisher o admin (lo exige la ruta). El dueño sale de la sesión, no del body.
export const createComic = async (req: Request, res: Response): Promise<void> => {
  const input = req.body as ComicInput;
  const id = slugify(input.title);
  if (!id) {
    res.status(400).json({ success: false, message: 'El título no es válido.' });
    return;
  }

  const comic = await Comic.create({ ...input, _id: id, chapters: [], owner: req.Usuario?.id });
  res.status(201).json(comic);
};

// Solo el dueño o un admin. Los capítulos no se tocan aquí.
export const updateComic = async (req: Request, res: Response): Promise<void> => {
  const comic = await Comic.findById(idParam(req));
  if (!comic) return notFound(res);

  const isOwner = comic.owner?.toString() === req.Usuario?.id;
  if (req.Usuario?.role !== 'admin' && !isOwner) {
    res.status(403).json({
      success: false,
      message: 'No tienes permiso para realizar esta acción.',
    });
    return;
  }

  comic.set(req.body as Partial<ComicInput>);
  await comic.save();
  res.status(200).json(comic);
};

// Solo admin (lo exige la ruta)
export const deleteComic = async (req: Request, res: Response): Promise<void> => {
  const comic = await Comic.findByIdAndDelete(idParam(req));
  if (!comic) return notFound(res);
  res.status(200).json({});
};
