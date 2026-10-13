import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { TranslationService } from '@core/i18n/translation.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ToastComponent } from '@shared/components/toast.component';
import { UserRole } from '@core/models';
import { SupportedLang } from '@core/i18n/translations';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent, TranslatePipe],
  template: `
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row">
      
      <!-- Mobile Top Bar -->
      <div class="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-xs">
            ✨
          </div>
          <div>
            <span class="font-bold text-white text-sm">{{ 'brand.name' | translate }}</span>
            <span class="text-[10px] text-purple-400 block font-semibold">{{ 'admin.suite' | translate }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Mobile Language Pill -->
          <div class="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
            @for (l of translationService.availableLanguages; track l.code) {
              <button
                type="button"
                (click)="translationService.setLanguage(l.code)"
                [ngClass]="{
                  'bg-purple-600 text-white font-bold': translationService.currentLang() === l.code,
                  'text-slate-400': translationService.currentLang() !== l.code
                }"
                class="px-1.5 py-0.5 rounded transition-colors"
              >
                {{ l.code.toUpperCase() }}
              </button>
            }
          </div>

          <button
            (click)="toggleSidebar()"
            class="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {{ sidebarOpen() ? '✕' : '☰' }}
          </button>
        </div>
      </div>

      <!-- Sidebar -->
      <aside
        [ngClass]="{
          'translate-x-0': sidebarOpen(),
          '-translate-x-full lg:translate-x-0': !sidebarOpen()
        }"
        class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0"
      >
        <!-- Top Section -->
        <div class="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          <!-- Brand Logo -->
          <div class="flex items-center gap-3 px-2">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg">
              ✨
            </div>
            <div>
              <h2 class="font-black text-white text-base tracking-tight font-serif">{{ 'brand.name' | translate }}</h2>
              <p class="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">{{ 'admin.suite' | translate }}</p>
            </div>
          </div>

          <!-- Language Selector in Sidebar -->
          <div class="flex items-center justify-between text-[11px] bg-slate-900/90 rounded-xl px-3 py-2 border border-slate-800">
            <span class="text-slate-400 font-semibold">🌐 भाषा (Language):</span>
            <div class="flex items-center gap-1">
              @for (l of translationService.availableLanguages; track l.code) {
                <button
                  type="button"
                  (click)="translationService.setLanguage(l.code)"
                  [ngClass]="{
                    'bg-purple-600 text-white font-bold shadow-2xs': translationService.currentLang() === l.code,
                    'text-slate-400 hover:text-white': translationService.currentLang() !== l.code
                  }"
                  class="px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer"
                >
                  {{ l.label }}
                </button>
              }
            </div>
          </div>

          <!-- Current User & Role Switcher Badge -->
          <div class="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-400">{{ 'admin.loginAs' | translate }}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                [ngClass]="{
                  'bg-purple-900/60 text-purple-300 border border-purple-700': authService.userRole() === 'super_admin',
                  'bg-blue-900/60 text-blue-300 border border-blue-700': authService.userRole() === 'admin',
                  'bg-emerald-900/60 text-emerald-300 border border-emerald-700': authService.userRole() === 'staff',
                  'bg-amber-900/60 text-amber-300 border border-amber-700': authService.userRole() === 'customer'
                }">
                {{ authService.userRole() === 'super_admin' ? ('role.superAdmin' | translate) : (authService.userRole() === 'admin' ? ('role.admin' | translate) : (authService.userRole() === 'staff' ? ('role.staff' | translate) : ('role.customer' | translate))) }}
              </span>
            </div>
            <p class="text-xs font-semibold text-white truncate">
              {{ authService.currentUser()?.displayName || 'Authorized User' }}
            </p>

            <!-- Quick Demo Role Switcher -->
            <div class="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span class="text-slate-500 font-medium">{{ 'admin.switchRole' | translate }}</span>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  (click)="switchRole('super_admin')"
                  class="px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer"
                  [ngClass]="authService.userRole() === 'super_admin' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:bg-slate-800'"
                  title="Super Admin"
                >
                  SA
                </button>
                <button
                  type="button"
                  (click)="switchRole('admin')"
                  class="px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer"
                  [ngClass]="authService.userRole() === 'admin' ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-slate-800'"
                  title="Admin"
                >
                  ADM
                </button>
                <button
                  type="button"
                  (click)="switchRole('staff')"
                  class="px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer"
                  [ngClass]="authService.userRole() === 'staff' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-slate-800'"
                  title="Staff"
                >
                  STF
                </button>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="space-y-1 text-sm font-medium">
            
            <!-- SECTION 1: Core Operations (Staff, Admin, Super Admin) -->
            <div class="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {{ 'admin.coreOperations' | translate }}
            </div>

            <a
              routerLink="/admin/dashboard"
              (click)="closeSidebarOnMobile()"
              routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <span class="text-lg">📊</span>
              <span>{{ 'admin.dashboard' | translate }}</span>
            </a>

            <!-- In-Store POS Billing Suite -->
            <a
              routerLink="/admin/billing"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeSidebarOnMobile()"
              routerLinkActive="bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-emerald-400 hover:text-white hover:bg-slate-900 font-bold transition-colors"
            >
              <span class="text-lg">⚡</span>
              <span>{{ 'admin.posBilling' | translate }}</span>
            </a>

            <a
              routerLink="/admin/billing/history"
              (click)="closeSidebarOnMobile()"
              routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <span class="text-lg">📜</span>
              <span>{{ 'admin.billingHistory' | translate }}</span>
            </a>

            <a
              routerLink="/admin/billing/returns"
              (click)="closeSidebarOnMobile()"
              routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <span class="text-lg">🔄</span>
              <span>{{ 'admin.returns' | translate }}</span>
            </a>

            <a
              routerLink="/admin/inventory"
              (click)="closeSidebarOnMobile()"
              routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <span class="text-lg">📦</span>
              <span>{{ 'admin.inventory' | translate }}</span>
            </a>

            <a
              routerLink="/admin/inquiries"
              (click)="closeSidebarOnMobile()"
              routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <span class="text-lg">📋</span>
              <span>{{ 'admin.inquiries' | translate }}</span>
            </a>

            <!-- SECTION 2: Store Management (Manager & Super Admin) -->
            @if (authService.isAdmin()) {
              <div class="px-2 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-purple-400/80 border-t border-slate-800/60 mt-2">
                {{ 'admin.management' | translate }}
              </div>

              <a
                routerLink="/admin/products"
                (click)="closeSidebarOnMobile()"
                routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span class="text-lg">🎆</span>
                <span>{{ 'admin.products' | translate }}</span>
              </a>

              <a
                routerLink="/admin/categories"
                (click)="closeSidebarOnMobile()"
                routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span class="text-lg">📂</span>
                <span>{{ 'admin.categories' | translate }}</span>
              </a>

              <a
                routerLink="/admin/offers"
                (click)="closeSidebarOnMobile()"
                routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span class="text-lg">🎉</span>
                <span>{{ 'admin.offers' | translate }}</span>
              </a>

              <a
                routerLink="/admin/customers"
                (click)="closeSidebarOnMobile()"
                routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span class="text-lg">👥</span>
                <span>{{ 'admin.customers' | translate }}</span>
              </a>

              <a
                routerLink="/admin/banners"
                (click)="closeSidebarOnMobile()"
                routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span class="text-lg">🖼️</span>
                <span>{{ 'admin.banners' | translate }}</span>
              </a>

              <a
                routerLink="/admin/reports"
                (click)="closeSidebarOnMobile()"
                routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span class="text-lg">📈</span>
                <span>{{ 'admin.reports' | translate }}</span>
              </a>

              <a
                routerLink="/admin/settings/billing"
                (click)="closeSidebarOnMobile()"
                routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span class="text-lg">🧾</span>
                <span>{{ 'admin.billingSettings' | translate }}</span>
              </a>
            }

            <!-- SECTION 3: Super Admin Exclusives (Store Owner Only) -->
            @if (authService.isSuperAdmin()) {
              <div class="px-2 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/80 border-t border-slate-800/60 mt-2">
                {{ 'admin.ownerControl' | translate }}
              </div>

              <a
                routerLink="/admin/users"
                (click)="closeSidebarOnMobile()"
                routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span class="text-lg">🛡️</span>
                <span>{{ 'admin.staffManagement' | translate }}</span>
              </a>

              <a
                routerLink="/admin/settings"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeSidebarOnMobile()"
                routerLinkActive="bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span class="text-lg">⚙️</span>
                <span>{{ 'admin.storeSettings' | translate }}</span>
              </a>
            }
          </nav>
        </div>

        <!-- Bottom Actions -->
        <div class="p-5 border-t border-slate-800/80 space-y-2">
          <a
            routerLink="/"
            class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span>🌐</span>
            <span>{{ 'admin.viewWebsite' | translate }}</span>
          </a>

          <button
            (click)="logout()"
            class="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-900/40 transition-colors cursor-pointer"
          >
            <span>🚪</span>
            <span>{{ 'admin.logout' | translate }}</span>
          </button>
        </div>
      </aside>

      <!-- Main Content View -->
      <main class="flex-1 min-w-0 bg-slate-900 overflow-y-auto min-h-screen">
        <router-outlet />
      </main>

      <app-toast-container />
    </div>
  `
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  translationService = inject(TranslationService);
  private router = inject(Router);
  sidebarOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    }
  }

  switchRole(role: UserRole): void {
    this.authService.demoSwitchRole(role);
    if (role === 'staff') {
      const url = this.router.url;
      const restricted = ['/admin/users', '/admin/settings', '/admin/reports', '/admin/banners', '/admin/categories', '/admin/offers', '/admin/products', '/admin/customers'];
      if (restricted.some(p => url.startsWith(p))) {
        this.router.navigate(['/admin/billing']);
      }
    } else if (role === 'admin') {
      const url = this.router.url;
      const restricted = ['/admin/users', '/admin/settings'];
      if (restricted.some(p => url === p)) {
        this.router.navigate(['/admin/dashboard']);
      }
    } else if (role === 'customer') {
      this.router.navigate(['/inquiry-cart']);
    }
  }

  logout(): void {
    this.authService.logout('/');
  }
}
