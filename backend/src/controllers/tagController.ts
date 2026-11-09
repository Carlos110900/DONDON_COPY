import type { Request, Response } from 'express';
import Comic from '../models/comic';
import Tag from '../models/tag';

const idParam = (req: Request): string => String(req.params.id);

export const getTags = async (_req: Request, res: Response): Promise<void> => {
  const tags = await Tag.find({}).sort({ name: 1 });
  res.status(200).json(tags);
};

export const createTag = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body as { name: string };
  // Un tag duplicado lo rechaza el índice único (409 en el errorHandler)
  const tag = await Tag.create({ name });
  res.status(201).json(tag);
};

export const renameTag = async (req: Request, res: Response): Promise<void> => {
  const tag = await Tag.findById(idParam(req));
  if (!tag) {
    res.status(404).json({ success: false, message: 'Tag no encontrado.' });
    return;
  }

  const previous = tag.name;
  tag.name = (req.body as { name: string }).name;
  await tag.save();
  // Los cómics guardan el nombre del tag, así que se actualizan también
  await Comic.updateMany({ genres: previous }, { $set: { 'genres.$': tag.name } });
  res.status(200).json(tag);
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  const tag = await Tag.findByIdAndDelete(idParam(req));
  if (!tag) {
    res.status(404).json({ success: false, message: 'Tag no encontrado.' });
    return;
  }

  await Comic.updateMany({ genres: tag.name }, { $pull: { genres: tag.name } });
  res.status(200).json({});
};
