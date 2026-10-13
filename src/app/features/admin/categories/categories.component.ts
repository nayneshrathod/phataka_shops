import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { ToastService } from '@core/services/toast.service';
import { Category } from '@core/models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 lg:p-8 space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif">
            फटाके प्रकार व्यवस्थापन (Category Management)
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            वेबसाइटवरील प्रकार व क्रमवारी नियंत्रित करा
          </p>
        </div>

        <button
          type="button"
          (click)="openAddModal()"
          class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-colors flex items-center gap-2"
        >
          <span>➕</span> नवीन प्रकार जोडा (Add Category)
        </button>
      </div>

      <!-- Categories Table -->
      <div class="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">चित्र</th>
                <th class="py-3 px-4">प्रकाराचे नाव (मराठी)</th>
                <th class="py-3 px-4">English Name</th>
                <th class="py-3 px-4">Slug</th>
                <th class="py-3 px-4">क्रमवारी (Order)</th>
                <th class="py-3 px-4">स्थिती</th>
                <th class="py-3 px-4 text-right">कृती</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              @for (cat of productService.categories(); track cat.id) {
                <tr class="hover:bg-slate-900/50 transition-colors">
                  <td class="py-3 px-4">
                    <img [src]="cat.image" [alt]="cat.name.mr" class="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700" />
                  </td>
                  <td class="py-3 px-4 font-bold text-white text-sm">
                    {{ cat.name.mr }}
                  </td>
                  <td class="py-3 px-4 text-slate-300 font-medium">
                    {{ cat.name.en }}
                  </td>
                  <td class="py-3 px-4 font-mono text-purple-300">
                    {{ cat.slug }}
                  </td>
                  <td class="py-3 px-4 font-bold text-amber-300">
                    #{{ cat.sortOrder }}
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                          [ngClass]="cat.active ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-500'">
                      {{ cat.active ? 'सक्रीय' : 'बंद' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      (click)="openEditModal(cat)"
                      class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-[11px]"
                    >
                      संपादित करा
                    </button>
                    <button
                      type="button"
                      (click)="deleteCategory(cat)"
                      class="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-400 font-bold text-[11px]"
                    >
                      हटवा
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Category Modal -->
      @if (modalOpen()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="text-base font-bold text-white font-serif">
                {{ editingId() ? 'प्रकार संपादित करा' : 'नवीन प्रकार जोडा' }}
              </h3>
              <button type="button" (click)="closeModal()" class="text-slate-400 hover:text-white font-bold p-1">
                ✕
              </button>
            </div>

            <form [formGroup]="catForm" (ngSubmit)="saveCategory()" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">नाव (मराठी) *</label>
                  <input type="text" formControlName="nameMr" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">नाव (English) *</label>
                  <input type="text" formControlName="nameEn" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">क्रमवारी (Sort Order) *</label>
                  <input type="number" formControlName="sortOrder" min="1" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">चित्र URL *</label>
                  <input type="text" formControlName="image" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">वर्णन (मराठी)</label>
                <textarea formControlName="descMr" rows="2" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"></textarea>
              </div>

              <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input type="checkbox" formControlName="active" class="rounded text-purple-600 w-4 h-4" />
                <span>सक्रीय प्रदर्शित करा (Active)</span>
              </label>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" (click)="closeModal()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                  रद्द करा
                </button>
                <button type="submit" [disabled]="catForm.invalid" class="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md">
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
export class AdminCategoriesComponent {
  productService = inject(ProductService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  modalOpen = signal<boolean>(false);
  editingId = signal<string | null>(null);

  catForm: FormGroup = this.fb.group({
    nameMr: ['', Validators.required],
    nameEn: ['', Validators.required],
    image: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80', Validators.required],
    sortOrder: [1, Validators.required],
    descMr: ['सुरक्षित व मनमोहक फटाके'],
    active: [true]
  });

  openAddModal(): void {
    this.editingId.set(null);
    this.catForm.reset({
      nameMr: '',
      nameEn: '',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
      sortOrder: this.productService.categories().length + 1,
      descMr: 'सुरक्षित व मनमोहक फटाके',
      active: true
    });
    this.modalOpen.set(true);
  }

  openEditModal(cat: Category): void {
    this.editingId.set(cat.id);
    this.catForm.patchValue({
      nameMr: cat.name.mr,
      nameEn: cat.name.en,
      image: cat.image,
      sortOrder: cat.sortOrder,
      descMr: cat.description.mr,
      active: cat.active
    });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingId.set(null);
  }

  saveCategory(): void {
    if (this.catForm.invalid) return;
    const v = this.catForm.value;
    const slug = v.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (this.editingId()) {
      this.productService.updateCategory(this.editingId()!, {
        name: { mr: v.nameMr, hi: v.nameMr, en: v.nameEn },
        description: { mr: v.descMr, hi: v.descMr, en: v.descMr },
        image: v.image,
        sortOrder: Number(v.sortOrder),
        active: v.active,
        slug
      });
      this.toastService.success('प्रकार अद्ययावत केला!');
    } else {
      this.productService.createCategory({
        slug,
        name: { mr: v.nameMr, hi: v.nameMr, en: v.nameEn },
        description: { mr: v.descMr, hi: v.descMr, en: v.descMr },
        image: v.image,
        sortOrder: Number(v.sortOrder),
        active: v.active
      });
      this.toastService.success('नवीन प्रकार जोडला!');
    }
    this.closeModal();
  }

  deleteCategory(cat: Category): void {
    if (confirm(`नक्की "${cat.name.mr}" प्रकार हटवायचा आहे का?`)) {
      this.productService.deleteCategory(cat.id);
      this.toastService.success('प्रकार हटवला गेला!');
    }
  }
}
