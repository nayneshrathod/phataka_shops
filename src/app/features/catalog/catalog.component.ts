import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { TranslationService } from '@core/i18n/translation.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ProductCardComponent } from '@shared/components/product-card.component';
import { Product } from '@core/models';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe, ProductCardComponent],
  template: `
    <div class="py-10 bg-[#FAF9FF] min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div class="relative z-10 max-w-2xl space-y-3">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              🌱 {{ 'legal.greenCrackers' | translate }}
            </span>
            <h1 class="text-3xl sm:text-4xl font-black font-serif">
              {{ 'catalog.title' | translate }}
            </h1>
            <p class="text-sm text-purple-200/90 leading-relaxed">
              {{ 'catalog.subtitle' | translate }}
            </p>
          </div>
          <div class="absolute -right-8 -bottom-8 text-9xl opacity-15 select-none pointer-events-none">
            🎆
          </div>
        </div>

        <!-- Statutory Notice Reminder -->
        <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <span class="text-lg">⚖️</span>
          <div>
            <strong>{{ 'common.disclaimer' | translate }}:</strong> {{ 'legal.noticeBody' | translate }}
          </div>
        </div>

        <!-- Filter & Search Controls Bar -->
        <div class="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            <!-- Search Input -->
            <div class="md:col-span-5 relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
                [placeholder]="'common.search' | translate"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-purple-50/20"
              />
            </div>

            <!-- Sort By Select -->
            <div class="md:col-span-4 flex items-center gap-2">
              <label class="text-xs font-bold text-slate-500 whitespace-nowrap">
                {{ 'catalog.sortBy' | translate }}:
              </label>
              <select
                [ngModel]="sortBy()"
                (ngModelChange)="sortBy.set($event)"
                class="w-full px-3 py-2.5 rounded-xl border border-purple-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="featured">⭐ {{ 'catalog.sortPopular' | translate }}</option>
                <option value="price_asc">₹ {{ 'catalog.sortPriceAsc' | translate }}</option>
                <option value="price_desc">₹ {{ 'catalog.sortPriceDesc' | translate }}</option>
                <option value="name">🔤 {{ 'catalog.sortName' | translate }}</option>
              </select>
            </div>

            <!-- In-stock Only Toggle -->
            <div class="md:col-span-3 flex items-center md:justify-end">
              <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  [ngModel]="onlyAvailable()"
                  (ngModelChange)="onlyAvailable.set($event)"
                  class="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 border-slate-300"
                />
                <span>{{ 'catalog.onlyAvailable' | translate }}</span>
              </label>
            </div>

          </div>

          <!-- Category Pill Buttons -->
          <div class="pt-3 border-t border-purple-50 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              (click)="selectedCategory.set('')"
              [ngClass]="{
                'bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20': selectedCategory() === '',
                'bg-purple-50 text-slate-700 hover:bg-purple-100 font-medium': selectedCategory() !== ''
              }"
              class="px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all focus:outline-none cursor-pointer"
            >
              {{ 'catalog.allCategories' | translate }}
            </button>
            @for (cat of productService.activeCategories(); track cat.id) {
              <button
                type="button"
                (click)="selectedCategory.set(cat.id)"
                [ngClass]="{
                  'bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20': selectedCategory() === cat.id,
                  'bg-purple-50 text-slate-700 hover:bg-purple-100 font-medium': selectedCategory() !== cat.id
                }"
                class="px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all focus:outline-none cursor-pointer"
              >
                {{ getCatName(cat) }}
              </button>
            }
          </div>
        </div>

        <!-- Results Summary & Count -->
        <div class="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
          <span>{{ 'catalog.title' | translate }}: <strong class="text-purple-900">{{ filteredProducts().length }}</strong></span>
          @if (searchQuery() || selectedCategory() || onlyAvailable()) {
            <button
              type="button"
              (click)="resetFilters()"
              class="text-purple-600 hover:text-purple-800 font-bold underline focus:outline-none cursor-pointer"
            >
              {{ 'common.reset' | translate }}
            </button>
          }
        </div>

        <!-- Product Grid -->
        @if (filteredProducts().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (product of paginatedProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>

          <!-- Pagination Controls -->
          @if (totalPages() > 1) {
            <div class="pt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                (click)="prevPage()"
                [disabled]="currentPage() === 1"
                class="px-4 py-2 rounded-xl text-xs font-bold border border-purple-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
              >
                ← मागील पान
              </button>
              
              <span class="px-4 py-2 text-xs font-bold text-purple-900">
                पान {{ currentPage() }} / {{ totalPages() }}
              </span>

              <button
                type="button"
                (click)="nextPage()"
                [disabled]="currentPage() === totalPages()"
                class="px-4 py-2 rounded-xl text-xs font-bold border border-purple-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
              >
                पुढील पान →
              </button>
            </div>
          }
        } @else {
          <!-- Empty State -->
          <div class="text-center py-20 bg-white rounded-3xl border border-purple-100 p-8 space-y-4">
            <span class="text-6xl">🔍</span>
            <h3 class="text-lg font-bold text-slate-900">
              {{ 'catalog.noProducts' | translate }}
            </h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              आपल्या निकषांनुसार फटाके उपलब्ध नाहीत. कृपया दुसरे नाव शोधा किंवा फिल्टर्स बदला.
            </p>
            <button
              type="button"
              (click)="resetFilters()"
              class="px-5 py-2.5 rounded-xl bg-purple-700 text-white text-xs font-bold shadow-md hover:bg-purple-800 transition-colors"
            >
              सर्व फटाके पहा
            </button>
          </div>
        }

      </div>
    </div>
  `
})
export class CatalogComponent {
  productService = inject(ProductService);
  translationService = inject(TranslationService);
  private route = inject(ActivatedRoute);

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('');
  sortBy = signal<'featured' | 'price_asc' | 'price_desc' | 'name'>('featured');
  onlyAvailable = signal<boolean>(false);
  currentPage = signal<number>(1);
  pageSize = 12;

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
    });
  }

  filteredProducts = computed<Product[]>(() => {
    let list = this.productService.activeProducts();
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const availOnly = this.onlyAvailable();
    const sort = this.sortBy();
    const lang = this.translationService.currentLang();

    if (cat) {
      list = list.filter(p => p.categoryId === cat);
    }

    if (availOnly) {
      list = list.filter(p => p.stockQuantity > 0);
    }

    if (query) {
      list = list.filter(p => {
        const nameMatch =
          p.name.mr.toLowerCase().includes(query) ||
          p.name.en.toLowerCase().includes(query) ||
          p.name.hi.toLowerCase().includes(query);
        const skuMatch = p.sku.toLowerCase().includes(query);
        const descMatch =
          p.description.mr.toLowerCase().includes(query) ||
          p.description.en.toLowerCase().includes(query);
        return nameMatch || skuMatch || descMatch;
      });
    }

    // Sort
    const sorted = [...list];
    if (sort === 'price_asc') {
      sorted.sort((a, b) => a.retailPrice - b.retailPrice);
    } else if (sort === 'price_desc') {
      sorted.sort((a, b) => b.retailPrice - a.retailPrice);
    } else if (sort === 'name') {
      sorted.sort((a, b) => {
        const nameA = a.name[lang] || a.name.mr;
        const nameB = b.name[lang] || b.name.mr;
        return nameA.localeCompare(nameB);
      });
    } else {
      // featured first
      sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return sorted;
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.pageSize) || 1;
  });

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.onlyAvailable.set(false);
    this.sortBy.set('featured');
    this.currentPage.set(1);
  }

  getCatName(cat: any): string {
    const lang = this.translationService.currentLang();
    return cat.name[lang] || cat.name.mr || cat.name.en;
  }
}
