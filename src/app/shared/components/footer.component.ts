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
    <footer class="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-purple-900/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <!-- Mandatory Statutory Alert Container -->
        <div class="rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-purple-950/80 border border-amber-500/30 p-6 md:p-8 text-amber-200/90 shadow-2xl relative overflow-hidden">
          <div class="absolute -right-12 -top-12 text-8xl opacity-10 select-none pointer-events-none">⚖️</div>
          <div class="flex items-start gap-4">
            <span class="text-3xl">⚖️</span>
            <div>
              <h3 class="text-lg font-bold text-amber-400 mb-2">
                {{ 'legal.noticeTitle' | translate }}
              </h3>
              <p class="text-sm leading-relaxed text-slate-200/90">
                {{ 'legal.noticeBody' | translate }}
              </p>
              <div class="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-amber-300">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                  <span>🌱</span> {{ 'legal.greenCrackers' | translate }}
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-300">
                  <span>📜</span> {{ 'footer.licenseNo' | translate }} {{ settingsService.settings().licenseNumber }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4-Column Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <!-- Column 1: Brand & Identity -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-md">
                ✨
              </div>
              <span class="text-xl font-black text-white font-serif tracking-wide">
                {{ 'brand.name' | translate }}
              </span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              {{ 'home.heroSubtitle' | translate }}
            </p>
            <div class="pt-2 text-xs text-slate-500 space-y-1">
              <p>GSTIN: <span class="text-slate-300 font-mono">{{ settingsService.settings().gstin }}</span></p>
              <p>PESO License: <span class="text-slate-300 font-mono">{{ settingsService.settings().licenseNumber }}</span></p>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="space-y-4">
            <h4 class="text-white text-base font-bold tracking-wider uppercase text-xs text-amber-400">
              {{ 'footer.quickLinks' | translate }}
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li>
                <a routerLink="/" class="text-slate-400 hover:text-amber-300 transition-colors">
                  {{ 'nav.home' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/products" class="text-slate-400 hover:text-amber-300 transition-colors">
                  {{ 'nav.products' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/categories" class="text-slate-400 hover:text-amber-300 transition-colors">
                  {{ 'nav.categories' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/offers" class="text-amber-400/90 hover:text-amber-300 font-semibold transition-colors">
                  🎉 {{ 'nav.offers' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/inquiry" class="text-slate-400 hover:text-amber-300 transition-colors">
                  {{ 'nav.inquiry' | translate }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Safety & Compliance -->
          <div class="space-y-4">
            <h4 class="text-white text-base font-bold tracking-wider uppercase text-xs text-amber-400">
              {{ 'footer.safetyLegal' | translate }}
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li>
                <a routerLink="/safety" class="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>🛡️</span> {{ 'nav.safety' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/about" class="text-slate-400 hover:text-amber-300 transition-colors">
                  {{ 'nav.about' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/contact" class="text-slate-400 hover:text-amber-300 transition-colors">
                  {{ 'nav.contact' | translate }}
                </a>
              </li>
              <li>
                <a routerLink="/admin/login" class="text-purple-400 hover:text-purple-300 transition-colors text-xs font-semibold flex items-center gap-1">
                  <span>🔒</span> {{ 'nav.admin' | translate }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Physical Store Contact -->
          <div class="space-y-4">
            <h4 class="text-white text-base font-bold tracking-wider uppercase text-xs text-amber-400">
              दुकान पत्ता व वेळ
            </h4>
            <p class="text-sm text-slate-300 leading-relaxed">
              📍 {{ settingsService.settings().address }}
            </p>
            <div class="space-y-1.5 text-sm text-slate-300">
              <p class="flex items-center gap-2">
                <span>📞</span>
                <a [href]="'tel:' + settingsService.settings().contactNumber" class="text-amber-400 hover:underline">
                  {{ settingsService.settings().contactNumber }}
                </a>
              </p>
              <p class="flex items-center gap-2">
                <span>⏰</span>
                <span>{{ settingsService.settings().workingHours }}</span>
              </p>
            </div>
            <div class="pt-2">
              <a
                [href]="'https://wa.me/' + settingsService.settings().whatsappNumber.replace('+', '')"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all"
              >
                <span>💬</span> WhatsApp वर चौकशी
              </a>
            </div>
          </div>

        </div>

        <!-- Bottom Copyright -->
        <div class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 प्रतीक फटाके (Pratik Phatake). सर्व हक्क राखीव. परवानाधारक फटाके दालन, पुणे.</p>
          <p class="text-slate-400">Designed with Angular 22 & Tailwind v4 • Built for PESO Compliance</p>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  settingsService = inject(StoreSettingsService);
}
