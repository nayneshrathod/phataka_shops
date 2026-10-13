import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { StoreSettingsService } from '@core/services/store-settings.service';
import { InquiryCartService } from '@core/services/inquiry-cart.service';
import { AuthService } from '@core/services/auth.service';
import { SupportedLang } from '@core/i18n/translations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <!-- Top Statutory & Festive Ribbon -->
    <div class="bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950 text-amber-300 text-[11px] sm:text-xs py-2 px-3 sm:px-6 border-b border-amber-400/20 shadow-xs">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
        <!-- License & Eco Notice -->
        <div class="flex items-center gap-2 font-medium text-center sm:text-left">
          <span class="inline-block animate-pulse text-xs">🪔</span>
          <span>{{ 'legal.pesoCertified' | translate }}: <strong class="text-amber-200 font-mono">{{ settingsService.settings().licenseNumber }}</strong></span>
          <span class="hidden md:inline text-amber-400/40">•</span>
          <span class="hidden md:inline text-amber-200/90">{{ 'legal.greenCrackers' | translate }}</span>
        </div>

        <!-- Contact & WhatsApp -->
        <div class="flex items-center gap-4 font-semibold text-[11px] sm:text-xs">
          <a
            [href]="'tel:' + settingsService.settings().contactNumber"
            class="text-white/80 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>📞</span>
            <span class="font-mono">{{ settingsService.settings().contactNumber }}</span>
          </a>
          <span class="text-amber-400/40">•</span>
          <a
            [href]="'https://wa.me/' + settingsService.settings().whatsappNumber.replace('+', '')"
            target="_blank"
            rel="noopener noreferrer"
            class="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold transition-colors"
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          <!-- Brand Logo Section -->
          <a routerLink="/" class="flex items-center gap-2.5 sm:gap-3 group focus:outline-none flex-shrink-0">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <span class="text-xl sm:text-2xl animate-bounce">✨</span>
            </div>
            <div>
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xl sm:text-2xl font-black tracking-tight text-purple-950 font-serif leading-none">
                  {{ 'brand.name' | translate }}
                </span>
                <span class="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 flex items-center gap-0.5">
                  <span>🌱</span> {{ 'header.greenBadge' | translate }}
                </span>
              </div>
              <p class="text-[10px] sm:text-xs font-semibold tracking-wider text-purple-600 uppercase mt-0.5">
                {{ 'brand.subtitle' | translate }}
              </p>
            </div>
          </a>

          <!-- Desktop Navigation Links (Visible on xl: 1280px+) -->
          <nav class="hidden xl:flex items-center gap-1 text-xs 2xl:text-sm font-semibold text-slate-700">
            <a
              routerLink="/"
              routerLinkActive="text-purple-700 bg-purple-50 font-bold"
              [routerLinkActiveOptions]="{exact: true}"
              class="px-2.5 2xl:px-3 py-2 rounded-xl hover:text-purple-700 hover:bg-purple-50/70 transition-colors whitespace-nowrap"
            >
              {{ 'nav.home' | translate }}
            </a>
            <a
              routerLink="/products"
              routerLinkActive="text-purple-700 bg-purple-50 font-bold"
              class="px-2.5 2xl:px-3 py-2 rounded-xl hover:text-purple-700 hover:bg-purple-50/70 transition-colors whitespace-nowrap"
            >
              {{ 'nav.products' | translate }}
            </a>
            <a
              routerLink="/categories"
              routerLinkActive="text-purple-700 bg-purple-50 font-bold"
              class="px-2.5 2xl:px-3 py-2 rounded-xl hover:text-purple-700 hover:bg-purple-50/70 transition-colors whitespace-nowrap"
            >
              {{ 'nav.categories' | translate }}
            </a>
            <a
              routerLink="/offers"
              routerLinkActive="text-amber-700 bg-amber-50 font-bold"
              class="px-2.5 2xl:px-3 py-2 rounded-xl text-amber-600 hover:text-amber-700 hover:bg-amber-50/70 transition-colors font-bold whitespace-nowrap flex items-center gap-1"
            >
              <span>🎉</span>
              <span>{{ 'nav.offers' | translate }}</span>
            </a>
            <a
              routerLink="/safety"
              routerLinkActive="text-purple-700 bg-purple-50 font-bold"
              class="px-2.5 2xl:px-3 py-2 rounded-xl hover:text-purple-700 hover:bg-purple-50/70 transition-colors whitespace-nowrap"
            >
              {{ 'nav.safety' | translate }}
            </a>
            <a
              routerLink="/about"
              routerLinkActive="text-purple-700 bg-purple-50 font-bold"
              class="px-2.5 2xl:px-3 py-2 rounded-xl hover:text-purple-700 hover:bg-purple-50/70 transition-colors whitespace-nowrap"
            >
              {{ 'nav.about' | translate }}
            </a>
            <a
              routerLink="/contact"
              routerLinkActive="text-purple-700 bg-purple-50 font-bold"
              class="px-2.5 2xl:px-3 py-2 rounded-xl hover:text-purple-700 hover:bg-purple-50/70 transition-colors whitespace-nowrap"
            >
              {{ 'nav.contact' | translate }}
            </a>
          </nav>

          <!-- Right Action Section (Language, Cart, CTA, Auth) -->
          <div class="flex items-center gap-2 sm:gap-2.5">
            
            <!-- Sleek Compact Language Dropdown -->
            <div class="relative" #langDropdownContainer>
              <button
                type="button"
                (click)="toggleLangDropdown()"
                class="px-2.5 py-1.5 rounded-xl border border-purple-200/80 bg-purple-50/70 hover:bg-purple-100 text-xs font-bold text-purple-900 transition-all flex items-center gap-1.5 focus:outline-none shadow-2xs cursor-pointer"
                [attr.aria-expanded]="langDropdownOpen()"
                title="भाषा बदला (Change Language)"
              >
                <span>{{ currentLanguageObj().flag }}</span>
                <span class="font-bold">{{ currentLanguageObj().label }}</span>
                <span class="text-[10px] text-purple-600 transition-transform duration-200" [ngClass]="{'rotate-180': langDropdownOpen()}">▾</span>
              </button>

              @if (langDropdownOpen()) {
                <div class="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-purple-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-purple-50 mb-1">
                    भाषा / Language
                  </div>
                  @for (l of translationService.availableLanguages; track l.code) {
                    <button
                      type="button"
                      (click)="selectLanguage(l.code)"
                      [ngClass]="{
                        'bg-purple-50 text-purple-900 font-bold': translationService.currentLang() === l.code,
                        'text-slate-700 hover:bg-purple-50/50 hover:text-purple-900': translationService.currentLang() !== l.code
                      }"
                      class="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div class="flex items-center gap-2">
                        <span>{{ l.flag }}</span>
                        <span>{{ l.label }}</span>
                      </div>
                      @if (translationService.currentLang() === l.code) {
                        <span class="text-purple-600 font-black text-xs">✓</span>
                      }
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Customer Inquiry Cart Button -->
            <a
              routerLink="/inquiry-cart"
              class="relative p-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all flex items-center justify-center focus:outline-none cursor-pointer"
              [title]="'nav.cart' | translate"
            >
              <span class="text-xl">🛒</span>
              @if (inquiryCartService.itemCount() > 0) {
                <span class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                  {{ inquiryCartService.itemCount() }}
                </span>
              }
            </a>

            <!-- Inquire CTA Button (Hidden on small tablets, visible on larger screens) -->
            <a
              routerLink="/inquiry"
              class="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 2xl:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-md shadow-purple-600/25 hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
            >
              <span>📋</span>
              <span>{{ 'nav.inquiry' | translate }}</span>
            </a>

            <!-- Role-Based Auth Button / Pill -->
            @if (!authService.isAuthenticated()) {
              <a
                routerLink="/login"
                class="px-3 py-2 text-xs font-bold text-slate-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all flex items-center gap-1.5 border border-purple-200/80 shadow-2xs whitespace-nowrap cursor-pointer"
                [title]="'nav.login' | translate"
              >
                <span>🔐</span>
                <span>{{ 'nav.login' | translate }}</span>
              </a>
            } @else {
              @if (authService.isStaff()) {
                <div class="flex items-center gap-1 bg-slate-900 text-white pl-2 pr-1 py-1 rounded-xl text-xs border border-slate-800 shadow-sm flex-shrink-0">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                    {{ authService.isSuperAdmin() ? '👑 S-ADM' : (authService.isAdmin() ? '👔 ADM' : '⚡ STF') }}
                  </span>
                  <a
                    [routerLink]="authService.isAdmin() ? '/admin/dashboard' : '/admin/billing'"
                    class="px-2 py-0.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition-colors whitespace-nowrap"
                    title="व्यवस्थापक पोर्टल"
                  >
                    {{ 'nav.portal' | translate }}
                  </a>
                  <button
                    type="button"
                    (click)="authService.logout('/')"
                    class="p-1 text-slate-400 hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                    [title]="'nav.logout' | translate"
                  >
                    🚪
                  </button>
                </div>
              } @else {
                <div class="flex items-center gap-1.5 bg-purple-50 text-purple-950 px-2.5 py-1.5 rounded-xl text-xs border border-purple-200 flex-shrink-0">
                  <span class="font-bold truncate max-w-[80px]">👤 {{ authService.currentUser()?.displayName?.split(' ')[0] || ('role.customer' | translate) }}</span>
                  <button
                    type="button"
                    (click)="authService.logout('/')"
                    class="text-rose-600 hover:text-rose-800 font-bold text-[11px] cursor-pointer"
                    [title]="'nav.logout' | translate"
                  >
                    {{ 'nav.logout' | translate }}
                  </button>
                </div>
              }
            }

            <!-- Mobile & Tablet Menu Toggle Button (Visible below xl: < 1280px) -->
            <button
              type="button"
              (click)="toggleMobileMenu()"
              class="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-purple-50 hover:text-purple-700 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <span class="text-2xl leading-none">{{ mobileMenuOpen() ? '✕' : '☰' }}</span>
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile & Tablet Navigation Drawer (Smooth Animated Dropdown) -->
      @if (mobileMenuOpen()) {
        <div class="xl:hidden bg-white border-t border-purple-100 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          
          <!-- Mobile Language Switcher Row -->
          <div class="p-3 bg-purple-50/80 rounded-2xl border border-purple-100 flex items-center justify-between">
            <span class="text-xs font-bold text-purple-950">🌐 भाषा निवडा (Language):</span>
            <div class="flex items-center gap-1">
              @for (l of translationService.availableLanguages; track l.code) {
                <button
                  type="button"
                  (click)="changeLanguage(l.code)"
                  [ngClass]="{
                    'bg-purple-700 text-white font-bold shadow-xs': translationService.currentLang() === l.code,
                    'bg-white text-slate-700 hover:bg-purple-100 font-medium': translationService.currentLang() !== l.code
                  }"
                  class="px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{{ l.flag }}</span>
                  <span>{{ l.label }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Compliance Warning Badge -->
          <div class="p-3 bg-amber-50/80 rounded-xl text-[11px] text-amber-900 border border-amber-200/70 font-medium leading-relaxed">
            ⚠️ <strong>{{ 'common.disclaimer' | translate }}:</strong> {{ 'legal.noticeBody' | translate }}
          </div>
          
          <!-- Mobile Nav Links -->
          <div class="space-y-1 text-sm font-semibold text-slate-700">
            <a
              routerLink="/"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-purple-50 text-purple-800 font-bold"
              [routerLinkActiveOptions]="{exact: true}"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors"
            >
              <span>🏠</span>
              <span>{{ 'nav.home' | translate }}</span>
            </a>

            <a
              routerLink="/products"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-purple-50 text-purple-800 font-bold"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors"
            >
              <span>🎆</span>
              <span>{{ 'nav.products' | translate }}</span>
            </a>

            <a
              routerLink="/categories"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-purple-50 text-purple-800 font-bold"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors"
            >
              <span>📂</span>
              <span>{{ 'nav.categories' | translate }}</span>
            </a>

            <a
              routerLink="/offers"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-amber-50 text-amber-800 font-bold"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-amber-600 hover:bg-amber-50 transition-colors font-bold"
            >
              <span>🎉</span>
              <span>{{ 'nav.offers' | translate }}</span>
            </a>

            <a
              routerLink="/safety"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-purple-50 text-purple-800 font-bold"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors"
            >
              <span>🛡️</span>
              <span>{{ 'nav.safety' | translate }}</span>
            </a>

            <a
              routerLink="/about"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-purple-50 text-purple-800 font-bold"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors"
            >
              <span>🏢</span>
              <span>{{ 'nav.about' | translate }}</span>
            </a>

            <a
              routerLink="/contact"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-purple-50 text-purple-800 font-bold"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors"
            >
              <span>📍</span>
              <span>{{ 'nav.contact' | translate }}</span>
            </a>

            <!-- Mobile Cart Button -->
            <a
              routerLink="/inquiry-cart"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-purple-100 text-purple-900 font-bold"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-purple-900 bg-purple-50 font-bold"
            >
              <div class="flex items-center gap-2">
                <span>🛒</span>
                <span>{{ 'nav.cart' | translate }}</span>
              </div>
              @if (inquiryCartService.itemCount() > 0) {
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                  {{ inquiryCartService.itemCount() }}
                </span>
              }
            </a>

            <!-- Mobile Inquiry Action -->
            <a
              routerLink="/inquiry"
              (click)="closeMobileMenu()"
              class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-600 shadow-md"
            >
              <span>📋</span>
              <span>{{ 'nav.inquiry' | translate }}</span>
            </a>
          </div>

          <!-- Auth Links in Mobile Drawer -->
          <div class="pt-2 border-t border-purple-100 space-y-2">
            @if (!authService.isAuthenticated()) {
              <a
                routerLink="/login"
                (click)="closeMobileMenu()"
                class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 bg-purple-100 hover:bg-purple-200"
              >
                <span>🔐</span>
                <span>{{ 'nav.login' | translate }}</span>
              </a>
            } @else {
              @if (authService.isStaff()) {
                <a
                  [routerLink]="authService.isAdmin() ? '/admin/dashboard' : '/admin/billing'"
                  (click)="closeMobileMenu()"
                  class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-700 hover:bg-purple-800"
                >
                  <span>⚡</span>
                  <span>{{ 'nav.portal' | translate }} ({{ authService.isSuperAdmin() ? 'Super Admin' : (authService.isAdmin() ? 'Manager' : 'POS Staff') }})</span>
                </a>
              }
              <button
                type="button"
                (click)="authService.logout('/'); closeMobileMenu()"
                class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50"
              >
                <span>🚪</span>
                <span>{{ 'nav.logout' | translate }} ({{ authService.currentUser()?.displayName }})</span>
              </button>
            }
          </div>

          <!-- Store Timings Footer in Drawer -->
          <div class="pt-3 border-t border-purple-100 flex items-center justify-between text-xs text-slate-500">
            <span>{{ 'header.storeHours' | translate }}</span>
            <a [href]="'tel:' + settingsService.settings().contactNumber" class="text-purple-700 font-bold flex items-center gap-1">
              <span>📞</span> {{ 'header.callUs' | translate }}
            </a>
          </div>

        </div>
      }
    </header>
  `
})
export class HeaderComponent {
  translationService = inject(TranslationService);
  settingsService = inject(StoreSettingsService);
  inquiryCartService = inject(InquiryCartService);
  authService = inject(AuthService);
  private elementRef = inject(ElementRef);

  mobileMenuOpen = signal<boolean>(false);
  langDropdownOpen = signal<boolean>(false);

  currentLanguageObj = () => {
    const code = this.translationService.currentLang();
    return this.translationService.availableLanguages.find(l => l.code === code) || this.translationService.availableLanguages[0];
  };

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleLangDropdown(): void {
    this.langDropdownOpen.update(v => !v);
  }

  selectLanguage(lang: SupportedLang): void {
    this.translationService.setLanguage(lang);
    this.langDropdownOpen.set(false);
  }

  changeLanguage(lang: SupportedLang): void {
    this.translationService.setLanguage(lang);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.langDropdownOpen.set(false);
    }
  }
}
