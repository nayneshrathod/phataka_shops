import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);

  readonly toasts = this.toastsSignal.asReadonly();

  show(type: 'success' | 'error' | 'info' | 'warning', message: string, durationMs = 4000): void {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const newToast: ToastMessage = { id, type, message };
    this.toastsSignal.set([...this.toastsSignal(), newToast]);

    setTimeout(() => {
      this.dismiss(id);
    }, durationMs);
  }

  success(msg: string): void {
    this.show('success', msg);
  }

  error(msg: string): void {
    this.show('error', msg);
  }

  info(msg: string): void {
    this.show('info', msg);
  }

  warning(msg: string): void {
    this.show('warning', msg);
  }

  dismiss(id: string): void {
    this.toastsSignal.set(this.toastsSignal().filter(t => t.id !== id));
  }
}
