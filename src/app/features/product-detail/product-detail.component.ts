import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { TranslationService } from '@core/i18n/translation.service';
import { InquiryCartService } from '@core/services/inquiry-cart.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ProductCardComponent } from '@shared/components/product-card.component';
import { Product } from '@core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe, ProductCardComponent],
  template: `
    @if (product(); as prod) {
      <div class="py-10 bg-[#FAF9FF] min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <!-- Breadcrumb Navigation -->
          <nav class="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <a routerLink="/" class="hover:text-purple-700">{{ 'nav.home' | translate }}</a>
            <span>/</span>
            <a routerLink="/products" class="hover:text-purple-700">{{ 'nav.products' | translate }}</a>
            <span>/</span>
            <span class="text-purple-900 truncate max-w-xs">{{ prod.name[translationService.currentLang()] || prod.name.mr }}</span>
          </nav>

          <!-- Main Product Display Card -->
          <div class="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 sm:p-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              <!-- Left: Image Showcase -->
              <div class="lg:col-span-5 space-y-4">
                <div class="relative w-full pt-[85%] rounded-2xl overflow-hidden bg-purple-50 border border-purple-100">
                  <img
                    [src]="activeImage() || prod.images[0]"
                    [alt]="prod.name[translationService.currentLang()] || prod.name.mr"
                    class="absolute inset-0 w-full h-full object-cover"
                    (error)="handleImageError($event)"
                  />
                  @if (prod.complianceStatus === 'green_cracker') {
                    <div class="absolute top-4 left-4">
                      <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1.5">
                        <span>🌱</span> CSIR-NEERI Green Cracker
                      </span>
                    </div>
                  }
                </div>

                <!-- Thumbnail strip -->
                @if (prod.images.length > 1) {
                  <div class="flex items-center gap-3 overflow-x-auto pb-2">
                    @for (img of prod.images; track img) {
                      <button
                        type="button"
                        (click)="activeImage.set(img)"
                        [class.ring-2]="activeImage() === img"
                        class="w-16 h-16 rounded-xl overflow-hidden border border-purple-200 focus:outline-none ring-purple-600 transition-all flex-shrink-0 cursor-pointer"
                      >
                        <img [src]="img" class="w-full h-full object-cover" />
                      </button>
                    }
                  </div>
                }
              </div>

              <!-- Right: Details & Nonbinding Inquiry Actions -->
              <div class="lg:col-span-7 space-y-6">
                
                <div>
                  <div class="flex items-center gap-3 text-xs font-bold text-purple-600 mb-2">
                    <span class="px-2.5 py-1 rounded bg-purple-50 border border-purple-200">
                      SKU: {{ prod.sku }}
                    </span>
                    <span class="text-slate-400">•</span>
                    <span>{{ 'product.manufacturer' | translate }}: {{ prod.manufacturer }}</span>
                  </div>

                  <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-serif leading-tight">
                    {{ prod.name[translationService.currentLang()] || prod.name.mr }}
                  </h1>
                </div>

                <!-- Price and Availability Block -->
                <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-50/80 to-amber-50/60 border border-purple-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {{ 'common.price' | translate }}
                    </div>
                    <div class="text-3xl font-black text-purple-950">
                      ₹{{ prod.retailPrice }}
                      <span class="text-xs font-normal text-slate-500">/ प्रति बॉक्स</span>
                    </div>
                  </div>

                  <div>
                    @if (prod.stockQuantity === 0) {
                      <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        {{ 'common.outOfStock' | translate }}
                      </span>
                    } @else if (prod.stockQuantity <= prod.lowStockThreshold) {
                      <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        {{ 'common.lowStock' | translate }} ({{ 'dashboard.remaining' | translate }}: {{ prod.stockQuantity }})
                      </span>
                    } @else {
                      <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {{ 'common.available' | translate }}
                      </span>
                    }
                  </div>
                </div>

                <!-- Specifications Matrix -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span class="text-slate-400 block font-medium">{{ 'product.pieces' | translate }}</span>
                    <strong class="text-slate-800 text-sm">{{ prod.piecesPerBox || 1 }} {{ 'common.quantity' | translate }}</strong>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span class="text-slate-400 block font-medium">{{ 'product.soundLevel' | translate }}</span>
                    <strong class="text-slate-800 text-sm">{{ prod.soundLevel || 'Standard' }}</strong>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span class="text-slate-400 block font-medium">{{ 'product.greenCode' | translate }}</span>
                    <strong class="text-emerald-700 text-sm font-mono">{{ prod.greenCrackerCode || 'CSIR-NEERI' }}</strong>
                  </div>
                </div>

                <!-- Description -->
                <div class="space-y-2">
                  <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {{ 'common.viewDetails' | translate }}
                  </h3>
                  <p class="text-sm text-slate-600 leading-relaxed">
                    {{ prod.description[translationService.currentLang()] || prod.description.mr }}
                  </p>
                </div>

                <!-- Safety Guidelines for this product -->
                <div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                  <div class="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <span>🛡️</span>
                    <span>{{ 'product.safetyTips' | translate }}:</span>
                  </div>
                  <p class="text-xs text-amber-800 leading-relaxed">
                    {{ prod.safetyInformation[translationService.currentLang()] || prod.safetyInformation.mr }}
                  </p>
                </div>

                <!-- Statutory Inquiry Callout -->
                <div class="p-4 rounded-2xl bg-purple-900 text-white space-y-4">
                  <div class="text-xs leading-relaxed text-purple-200">
                    ⚖️ <strong>{{ 'common.disclaimer' | translate }}:</strong> {{ 'legal.noticeBody' | translate }}
                  </div>

                  <div class="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      (click)="addToInquiryCart(prod)"
                      class="flex-1 py-3 px-6 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>🛒</span>
                      <span>+ {{ 'nav.cart' | translate }}</span>
                    </button>

                    <a
                      [routerLink]="['/inquiry']"
                      [queryParams]="{ productId: prod.id }"
                      class="py-3 px-5 rounded-xl text-center font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <span>📋</span>
                      <span>{{ 'common.inquire' | translate }}</span>
                    </a>

                    <a
                      [href]="'https://wa.me/919822012345?text=' + (translationService.currentLang() === 'en' ? 'Hello, I want to inquire about ' + (prod.name.en || prod.name.mr) : translationService.currentLang() === 'hi' ? 'नमस्ते, मैं ' + (prod.name.hi || prod.name.mr) + ' की उपलब्धता जानना चाहता हूँ' : 'नमस्कार, मी ' + prod.name.mr + ' बद्दल विचारू इच्छितो') + ' (SKU: ' + prod.sku + ')'"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="py-3 px-5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all flex items-center gap-2"
                    >
                      <span>💬</span> WhatsApp
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <!-- Related Products Section -->
          @if (relatedProducts().length > 0) {
            <div class="space-y-6">
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                {{ 'product.related' | translate }}
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @for (rel of relatedProducts(); track rel.id) {
                  <app-product-card [product]="rel" />
                }
              </div>
            </div>
          }

        </div>
      </div>
    } @else {
      <!-- Not Found -->
      <div class="py-24 text-center space-y-4">
        <span class="text-6xl">🔍</span>
        <h2 class="text-xl font-bold text-slate-800">{{ 'catalog.noProducts' | translate }}</h2>
        <a routerLink="/products" class="inline-block px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs">
          {{ 'home.exploreCatalog' | translate }}
        </a>
      </div>
    }
  `
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  translationService = inject(TranslationService);
  private inquiryCart = inject(InquiryCartService);

  product = signal<Product | null>(null);
  activeImage = signal<string>('');

  addToInquiryCart(prod: Product): void {
    this.inquiryCart.addItem(prod, 1);
  }

  constructor() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        const found = this.productService.getProductBySlug(slug);
        if (found) {
          this.product.set(found);
          this.activeImage.set(found.images[0]);
        }
      }
    });
  }

  getName(p: Product): string {
    const lang = this.translationService.currentLang();
    return p.name[lang] || p.name.mr || p.name.en;
  }

  getDescription(p: Product): string {
    const lang = this.translationService.currentLang();
    return p.description[lang] || p.description.mr || p.description.en;
  }

  getSafety(p: Product): string {
    const lang = this.translationService.currentLang();
    return p.safetyInformation[lang] || p.safetyInformation.mr || p.safetyInformation.en;
  }

  relatedProducts = signal<Product[]>([]);

  ngOnInit(): void {
    const p = this.product();
    if (p) {
      const rel = this.productService
        .getProductsByCategory(p.categoryId)
        .filter(item => item.id !== p.id)
        .slice(0, 4);
      this.relatedProducts.set(rel);
    }
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80';
  }
}
