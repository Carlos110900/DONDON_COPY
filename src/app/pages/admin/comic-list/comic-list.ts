import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Confirm } from '../../../shared/services/confirm/confirm';
import { Toast } from '../../../shared/services/toast/toast';

interface ComicRow {
  id: string;
  title: string;
  publisher: string;
  chapters: number;
  status: 'En curso' | 'Finalizado';
}

@Component({
  selector: 'app-comic-list',
  imports: [RouterLink],
  templateUrl: './comic-list.html',
  styleUrl: './comic-list.scss',
})
export class ComicList {
  private readonly confirm = inject(Confirm);
  private readonly toast = inject(Toast);

  readonly rows: ComicRow[] = [
    {
      id: 'absolute-batman',
      title: 'Absolute Batman',
      publisher: 'DC Comics',
      chapters: 1,
      status: 'En curso',
    },
    { id: 'dandadan', title: 'Dandadan', publisher: 'Shueisha', chapters: 24, status: 'En curso' },
    { id: 'akira', title: 'Akira', publisher: 'Kodansha', chapters: 120, status: 'Finalizado' },
    { id: 'maus', title: 'Maus', publisher: 'Pantheon', chapters: 6, status: 'Finalizado' },
  ];

  async remove(row: ComicRow): Promise<void> {
    const ok = await this.confirm.ask(`¿Deseas eliminar "${row.title}"?`);
    if (ok) {
      // No se elimina nada: la entrega solo pide mostrar el mensaje.
      this.toast.show('Confirmaste la eliminación (demo: no se borró nada).', 'info');
    }
  }
}
