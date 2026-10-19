import { Component, inject } from '@angular/core';
import { Confirm } from '../../services/confirm/confirm';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  protected readonly confirm = inject(Confirm);
}
