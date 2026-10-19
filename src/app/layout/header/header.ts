import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HasRole } from '../../shared/directives/has-role/has-role';
import { SearchServices } from '../../shared/services/search-services';
import { Session } from '../../shared/services/session';
import { Toast } from '../../shared/services/toast/toast';

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterLink, RouterLinkActive, HasRole],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly appTitle = input<string>('DonDoDontonbori');
  protected readonly search = inject(SearchServices);
  protected readonly session = inject(Session);
  private readonly router = inject(Router);
  private readonly toast = inject(Toast);

  logout(): void {
    this.session.logout();
    this.toast.show('Cerraste sesión.', 'info');
    this.router.navigate(['/']);
  }
}
