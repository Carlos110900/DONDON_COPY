import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { Role, Session } from '../../services/session';

/** Muestra el elemento solo si el rol actual está en la lista: *appHasRole="['admin']" */
@Directive({
  selector: '[appHasRole]',
})
export class HasRole {
  readonly appHasRole = input.required<Role[]>();

  private readonly session = inject(Session);
  private readonly template = inject(TemplateRef);
  private readonly container = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      this.container.clear();
      if (this.appHasRole().includes(this.session.role())) {
        this.container.createEmbeddedView(this.template);
      }
    });
  }
}
