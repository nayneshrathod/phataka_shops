import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { TranslationService } from '@core/i18n/translation.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="py-12 bg-[#FAF9FF] min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            📂 संपूर्ण प्रकार यादी
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {{ 'nav.categories' | translate }}
          </h1>
          <p class="text-sm text-slate-500">
            फुलबाज्या, भुईचक्र, अनार, कारंजे ते भव्य कौटुंबिक कॉम्बो बॉक्सेस
          </p>
        </div>

        <!-- Categories List Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (cat of productService.activeCategories(); track cat.id) {
            <a
              [routerLink]="['/products']"
              [queryParams]="{ category: cat.id }"
              class="group bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div class="relative pt-[65%] overflow-hidden bg-purple-100">
                <img
                  [src]="cat.image"
                  [alt]="getName(cat)"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                <div class="absolute bottom-3 left-4 right-4">
                  <h3 class="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {{ getName(cat) }}
                  </h3>
                </div>
              </div>

              <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p class="text-xs text-slate-500 leading-relaxed">
                  {{ getDesc(cat) }}
                </p>

                <div class="pt-3 border-t border-purple-50 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-900">
                  <span>कॅटलॉग पहा</span>
                  <span class="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </a>
          }
        </div>

      </div>
    </div>
  `
})
export class CategoriesComponent {
  productService = inject(ProductService);
  translationService = inject(TranslationService);

  getName(cat: any): string {
    const lang = this.translationService.currentLang();
    return cat.name[lang] || cat.name.mr || cat.name.en;
  }

  getDesc(cat: any): string {
    const lang = this.translationService.currentLang();
    return cat.description[lang] || cat.description.mr || cat.description.en;
  }
}
