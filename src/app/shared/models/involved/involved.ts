export type InvolvedRole = 'writer' | 'artist';

/** Persona que participó en un cómic (escritor o dibujante). */
export class Involved {
  constructor(
    public readonly name: string,
    public readonly role: InvolvedRole,
  ) {}

  get isWriter(): boolean {
    return this.role === 'writer';
  }

  get isArtist(): boolean {
    return this.role === 'artist';
  }

  get roleLabel(): string {
    return this.isWriter ? 'Escritor' : 'Dibujante';
  }
}
