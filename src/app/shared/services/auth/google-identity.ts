import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
const GSI_SRC = 'https://accounts.google.com/gsi/client';

interface IGoogleApi {
  accounts?: {
    id?: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
      }) => void;
      renderButton: (
        host: HTMLElement,
        options: {
          type: 'standard';
          size: 'large';
          theme: 'outline';
          text: 'continue_with';
          shape: 'pill';
        },
      ) => void;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class GoogleIdentity {
  async renderButton(host: HTMLElement, onSuccess: (idToken: string) => void): Promise<void> {
    if (!environment.googleClientId || typeof window === 'undefined') return;
    await this.loadScript();

    const google = (window as typeof window & { google?: IGoogleApi }).google;
    if (!google?.accounts?.id) return;

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential?: string }) => {
        if (response.credential) onSuccess(response.credential);
      },
    });

    google.accounts.id.renderButton(host, {
      type: 'standard',
      size: 'large',
      theme: 'outline',
      text: 'continue_with',
      shape: 'pill',
    });
  }

  private loadScript(): Promise<void> {
    const w = window as typeof window & { google?: IGoogleApi };
    if (w.google?.accounts?.id) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
      const script =
        existing ??
        Object.assign(document.createElement('script'), {
          src: GSI_SRC,
          async: true,
        });
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener('error', () => reject(new Error('gsi')), {
        once: true,
      });
      if (!existing) document.head.appendChild(script);
    });
  }
}
