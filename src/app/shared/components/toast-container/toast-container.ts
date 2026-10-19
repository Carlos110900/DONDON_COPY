import { Component, inject } from '@angular/core';
import { Toast } from '../../services/toast/toast';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainer {
  protected readonly toast = inject(Toast);
}
