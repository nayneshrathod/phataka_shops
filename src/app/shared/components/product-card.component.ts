import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';
import { InquiryCartService } from '@core/services/inquiry-cart.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      
      <!-- Top Image with Badges -->
      <div class="relative w-full pt-[75%] bg-purple-50 overflow-hidden">
        <img
          [src]="product().images[0]"
          [alt]="getName()"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          (error)="handleImageError($event)"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <!-- Category & Green Cracker Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          @if (product().complianceStatus === 'green_cracker') {
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/90 backdrop-blur-sm text-white shadow-sm">
              <span>🌱</span> Green Cracker
            </span>
          }
          @if (product().featured) {
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/95 backdrop-blur-sm text-slate-950 shadow-sm">
              <span>⭐</span> {{ 'home.featuredTitle' | translate }}
            </span>
          }
        </div>

        <!-- Stock Status Pill -->
        <div class="absolute top-3 right-3 z-10">
          @if (product().stockQuantity === 0) {
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm">
              {{ 'common.outOfStock' | translate }}
            </span>
          } @else if (product().stockQuantity <= product().lowStockThreshold) {
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shadow-sm">
              {{ 'common.lowStock' | translate }}
            </span>
          } @else {
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white shadow-sm">
              {{ 'common.available' | translate }}
            </span>
          }
        </div>

        <!-- Sound / Effect Tag -->
        @if (product().soundLevel) {
          <div class="absolute bottom-3 left-3 text-[11px] font-semibold text-white/95 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
            🔊 {{ product().soundLevel }}
          </div>
        }
      </div>

      <!-- Card Body Content -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs text-purple-600 font-semibold">
            <span class="font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              SKU: {{ product().sku }}
            </span>
            <span class="text-slate-500 font-normal">
              {{ product().piecesPerBox || 1 }} {{ 'common.quantity' | translate }}
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1">
            <a [routerLink]="['/products', product().slug]">
              {{ product().name[translationService.currentLang()] || product().name.mr }}
            </a>
          </h3>

          <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {{ product().description[translationService.currentLang()] || product().description.mr }}
          </p>
        </div>

        <!-- Price & Action Section -->
        <div class="pt-4 mt-4 border-t border-purple-50 flex items-center justify-between gap-2">
          <div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {{ 'common.price' | translate }}
            </div>
            <div class="text-xl font-black text-purple-900">
              ₹{{ product().retailPrice }}
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button
              type="button"
              (click)="addToInquiryList()"
              class="px-2.5 py-2 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all active:scale-95 flex items-center gap-1"
              [title]="'nav.cart' | translate"
            >
              <span>🛒</span>
              <span class="hidden sm:inline">+ {{ 'nav.cart' | translate }}</span>
            </button>
            
            <a
              [routerLink]="['/products', product().slug]"
              class="px-3 py-2 text-xs font-bold text-slate-700 hover:text-purple-900 bg-slate-100 hover:bg-purple-50 rounded-xl transition-colors"
              [title]="'common.viewDetails' | translate"
            >
              {{ 'common.viewDetails' | translate }}
            </a>
            
            <a
              [routerLink]="['/inquiry']"
              [queryParams]="{ productId: product().id }"
              class="px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 rounded-xl shadow-md shadow-purple-600/20 active:scale-95 transition-all"
            >
              {{ 'common.inquire' | translate }}
            </a>
          </div>
        </div>

      </div>

    </div>
  `
})
export class ProductCardComponent {
  product = input.required<Product>();
  translationService = inject(TranslationService);
  inquiryCartService = inject(InquiryCartService);

  addToInquiryList(): void {
    this.inquiryCartService.addItem(this.product(), 1);
  }

  getName(): string {
    const lang = this.translationService.currentLang();
    return this.product().name[lang] || this.product().name.mr || this.product().name.en;
  }

  getDescription(): string {
    const lang = this.translationService.currentLang();
    return this.product().description[lang] || this.product().description.mr || this.product().description.en;
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80';
  }
}
