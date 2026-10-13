import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { InquiryService } from '@core/services/inquiry.service';
import { AuditService } from '@core/services/audit.service';
import { AuthService } from '@core/services/auth.service';
import { InvoiceService } from '@core/services/invoice.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="p-6 lg:p-8 space-y-8">
      
      <!-- Welcome Top Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif">
            {{ 'dashboard.title' | translate }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            {{ 'dashboard.subtitle' | translate }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <a
            routerLink="/admin/billing"
            class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <span>⚡</span> {{ 'dashboard.openPos' | translate }}
          </a>
          <a
            routerLink="/admin/products"
            class="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <span>➕</span> {{ 'dashboard.addProduct' | translate }}
          </a>
          <a
            routerLink="/admin/inventory"
            class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-2"
          >
            <span>📦</span> {{ 'dashboard.recordStock' | translate }}
          </a>
        </div>
      </div>

      <!-- In-Store Billing Highlights Bar -->
      <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-800/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl font-bold">
            💵
          </div>
          <div>
            <div class="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
              {{ 'dashboard.todaySales' | translate }}
            </div>
            <div class="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              ₹{{ invoiceService.todaySales().toLocaleString('en-IN') }}
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-6 text-xs border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
          <div>
            <div class="text-slate-400 text-[11px]">{{ 'dashboard.todayInvoices' | translate }}</div>
            <div class="font-bold text-white text-base font-mono">{{ invoiceService.todayInvoices().length }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-[11px]">{{ 'dashboard.allTimeSales' | translate }}</div>
            <div class="font-bold text-emerald-400 text-base font-mono">₹{{ invoiceService.totalBilledAmount().toLocaleString('en-IN') }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-[11px]">{{ 'dashboard.aov' | translate }}</div>
            <div class="font-bold text-amber-400 text-base font-mono">₹{{ invoiceService.averageInvoiceValue().toLocaleString('en-IN') }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-[11px]">{{ 'dashboard.discountsGiven' | translate }}</div>
            <div class="font-bold text-purple-300 text-base font-mono">₹{{ invoiceService.totalDiscountsGiven().toLocaleString('en-IN') }}</div>
          </div>
          <a
            routerLink="/admin/billing/history"
            class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            {{ 'dashboard.viewAllBills' | translate }}
          </a>
        </div>
      </div>

      <!-- KPI Summary Metric Cards (7 items) -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <!-- Total Products -->
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span>{{ 'dashboard.totalProducts' | translate }}</span>
            <span class="p-2 rounded-lg bg-purple-950/60 text-purple-400">🎆</span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-white">
            {{ productService.products().length }}
          </div>
          <p class="text-[11px] text-emerald-400">
            {{ 'dashboard.activeProducts' | translate }}: {{ productService.activeProducts().length }}
          </p>
        </div>

        <!-- Inventory Valuation -->
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span>{{ 'dashboard.valuation' | translate }}</span>
            <span class="p-2 rounded-lg bg-emerald-950/60 text-emerald-400">💰</span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ₹{{ productService.inventoryValuation().toLocaleString('en-IN') }}
          </div>
          <p class="text-[11px] text-slate-400">
            {{ 'dashboard.valuationDesc' | translate }}
          </p>
        </div>

        <!-- Pending Inquiries -->
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span>{{ 'dashboard.pendingInquiries' | translate }}</span>
            <span class="p-2 rounded-lg bg-amber-950/60 text-amber-400">⏳</span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-amber-400">
            {{ inquiryService.pendingInquiries().length }}
          </div>
          <p class="text-[11px] text-slate-400">
            {{ 'dashboard.totalInquiries' | translate }} {{ inquiryService.inquiries().length }}
          </p>
        </div>

        <!-- Low Stock Alerts -->
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span>{{ 'dashboard.lowStockAlert' | translate }}</span>
            <span class="p-2 rounded-lg bg-rose-950/60 text-rose-400">⚠️</span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-rose-400">
            {{ productService.lowStockProducts().length }}
          </div>
          <p class="text-[11px] text-rose-300/80">
            {{ 'dashboard.restockNeeded' | translate }}
          </p>
        </div>

      </div>

      <!-- Main Two-Column Layout: Inquiries & Low Stock Warning -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Recent Customer Inquiries (7 cols) -->
        <div class="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-white font-serif">
                {{ 'dashboard.recentInquiries' | translate }}
              </h2>
              <p class="text-xs text-slate-400">{{ 'dashboard.recentInquiriesDesc' | translate }}</p>
            </div>
            <a routerLink="/admin/inquiries" class="text-xs font-bold text-purple-400 hover:text-purple-300">
              {{ 'dashboard.viewAllBills' | translate }}
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th class="py-3 px-2">{{ 'dashboard.refNo' | translate }}</th>
                  <th class="py-3 px-2">{{ 'dashboard.customer' | translate }}</th>
                  <th class="py-3 px-2">{{ 'dashboard.items' | translate }}</th>
                  <th class="py-3 px-2">{{ 'dashboard.status' | translate }}</th>
                  <th class="py-3 px-2 text-right">{{ 'dashboard.action' | translate }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                @for (inq of inquiryService.inquiries().slice(0, 5); track inq.id) {
                  <tr class="hover:bg-slate-900/60 transition-colors">
                    <td class="py-3 px-2 font-mono font-bold text-purple-300">
                      {{ inq.inquiryNumber }}
                    </td>
                    <td class="py-3 px-2">
                      <div class="font-semibold text-white">{{ inq.customerName }}</div>
                      <div class="text-[11px] text-slate-500">{{ inq.phone }}</div>
                    </td>
                    <td class="py-3 px-2 text-slate-300">
                      {{ inq.items.length }}
                    </td>
                    <td class="py-3 px-2">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                        [ngClass]="{
                          'bg-amber-900/60 text-amber-300 border border-amber-700': inq.status === 'new',
                          'bg-blue-900/60 text-blue-300 border border-blue-700': inq.status === 'contacted',
                          'bg-purple-900/60 text-purple-300 border border-purple-700': inq.status === 'in_review',
                          'bg-emerald-900/60 text-emerald-300 border border-emerald-700': inq.status === 'closed',
                          'bg-slate-800 text-slate-400': inq.status === 'cancelled'
                        }">
                        {{ inq.status }}
                      </span>
                    </td>
                    <td class="py-3 px-2 text-right">
                      <a [routerLink]="['/admin/inquiries']" class="text-purple-400 hover:text-purple-300 font-bold">
                        {{ 'dashboard.details' | translate }}
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Critical Low Stock Alerts (5 cols) -->
        <div class="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-white font-serif">
                {{ 'dashboard.lowStockAlerts' | translate }}
              </h2>
              <p class="text-xs text-slate-400">{{ 'dashboard.lowStockDesc' | translate }}</p>
            </div>
            <a routerLink="/admin/inventory" class="text-xs font-bold text-rose-400 hover:text-rose-300">
              {{ 'dashboard.restockBtn' | translate }}
            </a>
          </div>

          <div class="space-y-3">
            @for (p of productService.lowStockProducts().slice(0, 5); track p.id) {
              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <div class="space-y-0.5 min-w-0">
                  <h4 class="text-xs font-bold text-white truncate">{{ p.name[translationService.currentLang()] || p.name.mr }}</h4>
                  <div class="text-[11px] text-slate-400 font-mono">SKU: {{ p.sku }}</div>
                </div>
                <div class="text-right flex-shrink-0">
                  <div class="text-xs font-black text-rose-400">
                    {{ p.stockQuantity }} {{ 'dashboard.remaining' | translate }}
                  </div>
                  <div class="text-[10px] text-slate-500">{{ 'dashboard.threshold' | translate }} {{ p.lowStockThreshold }}</div>
                </div>
              </div>
            } @empty {
              <div class="py-8 text-center text-xs text-emerald-400 space-y-1">
                <span>{{ 'dashboard.allStockSufficient' | translate }}</span>
              </div>
            }
          </div>
        </div>

      </div>

      <!-- Recent Audit Activity Log -->
      <div class="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 class="text-base font-bold text-white font-serif">
          {{ 'dashboard.auditLog' | translate }}
        </h2>
        <div class="divide-y divide-slate-800/60">
          @for (log of auditService.logs().slice(0, 5); track log.id) {
            <div class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div class="flex items-start sm:items-center gap-3">
                <span class="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                  {{ log.action }}
                </span>
                <span class="text-slate-300">{{ log.details }}</span>
              </div>
              <div class="text-[11px] text-slate-500 whitespace-nowrap">
                {{ log.timestamp | date:'short' }}
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent {
  productService = inject(ProductService);
  inquiryService = inject(InquiryService);
  auditService = inject(AuditService);
  authService = inject(AuthService);
  invoiceService = inject(InvoiceService);
  translationService = inject(TranslationService);
}

