import mongoose, { Schema } from 'mongoose';

export const COMIC_STATUSES = ['ongoing', 'paused', 'completed'] as const;

export interface IComic {
  _id: string; // slug del título, igual que el "id" que ya usa el frontend
  title: string;
  description: string;
  cover: string;
  publisher: string;
  genres: string[];
  status: (typeof COMIC_STATUSES)[number];
  involved: { name: string; role: 'writer' | 'artist' }[];
  chapters: { number: number; title: string; pdfUrl: string }[];
  owner?: mongoose.Types.ObjectId;
}

const comicSchema = new Schema<IComic>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    cover: { type: String, required: true },
    publisher: { type: String, required: true, trim: true },
    genres: { type: [String], default: [] },
    status: { type: String, enum: COMIC_STATUSES, default: 'ongoing' },
    involved: {
      type: [{ _id: false, name: String, role: { type: String, enum: ['writer', 'artist'] } }],
      default: [],
    },
    chapters: {
      type: [{ _id: false, number: Number, title: String, pdfUrl: String }],
      default: [],
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const out: Record<string, unknown> = { ...ret };
        out['id'] = out['_id'];
        delete out['_id'];
        delete out['__v'];
        if (out['owner']) out['owner'] = String(out['owner']);
        return out;
      },
    },
  },
);

export default mongoose.model<IComic>('Comic', comicSchema);
