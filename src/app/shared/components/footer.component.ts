import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreSettingsService } from '@core/services/store-settings.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <footer class="bg-slate-950 text-slate-300 pt-12 pb-28 md:pb-14 border-t border-purple-900/40 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        <!-- Mandatory Statutory Alert Container -->
        <div class="rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-purple-950/80 border border-amber-500/30 p-5 sm:p-6 md:p-8 text-amber-200/90 shadow-2xl relative overflow-hidden">
          <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <span class="text-2xl sm:text-3xl">⚖️</span>
            <div>
              <h3 class="text-base sm:text-lg font-bold text-amber-400 mb-1.5">
                {{ 'legal.noticeTitle' | translate }}
              </h3>
              <p class="text-xs sm:text-sm leading-relaxed text-slate-200/90">
                {{ 'legal.noticeBody' | translate }}
              </p>
              <div class="mt-3.5 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold text-amber-300">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[11px] sm:text-xs">
                  <span>🌱</span> {{ 'legal.greenCrackers' | translate }}
                </span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-300 text-[11px] sm:text-xs">
                  <span>📜</span> {{ 'footer.licenseNo' | translate }}: <strong class="font-mono text-amber-200 ml-1">{{ settingsService.settings().licenseNumber }}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4-Column Footer Content -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          
          <!-- Column 1: Brand & Identity -->
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                ✨
              </div>
              <span class="text-lg sm:text-xl font-black text-white font-serif tracking-wide">
                {{ 'brand.name' | translate }}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {{ 'home.heroSubtitle' | translate }}
            </p>
            <div class="pt-1 text-xs text-slate-500 space-y-1">
              <p>GSTIN: <span class="text-slate-300 font-mono break-all">{{ settingsService.settings().gstin }}</span></p>
              <p>PESO: <span class="text-slate-300 font-mono break-all">{{ settingsService.settings().licenseNumber }}</span></p>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="space-y-3 sm:space-y-4">
            <h4 class="text-amber-400 text-xs font-bold tracking-wider uppercase">
              {{ 'footer.quickLinks' | translate }}
            </h4>
            <ul class="space-y-2 text-xs sm:text-sm">
              <li>
                <a routerLink="/" class="text-slate-400 hover:text-amber-300 transition-colors py-0.5 inline-block">
                  {{ 'nav.home' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/products" class="text-slate-400 hover:text-amber-300 transition-colors py-0.5 inline-block">
                  {{ 'nav.products' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/categories" class="text-slate-400 hover:text-amber-300 transition-colors py-0.5 inline-block">
                  {{ 'nav.categories' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/offers" class="text-amber-400/90 hover:text-amber-300 font-semibold transition-colors py-0.5 inline-block">
                  🎉 {{ 'nav.offers' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/inquiry" class="text-slate-400 hover:text-amber-300 transition-colors py-0.5 inline-block">
                  {{ 'nav.inquiry' | translate }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Safety & Compliance -->
          <div class="space-y-3 sm:space-y-4">
            <h4 class="text-amber-400 text-xs font-bold tracking-wider uppercase">
              {{ 'footer.safetyLegal' | translate }}
            </h4>
            <ul class="space-y-2 text-xs sm:text-sm">
              <li>
                <a routerLink="/safety" class="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 py-0.5">
                  <span>🛡️</span> {{ 'nav.safety' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/about" class="text-slate-400 hover:text-amber-300 transition-colors py-0.5 inline-block">
                  {{ 'nav.about' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/contact" class="text-slate-400 hover:text-amber-300 transition-colors py-0.5 inline-block">
                  {{ 'nav.contact' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/login" class="text-purple-400 hover:text-purple-300 transition-colors text-xs font-semibold flex items-center gap-1 py-0.5">
                  <span>🔒</span> {{ 'nav.admin' | translate }} / {{ 'nav.login' | translate }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Physical Store Contact -->
          <div class="space-y-3 sm:space-y-4">
            <h4 class="text-amber-400 text-xs font-bold tracking-wider uppercase">
              दुकान संपर्क व मालक (Contact)
            </h4>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              📍 {{ settingsService.settings().address }}
            </p>
            <div class="space-y-1.5 text-xs sm:text-sm text-slate-300">
              <p class="flex items-center gap-2">
                <span>👑</span>
                <span class="text-amber-300 font-semibold">मालक: {{ settingsService.settings().ownerName || 'प्रतीक जगताप (Pratik Jagtap)' }}</span>
              </p>
              <p class="flex items-center gap-2">
                <span>📞</span>
                <a [href]="'tel:' + settingsService.settings().contactNumber" class="text-amber-400 hover:underline font-bold font-mono">
                  {{ settingsService.settings().contactNumber }}
                </a>
              </p>
              <p class="flex items-center gap-2">
                <span>⏰</span>
                <span>{{ settingsService.settings().workingHours }}</span>
              </p>
            </div>
            <div class="pt-1 flex flex-col sm:flex-row gap-2">
              <a
                [href]="'https://wa.me/' + settingsService.settings().whatsappNumber.replace('+', '')"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <span>💬</span> WhatsApp चौकशी
              </a>
              <a
                [href]="'tel:' + settingsService.settings().contactNumber"
                class="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <span>📞</span> थेट कॉल
              </a>
            </div>
          </div>

        </div>

        <!-- Bottom Copyright -->
        <div class="pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 sm:gap-4 text-center sm:text-left">
          <p>© 2026 प्रतीक फटाके (Pratik Phatake). सर्व हक्क राखीव. संचालक: श्री. प्रतीक जगताप.</p>
          <p class="text-slate-400">PESO Certified & CSIR-NEERI Green Crackers • PWA Ready</p>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  settingsService = inject(StoreSettingsService);
}
