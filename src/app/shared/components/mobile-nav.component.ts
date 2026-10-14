import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InquiryCartService } from '@core/services/inquiry-cart.service';
import { AuthService } from '@core/services/auth.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <!-- Mobile App Bottom Navigation Bar (Visible on mobile md:hidden) -->
    <nav
      class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-purple-200/70 shadow-[0_-4px_25px_rgba(85,33,181,0.08)] md:hidden pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Mobile Navigation"
    >
      <div class="grid grid-cols-5 h-16 items-center px-1">
        
        <!-- Tab 1: Home -->
        <a
          routerLink="/"
          routerLinkActive="text-purple-700 font-bold"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center justify-center h-full text-slate-500 hover:text-purple-700 transition-colors group relative"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">🏠</span>
          <span class="text-[10px] mt-0.5 tracking-tight font-medium">{{ 'nav.home' | translate }}</span>
        </a>

        <!-- Tab 2: Catalog -->
        <a
          routerLink="/products"
          routerLinkActive="text-purple-700 font-bold"
          class="flex flex-col items-center justify-center h-full text-slate-500 hover:text-purple-700 transition-colors group relative"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">🎆</span>
          <span class="text-[10px] mt-0.5 tracking-tight font-medium">{{ 'nav.products' | translate }}</span>
        </a>

        <!-- Tab 3: Cart / Estimate Bill (Highlighted Centerpiece) -->
        <a
          routerLink="/inquiry-cart"
          routerLinkActive="text-purple-900 font-bold"
          class="flex flex-col items-center justify-center -mt-4 relative group"
        >
          <div class="w-13 h-13 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-purple-700/40 border-3 border-white group-active:scale-95 transition-transform">
            <span class="text-2xl">🛒</span>
            @if (cartService.itemCount() > 0) {
              <span class="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] h-[20px] rounded-full text-[10px] font-black bg-rose-600 text-white flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {{ cartService.itemCount() }}
              </span>
            }
          </div>
          <span class="text-[10px] mt-1 tracking-tight font-bold text-purple-950">
            {{ 'nav.cart' | translate }}
          </span>
        </a>

        <!-- Tab 4: Offers -->
        <a
          routerLink="/offers"
          routerLinkActive="text-amber-700 font-bold"
          class="flex flex-col items-center justify-center h-full text-slate-500 hover:text-amber-600 transition-colors group relative"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">🎉</span>
          <span class="text-[10px] mt-0.5 tracking-tight font-medium">{{ 'nav.offers' | translate }}</span>
        </a>

        <!-- Tab 5: Owner Call / Account -->
        @if (authService.isAuthenticated()) {
          <a
            [routerLink]="authService.isStaff() ? (authService.isAdmin() ? '/admin/dashboard' : '/admin/billing') : '/'"
            routerLinkActive="text-purple-700 font-bold"
            class="flex flex-col items-center justify-center h-full text-slate-500 hover:text-purple-700 transition-colors group relative"
          >
            <span class="text-xl group-hover:scale-110 transition-transform">⚙️</span>
            <span class="text-[10px] mt-0.5 tracking-tight font-medium">{{ authService.isAdmin() ? 'Admin' : 'POS' }}</span>
          </a>
        } @else {
          <a
            href="tel:+919373345328"
            class="flex flex-col items-center justify-center h-full text-emerald-600 hover:text-emerald-700 transition-colors group relative"
          >
            <span class="text-xl group-hover:scale-110 transition-transform">📞</span>
            <span class="text-[10px] mt-0.5 tracking-tight font-bold text-emerald-700">कॉल मालक</span>
          </a>
        }

      </div>
    </nav>
  `
})
export class MobileNavComponent {
  cartService = inject(InquiryCartService);
  authService = inject(AuthService);
}
