import mongoose, { Schema } from 'mongoose';

export interface ITag {
  name: string;
}

const tagSchema = new Schema<ITag>(
  { name: { type: String, required: true, trim: true, maxlength: 40 } },
  {
    toJSON: {
      transform: (_doc, ret) => ({ id: String(ret['_id']), name: ret['name'] }),
    },
  },
);
// Único sin distinguir mayúsculas ni acentos ("accion" == "Acción")
tagSchema.index({ name: 1 }, { unique: true, collation: { locale: 'es', strength: 1 } });

export default mongoose.model<ITag>('Tag', tagSchema);
