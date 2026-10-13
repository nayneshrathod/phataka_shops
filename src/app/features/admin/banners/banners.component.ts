import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { ToastService } from '@core/services/toast.service';
import { Banner } from '@core/models';

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 lg:p-8 space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif">
            होमपेज बॅनर व्यवस्थापन (Banner Campaigns)
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            सण-उत्सव, विशेष सवलती आणि मोहिमांचे बॅनर्स नियंत्रित करा
          </p>
        </div>

        <button
          type="button"
          (click)="openAddModal()"
          class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-colors flex items-center gap-2"
        >
          <span>➕</span> नवीन बॅनर जोडा
        </button>
      </div>

      <!-- Banners Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (b of productService.banners(); track b.id) {
          <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div class="relative pt-[45%] bg-slate-900">
              <img [src]="b.imageUrl" [alt]="b.title.mr" class="absolute inset-0 w-full h-full object-cover" />
              <div class="absolute top-3 right-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="b.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-500'">
                  {{ b.active ? 'सक्रीय (Active)' : 'बंद (Inactive)' }}
                </span>
              </div>
            </div>

            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between text-xs text-slate-500">
                <span>क्रमवारी: #{{ b.sortOrder }}</span>
                <span>कालावधी: {{ b.startDate }} ते {{ b.endDate }}</span>
              </div>

              <h3 class="text-base font-bold text-white font-serif">
                {{ b.title.mr }}
              </h3>
              <p class="text-xs text-slate-400">
                {{ b.subtitle?.mr }}
              </p>

              <div class="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                <span class="text-purple-400 font-mono text-[11px] truncate max-w-xs">
                  लिंक: {{ b.targetUrl }}
                </span>
                <div class="space-x-2">
                  <button
                    type="button"
                    (click)="openEditModal(b)"
                    class="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold"
                  >
                    संपादित करा
                  </button>
                  <button
                    type="button"
                    (click)="deleteBanner(b)"
                    class="px-3 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-400 font-bold"
                  >
                    हटवा
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Banner Modal -->
      @if (modalOpen()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="text-base font-bold text-white font-serif">
                {{ editingId() ? 'बॅनर संपादित करा' : 'नवीन बॅनर जोडा' }}
              </h3>
              <button type="button" (click)="closeModal()" class="text-slate-400 hover:text-white font-bold p-1">
                ✕
              </button>
            </div>

            <form [formGroup]="bannerForm" (ngSubmit)="saveBanner()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">शीर्षक (Title - मराठी) *</label>
                <input type="text" formControlName="titleMr" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">उप-शीर्षक (Subtitle) *</label>
                <input type="text" formControlName="subMr" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">चित्र URL *</label>
                  <input type="text" formControlName="imageUrl" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">टार्गेट URL (Page Link) *</label>
                  <input type="text" formControlName="targetUrl" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">सुरू तारीख</label>
                  <input type="date" formControlName="startDate" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">समाप्ती तारीख</label>
                  <input type="date" formControlName="endDate" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500" />
                </div>
              </div>

              <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input type="checkbox" formControlName="active" class="rounded text-purple-600 w-4 h-4" />
                <span>सक्रीय प्रदर्शित करा (Active)</span>
              </label>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" (click)="closeModal()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                  रद्द करा
                </button>
                <button type="submit" [disabled]="bannerForm.invalid" class="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md">
                  जतन करा
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminBannersComponent {
  productService = inject(ProductService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  modalOpen = signal<boolean>(false);
  editingId = signal<string | null>(null);

  bannerForm: FormGroup = this.fb.group({
    titleMr: ['', Validators.required],
    subMr: ['', Validators.required],
    imageUrl: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop&q=80', Validators.required],
    targetUrl: ['/products', Validators.required],
    startDate: ['2026-09-01'],
    endDate: ['2026-11-30'],
    active: [true]
  });

  openAddModal(): void {
    this.editingId.set(null);
    this.bannerForm.reset({
      titleMr: 'दिवाळी महा-उत्सव',
      subMr: 'सर्वोत्तम दर्जाचे हरित फटाके थेट शिवकाशीहून',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop&q=80',
      targetUrl: '/products',
      startDate: '2026-09-01',
      endDate: '2026-11-30',
      active: true
    });
    this.modalOpen.set(true);
  }

  openEditModal(b: Banner): void {
    this.editingId.set(b.id);
    this.bannerForm.patchValue({
      titleMr: b.title.mr,
      subMr: b.subtitle?.mr || '',
      imageUrl: b.imageUrl,
      targetUrl: b.targetUrl || '/products',
      startDate: b.startDate,
      endDate: b.endDate,
      active: b.active
    });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingId.set(null);
  }

  saveBanner(): void {
    if (this.bannerForm.invalid) return;
    const v = this.bannerForm.value;

    if (this.editingId()) {
      this.productService.updateBanner(this.editingId()!, {
        title: { mr: v.titleMr, hi: v.titleMr, en: v.titleMr },
        subtitle: { mr: v.subMr, hi: v.subMr, en: v.subMr },
        imageUrl: v.imageUrl,
        targetUrl: v.targetUrl,
        startDate: v.startDate,
        endDate: v.endDate,
        active: v.active
      });
      this.toastService.success('बॅनर अद्ययावत केला!');
    } else {
      this.productService.createBanner({
        title: { mr: v.titleMr, hi: v.titleMr, en: v.titleMr },
        subtitle: { mr: v.subMr, hi: v.subMr, en: v.subMr },
        imageUrl: v.imageUrl,
        targetUrl: v.targetUrl,
        startDate: v.startDate,
        endDate: v.endDate,
        active: v.active,
        sortOrder: this.productService.banners().length + 1
      });
      this.toastService.success('नवीन बॅनर जोडला गेला!');
    }
    this.closeModal();
  }

  deleteBanner(b: Banner): void {
    if (confirm(`नक्की बॅनर हटवायचा आहे का?`)) {
      this.productService.deleteBanner(b.id);
      this.toastService.success('बॅनर हटवला गेला!');
    }
  }
}
