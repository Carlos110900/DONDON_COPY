import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  readonly features = [
    {
      icon: '📚',
      title: 'Catálogo ordenado',
      text: 'Busca y filtra mangas, cómics y novelas gráficas.',
    },
    {
      icon: '🔖',
      title: 'Tu progreso',
      text: 'Marca lo que ya leíste y retoma donde te quedaste.',
    },
    { icon: '🔔', title: 'Avisos', text: 'Entérate cuando tus favoritos tengan capítulo nuevo.' },
  ];
}
