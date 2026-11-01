import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-data-state',
  templateUrl: './data-state.html',
  styleUrl: './data-state.scss',
})
export class DataState {
  readonly kind = input.required<'loading' | 'error' | 'empty'>();
  readonly message = input('');
  readonly retryable = input(false);
  readonly retry = output<void>();
}
