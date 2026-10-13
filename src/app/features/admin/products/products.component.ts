import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/services/auth.service';
import { Product, ComplianceStatus } from '@core/models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 lg:p-8 space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif">
            फटाके व्यवस्थापन (Product Catalog)
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            उत्पादने जोडा, संपादित करा, दर व साठा अद्ययावत करा
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            (click)="exportToCsv()"
            class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-2"
          >
            <span>📥</span> CSV एक्सपोर्ट
          </button>
          
          <button
            type="button"
            (click)="openAddModal()"
            class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-colors flex items-center gap-2"
          >
            <span>➕</span> नवीन फटाका जोडा
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div class="sm:col-span-5 relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-xs">
            🔍
          </span>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="नाव किंवा SKU शोधा..."
            class="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div class="sm:col-span-4">
          <select
            [ngModel]="selectedCategory()"
            (ngModelChange)="selectedCategory.set($event)"
            class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">-- सर्व प्रकार (All Categories) --</option>
            @for (cat of productService.activeCategories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name.mr }}</option>
            }
          </select>
        </div>

        <div class="sm:col-span-3 text-right text-xs text-slate-400 font-medium">
          एकूण: <strong class="text-white">{{ filteredProducts().length }}</strong> उत्पादने
        </div>
      </div>

      <!-- Products Data Table -->
      <div class="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">चित्र</th>
                <th class="py-3 px-4">SKU / कोड</th>
                <th class="py-3 px-4">फटाक्याचे नाव</th>
                <th class="py-3 px-4">किरकोळ दर (₹)</th>
                @if (authService.isAdmin()) {
                  <th class="py-3 px-4">खरेदी किंमत (₹)</th>
                }
                <th class="py-3 px-4">शिल्लक साठा</th>
                <th class="py-3 px-4">वैशिष्ट्ये</th>
                <th class="py-3 px-4">स्थिती</th>
                <th class="py-3 px-4 text-right">कृती</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              @for (p of filteredProducts(); track p.id) {
                <tr class="hover:bg-slate-900/50 transition-colors">
                  <td class="py-3 px-4">
                    <img
                      [src]="p.images[0]"
                      [alt]="p.name.mr"
                      class="w-12 h-12 rounded-lg object-cover bg-slate-800 border border-slate-700"
                    />
                  </td>
                  <td class="py-3 px-4 font-mono font-bold text-purple-300">
                    {{ p.sku }}
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-bold text-white">{{ p.name.mr }}</div>
                    <div class="text-[11px] text-slate-400">{{ p.name.en }}</div>
                    <div class="text-[10px] text-purple-400/80">{{ p.manufacturer }}</div>
                  </td>
                  <td class="py-3 px-4 font-bold text-amber-300 text-sm">
                    ₹{{ p.retailPrice }}
                  </td>
                  @if (authService.isAdmin()) {
                    <td class="py-3 px-4 text-slate-400 font-mono">
                      ₹{{ p.costPrice || '-' }}
                    </td>
                  }
                  <td class="py-3 px-4">
                    @if (p.stockQuantity === 0) {
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        साठा संपला (0)
                      </span>
                    } @else if (p.stockQuantity <= p.lowStockThreshold) {
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                        कमी: {{ p.stockQuantity }} नग
                      </span>
                    } @else {
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {{ p.stockQuantity }} नग
                      </span>
                    }
                  </td>
                  <td class="py-3 px-4 space-x-1">
                    @if (p.featured) {
                      <span class="px-1.5 py-0.5 rounded text-[10px] bg-amber-900/60 text-amber-300 border border-amber-700">⭐ Featured</span>
                    }
                    @if (p.complianceStatus === 'green_cracker') {
                      <span class="px-1.5 py-0.5 rounded text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-700">🌱 Green</span>
                    }
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                          [ngClass]="p.active ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-500'">
                      {{ p.active ? 'सक्रीय (Active)' : 'बंद (Hidden)' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      (click)="openEditModal(p)"
                      class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-[11px] transition-colors"
                    >
                      संपादित करा
                    </button>
                    @if (authService.isAdmin()) {
                      <button
                        type="button"
                        (click)="deleteProduct(p)"
                        class="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-400 font-bold text-[11px] transition-colors"
                      >
                        हटवा
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add / Edit Modal -->
      @if (modalOpen()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 class="text-lg font-bold text-white font-serif">
                {{ editingId() ? 'फटाका संपादित करा' : 'नवीन फटाका जोडा' }}
              </h3>
              <button
                type="button"
                (click)="closeModal()"
                class="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">SKU कोड *</label>
                  <input
                    type="text"
                    formControlName="sku"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">प्रकार (Category) *</label>
                  <select
                    formControlName="categoryId"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  >
                    @for (cat of productService.activeCategories(); track cat.id) {
                      <option [value]="cat.id">{{ cat.name.mr }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">निर्माता (Manufacturer) *</label>
                  <input
                    type="text"
                    formControlName="manufacturer"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <!-- Names -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">नाव (मराठी) *</label>
                  <input
                    type="text"
                    formControlName="nameMr"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">नाव (हिंदी)</label>
                  <input
                    type="text"
                    formControlName="nameHi"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">नाव (English) *</label>
                  <input
                    type="text"
                    formControlName="nameEn"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <!-- Pricing & Stock -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">किरकोळ किंमत (₹) *</label>
                  <input
                    type="number"
                    formControlName="retailPrice"
                    min="1"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">खरेदी किंमत (₹)</label>
                  <input
                    type="number"
                    formControlName="costPrice"
                    min="1"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">शिल्लक नग (Qty) *</label>
                  <input
                    type="number"
                    formControlName="stockQuantity"
                    min="0"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">कमी साठा मर्यादा</label>
                  <input
                    type="number"
                    formControlName="lowStockThreshold"
                    min="1"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <!-- Image URL & Specifications -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">चित्र URL (Image URL)</label>
                  <input
                    type="text"
                    formControlName="imageUrl"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">NEERI हरित कोड</label>
                  <input
                    type="text"
                    formControlName="greenCrackerCode"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <!-- Descriptions -->
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">वर्णन (मराठी) *</label>
                <textarea
                  formControlName="descMr"
                  rows="2"
                  class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                ></textarea>
              </div>

              <!-- Toggles -->
              <div class="flex items-center gap-6 pt-2">
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input type="checkbox" formControlName="featured" class="rounded text-purple-600 w-4 h-4" />
                  <span>⭐ विशेष आकर्षण (Featured)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input type="checkbox" formControlName="active" class="rounded text-purple-600 w-4 h-4" />
                  <span>सक्रीय प्रदर्शित करा (Active)</span>
                </label>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  [disabled]="productForm.invalid"
                  class="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  जतन करा (Save Product)
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminProductsComponent {
  productService = inject(ProductService);
  private toastService = inject(ToastService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('');
  modalOpen = signal<boolean>(false);
  editingId = signal<string | null>(null);

  productForm: FormGroup = this.fb.group({
    sku: ['', Validators.required],
    categoryId: ['', Validators.required],
    manufacturer: ['Standard Fireworks Sivakasi', Validators.required],
    nameMr: ['', Validators.required],
    nameHi: [''],
    nameEn: ['', Validators.required],
    retailPrice: [100, [Validators.required, Validators.min(1)]],
    costPrice: [70],
    stockQuantity: [50, [Validators.required, Validators.min(0)]],
    lowStockThreshold: [15, Validators.required],
    imageUrl: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80'],
    greenCrackerCode: ['CSIR-NEERI/GC-2024'],
    descMr: ['', Validators.required],
    featured: [false],
    active: [true]
  });

  filteredProducts = computed(() => {
    let list = this.productService.products();
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    if (cat) {
      list = list.filter(p => p.categoryId === cat);
    }
    if (q) {
      list = list.filter(p =>
        p.name.mr.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return list;
  });

  openAddModal(): void {
    this.editingId.set(null);
    this.productForm.reset({
      sku: 'PRD-' + Math.floor(100 + Math.random() * 900),
      categoryId: this.productService.activeCategories()[0]?.id || '',
      manufacturer: 'Standard Fireworks Sivakasi',
      retailPrice: 150,
      costPrice: 95,
      stockQuantity: 100,
      lowStockThreshold: 20,
      imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80',
      greenCrackerCode: 'CSIR-NEERI/GC-2024-NEW',
      featured: false,
      active: true
    });
    this.modalOpen.set(true);
  }

  openEditModal(p: Product): void {
    this.editingId.set(p.id);
    this.productForm.patchValue({
      sku: p.sku,
      categoryId: p.categoryId,
      manufacturer: p.manufacturer,
      nameMr: p.name.mr,
      nameHi: p.name.hi || '',
      nameEn: p.name.en,
      retailPrice: p.retailPrice,
      costPrice: p.costPrice || 0,
      stockQuantity: p.stockQuantity,
      lowStockThreshold: p.lowStockThreshold,
      imageUrl: p.images[0] || '',
      greenCrackerCode: p.greenCrackerCode || '',
      descMr: p.description.mr,
      featured: p.featured,
      active: p.active
    });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingId.set(null);
  }

  saveProduct(): void {
    if (this.productForm.invalid) return;

    const v = this.productForm.value;
    const slug = v.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (this.editingId()) {
      // Update
      const id = this.editingId()!;
      this.productService.updateProduct(id, {
        sku: v.sku,
        categoryId: v.categoryId,
        manufacturer: v.manufacturer,
        name: { mr: v.nameMr, hi: v.nameHi || v.nameMr, en: v.nameEn },
        description: { mr: v.descMr, hi: v.descMr, en: v.descMr },
        retailPrice: Number(v.retailPrice),
        costPrice: Number(v.costPrice),
        stockQuantity: Number(v.stockQuantity),
        lowStockThreshold: Number(v.lowStockThreshold),
        images: [v.imageUrl],
        greenCrackerCode: v.greenCrackerCode,
        featured: v.featured,
        active: v.active
      });
      this.toastService.success('उत्पादन यशस्वीरित्या अद्ययावत केले!');
    } else {
      // Create
      this.productService.createProduct({
        sku: v.sku,
        slug,
        categoryId: v.categoryId,
        manufacturer: v.manufacturer,
        name: { mr: v.nameMr, hi: v.nameHi || v.nameMr, en: v.nameEn },
        description: { mr: v.descMr, hi: v.descMr, en: v.descMr },
        retailPrice: Number(v.retailPrice),
        costPrice: Number(v.costPrice),
        stockQuantity: Number(v.stockQuantity),
        lowStockThreshold: Number(v.lowStockThreshold),
        images: [v.imageUrl],
        safetyInformation: {
          mr: 'खुल्या जागेत वापरा. सुरक्षित अंतर ठेवा.',
          hi: 'खुली जगह पर इस्तेमाल करें। दूरी बनाएं।',
          en: 'Use strictly in open outdoor area.'
        },
        complianceStatus: 'green_cracker',
        greenCrackerCode: v.greenCrackerCode,
        featured: v.featured,
        active: v.active
      });
      this.toastService.success('नवीन उत्पादन जोडले गेले!');
    }

    this.closeModal();
  }

  deleteProduct(p: Product): void {
    if (confirm(`तुम्हाला नक्की "${p.name.mr}" (${p.sku}) हटवायचे आहे का?`)) {
      this.productService.deleteProduct(p.id);
      this.toastService.success('उत्पादन हटवले गेले!');
    }
  }

  exportToCsv(): void {
    const list = this.productService.products();
    let csv = 'ID,SKU,Name_MR,Name_EN,Category,RetailPrice,CostPrice,Stock,LowStockThreshold,Active\n';
    list.forEach(p => {
      csv += `"${p.id}","${p.sku}","${p.name.mr}","${p.name.en}","${p.categoryId}",${p.retailPrice},${p.costPrice || 0},${p.stockQuantity},${p.lowStockThreshold},${p.active}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pratik_phatake_products_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    this.toastService.success('CSV अहवाल डाउनलोड झाला!');
  }
}
