import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.html',
  styleUrl: './pdf-viewer.scss',
})
export class PdfViewer {
  readonly url = input.required<string>();
  readonly title = input<string>('Visor de PDF');

  private readonly sanitizer = inject(DomSanitizer);
  readonly safeUrl = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.url()));
}
