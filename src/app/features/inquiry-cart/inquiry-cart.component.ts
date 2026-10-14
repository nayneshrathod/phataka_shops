import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InquiryCartService } from '@core/services/inquiry-cart.service';
import { StoreSettingsService } from '@core/services/store-settings.service';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/services/auth.service';
import { TranslationService } from '@core/i18n/translation.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { CustomerQuotationModalComponent } from './customer-quotation-modal.component';

@Component({
  selector: 'app-inquiry-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe, CustomerQuotationModalComponent],
  template: `
    <div class="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto space-y-8">
        
        <!-- Header Banner -->
        <div class="text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <span>🪔</span>
            <span>{{ 'cart.inquiryBadge' | translate }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-black text-purple-950 font-serif">
            {{ 'cart.title' | translate }}
          </h1>
          <p class="text-slate-600 max-w-2xl mx-auto text-sm">
            {{ 'cart.subtitle' | translate }}
          </p>
        </div>

        <!-- Statutory Legal Compliance Warning Box -->
        <div class="p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-xs flex items-start gap-4">
          <div class="text-3xl flex-shrink-0">⚠️</div>
          <div class="space-y-1.5 text-xs text-amber-950">
            <h4 class="font-bold text-sm text-amber-900">
              {{ 'cart.legalTitle' | translate }}
            </h4>
            <p class="leading-relaxed">
              {{ 'cart.legalBody' | translate }}
            </p>
          </div>
        </div>

        @if (cartService.isEmpty()) {
          <!-- Empty Cart State -->
          <div class="bg-white rounded-3xl p-12 text-center border border-purple-100 shadow-xs space-y-6 max-w-lg mx-auto">
            <div class="w-20 h-20 mx-auto rounded-full bg-purple-50 text-4xl flex items-center justify-center text-purple-600">
              🛒
            </div>
            <div class="space-y-2">
              <h3 class="text-xl font-bold text-slate-800">
                {{ 'cart.emptyTitle' | translate }}
              </h3>
              <p class="text-slate-500 text-sm">
                {{ 'cart.emptySubtitle' | translate }}
              </p>
            </div>
            <a
              routerLink="/products"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <span>🎆</span>
              <span>{{ 'cart.exploreCatalog' | translate }}</span>
            </a>
          </div>
        } @else {
          <!-- Two Column Layout: Items + Customer Form -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left 2 Cols: Items List -->
            <div class="lg:col-span-2 space-y-4">
              <div class="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
                <div class="p-4 sm:p-5 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 flex items-center justify-between">
                  <div class="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span>📋 {{ 'cart.selectedItems' | translate }}</span>
                    <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-200 text-purple-900">
                      {{ cartService.itemCount() }} {{ 'common.quantity' | translate }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      (click)="openQuotationModal()"
                      class="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>🧾</span>
                      <span>{{ 'cart.generateBill' | translate }}</span>
                    </button>
                    <button
                      type="button"
                      (click)="cartService.clearCart()"
                      class="text-xs text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
                    >
                      {{ 'cart.clearAll' | translate }}
                    </button>
                  </div>
                </div>

                <div class="divide-y divide-purple-50">
                  @for (item of cartService.items(); track item.productId) {
                    <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-purple-50/30 transition-colors">
                      <div class="flex items-center gap-4">
                        <img
                          [src]="item.image"
                          [alt]="item.name[translationService.currentLang()] || item.name.mr"
                          class="w-16 h-16 rounded-xl object-cover border border-purple-100 flex-shrink-0"
                          (error)="handleImageError($event)"
                        />
                        <div class="space-y-1">
                          <h4 class="font-bold text-slate-900 text-sm">
                            {{ item.name[translationService.currentLang()] || item.name.mr }}
                          </h4>
                          <div class="flex items-center gap-2 text-xs text-slate-500">
                            <span class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-[11px] text-purple-700">
                              SKU: {{ item.sku }}
                            </span>
                            @if (item.categoryName) {
                              <span>• {{ item.categoryName }}</span>
                            }
                          </div>
                          <div class="text-xs font-semibold text-purple-900">
                            {{ 'cart.indicativeRate' | translate }}: ₹{{ item.indicativeUnitPrice }} / {{ 'common.quantity' | translate }}
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center justify-between sm:justify-end gap-6">
                        <!-- Quantity Stepper -->
                        <div class="flex items-center border border-purple-200 rounded-xl bg-purple-50/50 p-1">
                          <button
                            type="button"
                            (click)="cartService.updateQuantity(item.productId, item.quantity - 1)"
                            class="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-purple-100 text-purple-900 font-bold text-sm shadow-2xs transition-colors cursor-pointer"
                          >
                            −
                          </button>
                          <span class="w-10 text-center font-bold text-sm text-purple-950 font-mono">
                            {{ item.quantity }}
                          </span>
                          <button
                            type="button"
                            (click)="cartService.updateQuantity(item.productId, item.quantity + 1)"
                            class="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-purple-100 text-purple-900 font-bold text-sm shadow-2xs transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <!-- Item Subtotal -->
                        <div class="text-right">
                          <div class="text-sm font-black text-slate-900 font-mono">
                            ₹{{ (item.quantity * item.indicativeUnitPrice).toLocaleString('en-IN') }}
                          </div>
                          <button
                            type="button"
                            (click)="cartService.removeItem(item.productId)"
                            class="text-[11px] text-rose-500 hover:text-rose-700 font-semibold mt-0.5 cursor-pointer"
                          >
                            {{ 'common.delete' | translate }} ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="flex items-center justify-between text-xs text-slate-500 px-2">
                <a routerLink="/products" class="text-purple-700 hover:underline font-bold flex items-center gap-1">
                  <span>←</span> {{ 'cart.exploreCatalog' | translate }}
                </a>
              </div>
            </div>

            <!-- Right 1 Col: Customer Details & Actions -->
            <div class="space-y-6">
              <div class="bg-white rounded-2xl border border-purple-100 p-6 shadow-xs space-y-5">
                <h3 class="font-bold text-base text-slate-900 border-b border-purple-50 pb-3 flex items-center gap-2">
                  <span>👤</span> {{ 'cart.customerInfo' | translate }}
                </h3>

                <div class="space-y-3.5">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      {{ 'cart.customerName' | translate }}
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="customerName"
                      placeholder="e.g. Rahul Shinde"
                      class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      {{ 'cart.customerPhone' | translate }}
                    </label>
                    <input
                      type="tel"
                      [(ngModel)]="customerPhone"
                      placeholder="e.g. 9373345328"
                      class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      {{ 'cart.customerCity' | translate }}
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="customerCity"
                      placeholder="e.g. Pune, Maharashtra"
                      class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      {{ 'cart.customerNotes' | translate }}
                    </label>
                    <textarea
                      rows="2"
                      [(ngModel)]="customerNotes"
                      placeholder="e.g. Special festival requirements..."
                      class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <!-- Inquiry Summary Box -->
                <div class="pt-4 border-t border-purple-100 space-y-2.5 text-xs">
                  <div class="flex justify-between text-slate-600">
                    <span>{{ 'cart.selectedItems' | translate }}</span>
                    <span class="font-bold text-slate-900 font-mono">{{ cartService.itemCount() }}</span>
                  </div>
                  <div class="flex justify-between text-slate-600">
                    <span>{{ 'cart.estimatedTotal' | translate }}</span>
                    <span class="text-base font-black text-purple-900 font-mono">
                      ₹{{ cartService.estimatedTotal().toLocaleString('en-IN') }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 italic">
                    {{ 'cart.noteDisclaimer' | translate }}
                  </p>
                </div>

                <!-- Primary Action: Generate Official Estimate Quotation Bill -->
                <button
                  type="button"
                  (click)="openQuotationModal()"
                  class="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-800 hover:to-indigo-800 shadow-md shadow-purple-700/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🧾</span>
                  <span>{{ 'cart.generateBill' | translate }}</span>
                </button>

                <!-- Secondary Action: WhatsApp Inquiry -->
                <button
                  type="button"
                  (click)="sendWhatsAppInquiry()"
                  class="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-sm shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>💬</span>
                  <span>{{ 'cart.whatsappInquiry' | translate }}</span>
                </button>

                <!-- Store Address & Call -->
                <div class="p-3.5 rounded-xl bg-purple-50 text-xs text-purple-900 space-y-1">
                  <div class="font-bold flex items-center gap-1">
                    <span>🏬</span>
                    <span>{{ 'cart.visitStore' | translate }}</span>
                  </div>
                  <p class="text-[11px] text-purple-800">
                    {{ settingsService.settings().address }}
                  </p>
                  <p class="text-[11px] font-semibold text-purple-900 pt-1">
                    📞 {{ 'cart.callStore' | translate }} {{ settingsService.settings().contactNumber }}
                  </p>
                </div>
              </div>
            </div>

          </div>
        }

        <!-- Customer Estimate Quotation Bill Modal -->
        @if (showQuotationModal()) {
          <app-customer-quotation-modal
            [items]="cartService.items()"
            [customerName]="customerName()"
            [customerPhone]="customerPhone()"
            [customerCity]="customerCity()"
            [customerNotes]="customerNotes()"
            (close)="showQuotationModal.set(false)"
          />
        }

      </div>
    </div>
  `
})
export class InquiryCartComponent implements OnInit {
  cartService = inject(InquiryCartService);
  settingsService = inject(StoreSettingsService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  translationService = inject(TranslationService);

  customerName = signal<string>('');
  customerPhone = signal<string>('');
  customerCity = signal<string>('');
  customerNotes = signal<string>('');
  showQuotationModal = signal<boolean>(false);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      if (user.displayName && !this.customerName()) {
        this.customerName.set(user.displayName);
      }
      if (user.phone && !this.customerPhone()) {
        this.customerPhone.set(user.phone);
      }
    }
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400';
  }

  openQuotationModal(): void {
    if (this.cartService.isEmpty()) {
      this.toastService.warning(this.translationService.t('common.error'));
      return;
    }
    this.showQuotationModal.set(true);
  }

  sendWhatsAppInquiry(): void {
    if (this.cartService.isEmpty()) {
      this.toastService.warning(this.translationService.t('common.error'));
      return;
    }

    const name = this.customerName() || 'Customer';
    const phone = this.customerPhone();
    const city = this.customerCity();
    const note = `${city ? 'Area: ' + city + '. ' : ''}${this.customerNotes()}`;

    const text = this.cartService.generateWhatsAppInquiryText(name, phone, note);
    const storeWhatsapp = this.settingsService.settings().whatsappNumber.replace(/\D/g, '');

    const url = `https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    this.toastService.success('WhatsApp URL opened.');
  }
}
