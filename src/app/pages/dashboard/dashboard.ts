import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HasRole } from '../../shared/directives/has-role/has-role';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, HasRole],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly stats = [
    { label: 'Cómics publicados', value: 12 },
    { label: 'Capítulos', value: 48 },
    { label: 'Lectores', value: 230 },
    { label: 'Comentarios nuevos', value: 5 },
  ];

  readonly activity = [
    'Se publicó el capítulo 3 de "Absolute Batman".',
    'Un lector comentó el capítulo 2 de "Dandadan".',
    'Se creó el tag "Misterio".',
  ];
}
