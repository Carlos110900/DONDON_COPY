import { Involved } from './involved';

describe('Involved', () => {
  it('exposes the role and role label', () => {
    const involved = new Involved('Ana', 'writer');

    expect(involved.isWriter).toBe(true);
    expect(involved.isArtist).toBe(false);
    expect(involved.roleLabel).toBe('Escritor');
  });
});
