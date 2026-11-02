import { COMIC_STATUSES } from './comic-status';

describe('comic status values', () => {
  it('defines a label for every supported status', () => {
    expect(COMIC_STATUSES).toEqual([
      { value: 'ongoing', label: 'En publicación' },
      { value: 'paused', label: 'En pausa' },
      { value: 'completed', label: 'Finalizado' },
    ]);
  });
});
