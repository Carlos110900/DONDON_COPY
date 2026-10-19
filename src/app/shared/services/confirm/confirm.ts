import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Confirm {
  readonly message = signal<string | null>(null);
  private resolver?: (value: boolean) => void;

  /** Abre el diálogo y devuelve true (Sí) o false (No). */
  ask(message: string): Promise<boolean> {
    this.message.set(message);
    return new Promise((resolve) => (this.resolver = resolve));
  }

  answer(value: boolean): void {
    this.message.set(null);
    this.resolver?.(value);
  }
}
