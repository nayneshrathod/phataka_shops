import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '@core/services/pwa.service';
import { StoreSettingsService } from '@core/services/store-settings.service';

@Component({
  selector: 'app-pwa-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 1. Offline Mode Banner -->
    @if (!pwaService.isOnline()) {
      <aside aria-label="Offline Alert" class="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-white text-xs font-semibold py-2 px-4 shadow-lg text-center flex items-center justify-center gap-2 animate-bounce">
        <span>⚡</span>
        <span>ऑफलाइन मोड: तुम्ही इंटरनेट नसतानाही जतन केलेला फटाके कॅटलॉग पाहू शकता.</span>
      </aside>
    }

    <!-- 2. New Version Update Available -->
    @if (pwaService.updateAvailable()) {
      <aside aria-label="Update Alert" class="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-slate-900 border border-purple-500/50 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="text-2xl">✨</span>
          <div>
            <p class="text-xs font-bold text-amber-300">नवीन अपडेट उपलब्ध!</p>
            <p class="text-[11px] text-slate-300">ताजी उत्पादने व दर पाहण्यासाठी ॲप रीलोड करा.</p>
          </div>
        </div>
        <button
          type="button"
          (click)="pwaService.reloadForUpdate()"
          class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex-shrink-0"
        >
          रीलोड
        </button>
      </aside>
    }

    <!-- 3. PWA Install App Banner (Shows when browser supports install and app is not installed) -->
    @if (pwaService.canInstall() && !pwaService.isInstalled()) {
      <aside aria-label="PWA Install Prompt" class="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:w-[400px] z-40 bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 border-2 border-amber-400/50 rounded-2xl p-3.5 sm:p-4 shadow-2xl text-white backdrop-blur-xl">
        <div class="flex items-center gap-3">
          <!-- App Icon Thumbnail -->
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-md flex-shrink-0 border border-amber-300/40">
            ✨
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
              <span>प्रतीक फटाके ॲप</span>
              <span class="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-purple-950 font-black">PWA</span>
            </h4>
            <p class="text-[10px] sm:text-[11px] text-slate-300 line-clamp-1">
              मोबाईल होम स्क्रीनवर इन्स्टॉल करा — जलद व सोपे!
            </p>
          </div>
          <button
            type="button"
            (click)="pwaService.dismissPrompt()"
            class="text-slate-400 hover:text-white p-1 text-sm leading-none cursor-pointer"
            title="Dismiss"
          >
            ✕
          </button>
        </div>

        <div class="mt-2.5 flex items-center gap-2">
          <button
            type="button"
            (click)="install()"
            class="flex-1 py-1.5 sm:py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>📲</span>
            <span>ॲप इन्स्टॉल करा</span>
          </button>
          <button
            type="button"
            (click)="pwaService.dismissPrompt()"
            class="py-1.5 sm:py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
          >
            नंतर
          </button>
        </div>
      </aside>
    }

    <!-- 4. Quick Floating Action Buttons on Mobile (Call Owner & WhatsApp) -->
    <div class="fixed bottom-20 right-3 z-30 flex flex-col gap-2 md:hidden">
      <!-- WhatsApp Quick Button -->
      <a
        [href]="'https://wa.me/' + settingsService.settings().whatsappNumber.replace('+', '')"
        target="_blank"
        rel="noopener noreferrer"
        class="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-lg shadow-lg shadow-emerald-600/40 active:scale-90 transition-transform border border-emerald-400/30 cursor-pointer"
        title="WhatsApp चौकशी"
      >
        💬
      </a>

      <!-- Call Owner Direct Button -->
      <a
        [href]="'tel:' + settingsService.settings().contactNumber"
        class="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white flex items-center justify-center text-base shadow-lg shadow-purple-700/40 active:scale-90 transition-transform border border-amber-400/40 cursor-pointer"
        title="कॉल मालक (प्रतीक जगताप)"
      >
        📞
      </a>
    </div>
  `
})
export class PwaPromptComponent {
  pwaService = inject(PwaService);
  settingsService = inject(StoreSettingsService);

  async install(): Promise<void> {
    await this.pwaService.installPwa();
  }
}
