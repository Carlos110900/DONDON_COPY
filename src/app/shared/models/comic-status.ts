export const COMIC_STATUSES = [
  { value: 'ongoing', label: 'En publicación' },
  { value: 'paused', label: 'En pausa' },
  { value: 'completed', label: 'Finalizado' },
] as const;

export type ComicStatus = (typeof COMIC_STATUSES)[number]['value'];
