import { ComicStatus } from '../models/comic';
import { InvolvedRole } from '../models/involved/involved';

export interface InvolvedDto {
  name: string;
  role: InvolvedRole;
}

export interface ChapterDto {
  number: number;
  title: string;
  pdfUrl: string;
}

export interface ComicDto {
  id: string;
  title: string;
  description: string;
  cover: string;
  publisher: string;
  status: ComicStatus;
  genres: string[];
  involved: InvolvedDto[];
  chapters: ChapterDto[];
}

/** Lo que el formulario puede escribir. Los capítulos no se tocan al editar. */
export type ComicInput = Omit<ComicDto, 'id' | 'chapters'>;
