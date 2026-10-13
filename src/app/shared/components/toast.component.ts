import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto p-4 rounded-xl shadow-2xl flex items-center justify-between text-sm font-medium transition-all transform animate-in slide-in-from-bottom duration-300"
          [ngClass]="{
            'bg-emerald-600 text-white border border-emerald-400': toast.type === 'success',
            'bg-rose-600 text-white border border-rose-400': toast.type === 'error',
            'bg-indigo-600 text-white border border-indigo-400': toast.type === 'info',
            'bg-amber-600 text-slate-950 font-bold border border-amber-400': toast.type === 'warning'
          }"
        >
          <div class="flex items-center gap-3">
            @if (toast.type === 'success') {
              <span class="text-xl">✨</span>
            } @else if (toast.type === 'error') {
              <span class="text-xl">❌</span>
            } @else if (toast.type === 'warning') {
              <span class="text-xl">⚠️</span>
            } @else {
              <span class="text-xl">ℹ️</span>
            }
            <p>{{ toast.message }}</p>
          </div>
          <button
            (click)="toastService.dismiss(toast.id)"
            class="ml-3 text-white/80 hover:text-white font-bold p-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
