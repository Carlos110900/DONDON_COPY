export const PAGE_SIZE = 4;

export interface Page<T> {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
}

export function paginate<T>(list: readonly T[], page: number, size = PAGE_SIZE): Page<T> {
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  const current = Math.min(Math.max(1, page), totalPages); // se ajusta si borraste el último de la página
  return {
    items: list.slice((current - 1) * size, current * size),
    page: current,
    totalPages,
    total: list.length,
  };
}
