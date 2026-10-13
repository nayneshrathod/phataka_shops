import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { StoreSettingsService } from '@core/services/store-settings.service';
import { TranslationService } from '@core/i18n/translation.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ProductCardComponent } from '@shared/components/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, ProductCardComponent],
  template: `
    <!-- Hero Banner Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-purple-950 via-[#1c0c3b] to-[#120726] text-white py-16 md:py-24">
      <!-- Festive background sparkles -->
      <div class="absolute inset-0 opacity-25 pointer-events-none">
        <div class="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full blur-[128px]"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-amber-500 rounded-full blur-[140px]"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
              <span>🪔</span>
              <span>अधिकृत व सुरक्षित हरित फटाके दालन (PESO Licensed)</span>
            </div>

            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-serif">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                {{ 'home.heroTitle' | translate }}
              </span>
            </h1>

            <p class="text-base sm:text-lg text-purple-100/80 max-w-2xl leading-relaxed">
              {{ 'home.heroSubtitle' | translate }}
            </p>

            <!-- Important Compliance Pill -->
            <div class="p-3.5 bg-purple-900/40 backdrop-blur-md rounded-2xl border border-purple-500/30 text-xs text-amber-200/90 leading-relaxed max-w-xl">
              ⚖️ <strong>वैधानिक नोंद:</strong> फटाक्यांची ऑनलाइन विक्री, पेमेंट व घरपोच डिलिव्हरी प्रतिबंधित आहे. ही वेबसाइट केवळ माहिती व दुकानात प्रत्यक्ष खरेदीसाठी चौकशीकरिता आहे.
            </div>

            <!-- CTA Buttons -->
            <div class="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                routerLink="/products"
                class="px-7 py-3.5 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>🎆</span>
                <span>{{ 'home.exploreCatalog' | translate }}</span>
              </a>

              <a
                routerLink="/inquiry"
                class="px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-purple-900/80 hover:bg-purple-800 border border-purple-400/30 backdrop-blur-md shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                <span>📋</span>
                <span>{{ 'home.quickInquiry' | translate }}</span>
              </a>
            </div>
          </div>

          <!-- Hero Graphic Card -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative w-full max-w-md">
              <div class="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-purple-600 rounded-3xl blur opacity-30 animate-pulse"></div>
              <div class="relative rounded-3xl overflow-hidden border border-amber-400/30 shadow-2xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80"
                  alt="Diwali Celebrations"
                  class="w-full h-80 object-cover"
                />
                <div class="p-5 bg-slate-950/95 space-y-3">
                  <div class="flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span>✨ प्रतीक फटाके, लक्ष्मी रोड, पुणे</span>
                    <span>सकाळी ९ ते रात्री १०</span>
                  </div>
                  <h3 class="text-base font-bold text-white">
                    सुरक्षित हरित फटाक्यांची १००% खात्रीशीर दालन
                  </h3>
                  <div class="flex items-center gap-2 text-xs text-slate-300">
                    <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      NEERI हरित QR
                    </span>
                    <span class="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      PESO अधिकृत
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Categories Grid Showcase -->
    <section class="py-16 bg-white border-b border-purple-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-purple-600">
              प्रकार व श्रेणी (Categories)
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-serif">
              {{ 'home.categoriesTitle' | translate }}
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              {{ 'home.categoriesSubtitle' | translate }}
            </p>
          </div>
          <a
            routerLink="/categories"
            class="inline-flex items-center gap-1.5 text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors"
          >
            <span>{{ 'common.viewAll' | translate }}</span>
            <span>→</span>
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          @for (cat of productService.activeCategories(); track cat.id) {
            <a
              [routerLink]="['/products']"
              [queryParams]="{ category: cat.id }"
              class="group relative rounded-2xl overflow-hidden border border-purple-100 bg-purple-50/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div class="relative pt-[70%] overflow-hidden bg-purple-100">
                <img
                  [src]="cat.image"
                  [alt]="getCategoryName(cat)"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div class="absolute bottom-3 left-3 right-3 text-white">
                  <h3 class="text-sm sm:text-base font-bold group-hover:text-amber-300 transition-colors line-clamp-1">
                    {{ getCategoryName(cat) }}
                  </h3>
                </div>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products Showcase -->
    <section class="py-16 bg-[#FAF9FF]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-purple-600">
              लोकप्रिय फटाके (Featured)
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-serif">
              {{ 'home.featuredTitle' | translate }}
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              {{ 'home.featuredSubtitle' | translate }}
            </p>
          </div>
          <a
            routerLink="/products"
            class="inline-flex items-center gap-1.5 text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors"
          >
            <span>{{ 'common.viewAll' | translate }} ({{ productService.activeProducts().length }})</span>
            <span>→</span>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (prod of productService.featuredProducts().slice(0, 8); track prod.id) {
            <app-product-card [product]="prod" />
          }
        </div>
      </div>
    </section>

    <!-- Safety & Green Cracker Assurance Strip -->
    <section class="py-14 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
            <span class="text-4xl">🌱</span>
            <h3 class="text-lg font-bold text-amber-300">१००% हरित फटाके (Green Crackers)</h3>
            <p class="text-xs text-purple-100/80 leading-relaxed">
              CSIR-NEERI मान्यताप्राप्त फॉर्म्युलेशन. ३०% कमी धूर आणि कोणत्याही प्रतिबंधित घटकांशिवाय.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
            <span class="text-4xl">📜</span>
            <h3 class="text-lg font-bold text-amber-300">PESO परवानाधारक विक्रेता</h3>
            <p class="text-xs text-purple-100/80 leading-relaxed">
              सर्वोच्च न्यायालयाच्या व पेट्रोलियम अँड एक्सप्लोसिव्ह सेफ्टी ऑर्गनायझेशनच्या सर्व नियमांचे काटेकोर पालन.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
            <span class="text-4xl">🏬</span>
            <h3 class="text-lg font-bold text-amber-300">थेट दुकान भेट व खात्रीशीर खरेदी</h3>
            <p class="text-xs text-purple-100/80 leading-relaxed">
              लक्ष्मी रोड, पुणे येथील मुख्य दालनात प्रत्यक्ष भेट देऊन उत्पादने तपासा आणि खरेदी करा.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- Physical Store Location & Timing Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-amber-50/40 p-8 md:p-12 shadow-sm">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div class="lg:col-span-7 space-y-6">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                📍 प्रत्यक्ष दुकान भेट (Store Visit)
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                {{ 'home.visitStoreTitle' | translate }}
              </h2>
              
              <div class="space-y-3 text-sm text-slate-700">
                <p class="flex items-start gap-3">
                  <span class="text-lg">🏢</span>
                  <span class="font-medium">{{ settingsService.settings().address }}</span>
                </p>
                <p class="flex items-center gap-3">
                  <span class="text-lg">⏰</span>
                  <span>{{ 'home.storeHours' | translate }}</span>
                </p>
                <p class="flex items-center gap-3">
                  <span class="text-lg">📞</span>
                  <span>फोन: <strong>{{ settingsService.settings().contactNumber }}</strong></span>
                </p>
              </div>

              <div class="flex flex-wrap gap-4 pt-2">
                <a
                  [href]="'tel:' + settingsService.settings().contactNumber"
                  class="px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>📞</span> कॉल करा
                </a>
                <a
                  [href]="'https://wa.me/' + settingsService.settings().whatsappNumber.replace('+', '')"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>💬</span> WhatsApp वर पत्ता मिळवा
                </a>
              </div>
            </div>

            <div class="lg:col-span-5">
              <div class="rounded-2xl overflow-hidden border border-purple-200/60 shadow-lg bg-slate-100 p-6 space-y-4 text-center">
                <span class="text-5xl">🗺️</span>
                <h4 class="font-bold text-slate-900">लक्ष्मी रोड, पुणे मुख्य दालन</h4>
                <p class="text-xs text-slate-500">
                  अलका टॉकीज चौकाजवळ, लक्ष्मी रोडवर सहज पोहोचता येणारे मध्यवर्ती ठिकाण.
                </p>
                <a
                  [href]="settingsService.settings().googleMapsUrl || 'https://maps.google.com'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Google Maps वर दिशा पहा →
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  productService = inject(ProductService);
  settingsService = inject(StoreSettingsService);
  translationService = inject(TranslationService);

  getCategoryName(cat: any): string {
    const lang = this.translationService.currentLang();
    return cat.name[lang] || cat.name.mr || cat.name.en;
  }
}
