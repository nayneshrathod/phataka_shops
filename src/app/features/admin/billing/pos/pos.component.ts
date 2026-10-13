import { Component, inject, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product, PosCartItem, Invoice, PaymentMethod } from '@core/models';
import { ProductService } from '@core/services/product.service';
import { PosCartService } from '@core/services/pos-cart.service';
import { OfferService } from '@core/services/offer.service';
import { InvoiceService } from '@core/services/invoice.service';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/services/auth.service';
import { InvoicePreviewComponent } from '../invoice-preview/invoice-preview.component';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InvoicePreviewComponent],
  template: `
    <div class="h-[calc(100vh-4rem)] flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      
      <!-- Top POS Status & Mobile Tab Switcher Bar -->
      <div class="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white text-base font-bold shadow-md">
            ⚡
          </div>
          <div>
            <h2 class="text-sm font-black text-white flex items-center gap-2">
              <span>प्रतीक फटाके POS टर्मिनल (Counter Billing)</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                ● Live Staff Terminal
              </span>
            </h2>
            <p class="text-[11px] text-slate-400">
              कॅशियर: {{ authService.currentUser()?.displayName || 'स्टाफ' }} ({{ authService.currentUser()?.role || 'staff' }})
            </p>
          </div>
        </div>

        <!-- Mobile View Navigation Tabs -->
        <div class="flex lg:hidden items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            (click)="mobileTab.set('catalog')"
            [ngClass]="mobileTab() === 'catalog' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'"
            class="px-3 py-1.5 rounded-lg transition-colors"
          >
            फटाके (Catalog)
          </button>
          <button
            type="button"
            (click)="mobileTab.set('cart')"
            [ngClass]="mobileTab() === 'cart' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'"
            class="px-3 py-1.5 rounded-lg transition-colors relative"
          >
            कार्ट ({{ cartService.itemCount() }})
          </button>
          <button
            type="button"
            (click)="mobileTab.set('summary')"
            [ngClass]="mobileTab() === 'summary' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'"
            class="px-3 py-1.5 rounded-lg transition-colors"
          >
            बिल: ₹{{ cartService.totals().grandTotal }}
          </button>
        </div>

        <!-- Quick Top Metrics & Actions -->
        <div class="hidden sm:flex items-center gap-4 text-xs font-semibold">
          <div class="text-slate-300">
            आजची विक्री: <strong class="text-emerald-400 font-mono">₹{{ invoiceService.todaySales().toLocaleString('en-IN') }}</strong>
            ({{ invoiceService.todayInvoices().length }} बिले)
          </div>
          <button
            type="button"
            (click)="confirmClearCart()"
            [disabled]="cartService.isEmpty()"
            class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 text-xs font-bold transition-colors disabled:opacity-40"
          >
            कार्ट साफ करा (Clear)
          </button>
        </div>
      </div>

      <!-- Main 3-Column POS Workspace -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        <!-- ========================================== -->
        <!-- LEFT PANEL (Cols 5): Catalog & Search -->
        <!-- ========================================== -->
        <div
          [ngClass]="{'hidden lg:flex': mobileTab() !== 'catalog', 'flex': mobileTab() === 'catalog'}"
          class="lg:col-span-5 flex-col border-r border-slate-800 bg-slate-950 overflow-hidden"
        >
          <!-- Search Header -->
          <div class="p-3.5 border-b border-slate-800 space-y-2.5 bg-slate-900/60 flex-shrink-0">
            <div class="relative">
              <input
                #searchInput
                type="text"
                [(ngModel)]="searchQuery"
                (keydown.enter)="handleSearchEnter()"
                placeholder="फटाका नाव, SKU किंवा बारकोड शोधा... [Enter]"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <span class="absolute left-3 top-2.5 text-sm text-slate-400">🔍</span>
              @if (searchQuery()) {
                <button
                  type="button"
                  (click)="searchQuery.set('')"
                  class="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              }
            </div>

            <!-- Category Filter Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                type="button"
                (click)="selectedCategory.set('all')"
                [ngClass]="selectedCategory() === 'all' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'"
                class="px-2.5 py-1 rounded-lg flex-shrink-0 transition-colors"
              >
                सर्व (All)
              </button>
              @for (cat of productService.activeCategories(); track cat.id) {
                <button
                  type="button"
                  (click)="selectedCategory.set(cat.id)"
                  [ngClass]="selectedCategory() === cat.id ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'"
                  class="px-2.5 py-1 rounded-lg flex-shrink-0 transition-colors"
                >
                  {{ cat.name.mr }}
                </button>
              }
            </div>
          </div>

          <!-- Product Cards Grid -->
          <div class="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5 content-start">
            @for (product of filteredProducts(); track product.id) {
              <div
                (click)="addToCart(product)"
                class="group bg-slate-900 border border-slate-800 hover:border-purple-600 rounded-xl p-2.5 flex flex-col justify-between cursor-pointer transition-all hover:bg-slate-800/80 active:scale-95 relative"
              >
                <div class="space-y-1.5">
                  <div class="relative w-full pt-[60%] rounded-lg overflow-hidden bg-slate-950">
                    <img
                      [src]="product.images[0]"
                      [alt]="product.name.mr"
                      class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                      (error)="handleImageError($event)"
                    />
                    <!-- Stock Pill -->
                    <div class="absolute top-1.5 right-1.5">
                      @if (product.stockQuantity <= 0) {
                        <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-600 text-white">
                          निरंक
                        </span>
                      } @else if (product.stockQuantity <= product.lowStockThreshold) {
                        <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-slate-950">
                          साठा: {{ product.stockQuantity }}
                        </span>
                      } @else {
                        <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white">
                          साठा: {{ product.stockQuantity }}
                        </span>
                      }
                    </div>
                  </div>

                  <div>
                    <span class="font-mono text-[9px] text-purple-400">SKU: {{ product.sku }}</span>
                    <h4 class="text-xs font-bold text-white line-clamp-1 group-hover:text-purple-300">
                      {{ product.name.mr }}
                    </h4>
                  </div>
                </div>

                <div class="pt-2 mt-1 border-t border-slate-800 flex items-center justify-between">
                  <div class="text-sm font-black text-amber-400 font-mono">
                    ₹{{ product.retailPrice }}
                  </div>
                  <span class="w-6 h-6 rounded-lg bg-purple-600 group-hover:bg-purple-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    +
                  </span>
                </div>
              </div>
            } @empty {
              <div class="col-span-full py-12 text-center text-slate-500 text-xs">
                कोणताही फटाका सापडला नाही.
              </div>
            }
          </div>
        </div>

        <!-- ========================================== -->
        <!-- MIDDLE PANEL (Cols 4): Current Billing Cart -->
        <!-- ========================================== -->
        <div
          [ngClass]="{'hidden lg:flex': mobileTab() !== 'cart', 'flex': mobileTab() === 'cart'}"
          class="lg:col-span-4 flex-col border-r border-slate-800 bg-slate-950 overflow-hidden"
        >
          <!-- Cart Header -->
          <div class="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 flex-shrink-0">
            <div class="font-bold text-xs text-white flex items-center gap-2">
              <span>🛒 चालू बिलिंग कार्ट</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                {{ cartService.itemCount() }} नग
              </span>
            </div>
            <div class="text-[11px] text-slate-400">
              एकूण: <strong class="text-amber-400 font-mono">₹{{ cartService.totals().grossAmount }}</strong>
            </div>
          </div>

          <!-- Cart Line Items List -->
          <div class="flex-1 overflow-y-auto p-3 space-y-2.5">
            @for (item of cartService.items(); track item.productId) {
              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                <div class="flex items-start justify-between gap-2">
                  <div class="space-y-0.5">
                    <h5 class="text-xs font-bold text-white line-clamp-1">
                      {{ item.name.mr }}
                    </h5>
                    <div class="flex items-center gap-2 text-[10px] text-slate-400">
                      <span class="font-mono text-purple-400">{{ item.sku }}</span>
                      <span>• दर: ₹{{ item.originalUnitPrice }}</span>
                      <span class="text-slate-500">(उपलब्ध: {{ item.availableStock }})</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    (click)="cartService.removeItem(item.productId)"
                    class="text-slate-500 hover:text-rose-400 text-xs font-bold p-1"
                    title="काढा"
                  >
                    ✕
                  </button>
                </div>

                <!-- Quantity & Line Subtotal Row -->
                <div class="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                  <!-- Stepper -->
                  <div class="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5">
                    <button
                      type="button"
                      (click)="cartService.updateQuantity(item.productId, item.quantity - 1)"
                      class="w-6 h-6 flex items-center justify-center rounded bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      [ngModel]="item.quantity"
                      (ngModelChange)="handleQtyChange(item.productId, $event)"
                      min="1"
                      [max]="item.availableStock"
                      class="w-10 text-center bg-transparent text-xs font-bold font-mono text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      (click)="cartService.updateQuantity(item.productId, item.quantity + 1)"
                      class="w-6 h-6 flex items-center justify-center rounded bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  <!-- Item Discount Trigger -->
                  <button
                    type="button"
                    (click)="openItemDiscountPrompt(item)"
                    [ngClass]="item.lineDiscountAmount > 0 ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-slate-800 text-slate-400 border-slate-700'"
                    class="px-2 py-1 rounded text-[10px] font-bold border transition-colors"
                  >
                    {{ item.lineDiscountAmount > 0 ? '-₹' + item.lineDiscountAmount : '% सवलत' }}
                  </button>

                  <!-- Final Line Total -->
                  <div class="text-right font-mono font-bold text-xs text-emerald-400">
                    ₹{{ item.lineTotal }}
                  </div>
                </div>
              </div>
            } @empty {
              <div class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
                <div class="text-4xl">🛒</div>
                <div class="text-xs">
                  कार्ट रिकामी आहे.<br />डावीकडून फटाके निवडा किंवा SKU टाईप करा.
                </div>
              </div>
            }
          </div>
        </div>

        <!-- ========================================== -->
        <!-- RIGHT PANEL (Cols 3): Customer & Bill Summary -->
        <!-- ========================================== -->
        <div
          [ngClass]="{'hidden lg:flex': mobileTab() !== 'summary', 'flex': mobileTab() === 'summary'}"
          class="lg:col-span-3 flex-col bg-slate-900 overflow-y-auto p-4 space-y-4"
        >
          <!-- Customer Details Box -->
          <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 class="text-xs font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <span>👤</span> ग्राहक तपशील (Customer)
            </h4>

            <div class="space-y-2">
              <div>
                <label class="block text-[10px] font-semibold text-slate-400 mb-0.5">नाव (Name)</label>
                <input
                  type="text"
                  [ngModel]="cartService.customer().name"
                  (ngModelChange)="cartService.setCustomer({ name: $event })"
                  placeholder="उदा. राहुल शिंदे"
                  class="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label class="block text-[10px] font-semibold text-slate-400 mb-0.5">मोबाईल नंबर (WhatsApp)</label>
                <input
                  type="tel"
                  [ngModel]="cartService.customer().phone"
                  (ngModelChange)="cartService.setCustomer({ phone: $event })"
                  placeholder="उदा. 9822012345"
                  class="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div class="flex items-center gap-2 pt-1 text-[11px] text-slate-300">
                <input
                  type="checkbox"
                  id="consentWa"
                  [ngModel]="cartService.customer().consentForWhatsApp"
                  (ngModelChange)="cartService.setCustomer({ consentForWhatsApp: $event })"
                  class="rounded text-purple-600 focus:ring-0"
                />
                <label for="consentWa" class="cursor-pointer select-none">
                  WhatsApp बिल पावती संमती
                </label>
              </div>
            </div>
          </div>

          <!-- Coupon / Offers Section -->
          <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 class="text-xs font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span>🎉 कूपन व ऑफर्स</span>
              <button
                type="button"
                (click)="openBillDiscountPrompt()"
                class="text-[10px] text-purple-400 hover:underline"
              >
                + बिल सवलत
              </button>
            </h4>

            <!-- Coupon Input -->
            <div class="flex gap-1.5">
              <input
                type="text"
                [(ngModel)]="couponCodeInput"
                placeholder="कूपन कोड (उदा. DIWALI10)"
                class="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white uppercase focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                (click)="applyCoupon()"
                class="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
              >
                लागू
              </button>
            </div>

            <!-- Active Applied Offers Pills -->
            @if (cartService.appliedOffers().length > 0) {
              <div class="space-y-1.5 pt-1">
                @for (offer of cartService.appliedOffers(); track offer.id) {
                  <div class="flex items-center justify-between p-2 rounded-lg bg-purple-950/60 border border-purple-800 text-xs">
                    <span class="font-bold text-purple-300 line-clamp-1">{{ offer.title.mr }}</span>
                    <button
                      type="button"
                      (click)="cartService.removeOffer(offer.id)"
                      class="text-rose-400 hover:text-rose-300 ml-2 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                }
              </div>
            }

            @if (cartService.billDiscount()) {
              <div class="flex items-center justify-between p-2 rounded-lg bg-amber-950/60 border border-amber-800 text-xs">
                <span class="font-bold text-amber-300">
                  बिल सवलत: {{ cartService.billDiscount()?.value }}{{ cartService.billDiscount()?.type === 'percentage' ? '%' : '₹' }}
                </span>
                <button
                  type="button"
                  (click)="cartService.setBillDiscount(null)"
                  class="text-rose-400 hover:text-rose-300 ml-2 font-bold"
                >
                  ✕
                </button>
              </div>
            }
          </div>

          <!-- Bill Calculation Breakdown -->
          <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
            <div class="flex justify-between text-slate-400">
              <span>एकूण रक्कम (Gross):</span>
              <span class="font-mono">₹{{ cartService.totals().grossAmount }}</span>
            </div>

            @if (cartService.totals().totalDiscount > 0) {
              <div class="flex justify-between text-rose-400 font-bold">
                <span>एकूण सवलत (Discount):</span>
                <span class="font-mono">-₹{{ cartService.totals().totalDiscount }}</span>
              </div>
            }

            <div class="flex justify-between text-slate-400 text-[11px]">
              <span>करपात्र मूल्य (Taxable):</span>
              <span class="font-mono">₹{{ cartService.totals().taxableAmount }}</span>
            </div>

            <div class="flex justify-between text-slate-400 text-[11px]">
              <span>GST ({{ cartService.totals().taxBreakdown.cgstRate * 2 }}% समाविष्ट):</span>
              <span class="font-mono">₹{{ cartService.totals().taxBreakdown.totalTax }}</span>
            </div>

            @if (cartService.totals().roundingAdjustment !== 0) {
              <div class="flex justify-between text-slate-500 text-[11px]">
                <span>राउंड ऑफ (Round Off):</span>
                <span class="font-mono">{{ cartService.totals().roundingAdjustment > 0 ? '+' : '' }}₹{{ cartService.totals().roundingAdjustment }}</span>
              </div>
            }

            <!-- Grand Total Highlight -->
            <div class="pt-2 border-t border-slate-800 flex items-baseline justify-between text-white">
              <span class="font-bold text-sm">अंतिम देय रक्कम:</span>
              <span class="font-mono text-2xl font-black text-amber-400">
                ₹{{ cartService.totals().grandTotal.toLocaleString('en-IN') }}
              </span>
            </div>

            @if (cartService.totals().customerSavings > 0) {
              <div class="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[11px] text-center font-bold">
                🌟 ग्राहक बचत: ₹{{ cartService.totals().customerSavings }}
              </div>
            }
          </div>

          <!-- Payment Method Selector -->
          <div class="space-y-2">
            <label class="block text-[11px] font-bold text-slate-400 uppercase">पेमेंट पद्धत (Payment)</label>
            <div class="grid grid-cols-4 gap-1.5 text-xs font-bold">
              <button
                type="button"
                (click)="cartService.setPaymentMethod('cash')"
                [ngClass]="cartService.paymentMethod() === 'cash' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
                class="py-2 rounded-xl transition-all"
              >
                💵 रोख
              </button>
              <button
                type="button"
                (click)="cartService.setPaymentMethod('upi')"
                [ngClass]="cartService.paymentMethod() === 'upi' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
                class="py-2 rounded-xl transition-all"
              >
                📱 UPI
              </button>
              <button
                type="button"
                (click)="cartService.setPaymentMethod('card')"
                [ngClass]="cartService.paymentMethod() === 'card' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
                class="py-2 rounded-xl transition-all"
              >
                💳 कार्ड
              </button>
              <button
                type="button"
                (click)="cartService.setPaymentMethod('split')"
                [ngClass]="cartService.paymentMethod() === 'split' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
                class="py-2 rounded-xl transition-all"
              >
                🔀 स्प्लिट
              </button>
            </div>

            <!-- Cash Tendered & Change Due -->
            @if (cartService.paymentMethod() === 'cash') {
              <div class="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label class="block text-[10px] text-slate-400 mb-0.5">प्राप्त रोख (Tendered)</label>
                  <input
                    type="number"
                    [ngModel]="cartService.amountReceived()"
                    (ngModelChange)="cartService.setAmountReceived($event)"
                    class="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 mb-0.5">परत बाकी (Change)</label>
                  <div class="px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
                    ₹{{ cartService.changeDue() }}
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Finalize Sale CTA Button -->
          <button
            type="button"
            (click)="finalizeSale()"
            [disabled]="cartService.isEmpty() || isFinalizing()"
            class="w-full py-4 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 shadow-xl shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>⚡</span>
            <span>बिल पूर्ण करा (Finalize Sale)</span>
          </button>
        </div>

      </div>

      <!-- Finalized Invoice Preview Modal -->
      @if (activeInvoice()) {
        <app-invoice-preview
          [invoice]="activeInvoice()!"
          (close)="closeInvoiceModal()"
        />
      }

    </div>
  `
})
export class PosComponent {
  productService = inject(ProductService);
  cartService = inject(PosCartService);
  offerService = inject(OfferService);
  invoiceService = inject(InvoiceService);
  toastService = inject(ToastService);
  authService = inject(AuthService);

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');
  mobileTab = signal<'catalog' | 'cart' | 'summary'>('catalog');
  couponCodeInput = signal<string>('');
  isFinalizing = signal<boolean>(false);
  activeInvoice = signal<Invoice | null>(null);

  filteredProducts = computed(() => {
    let prods = this.productService.activeProducts();
    const cat = this.selectedCategory();
    if (cat !== 'all') {
      prods = prods.filter(p => p.categoryId === cat);
    }
    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      prods = prods.filter(p =>
        p.name.mr.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return prods;
  });

  handleSearchEnter(): void {
    const list = this.filteredProducts();
    if (list.length === 1) {
      this.addToCart(list[0]);
      this.searchQuery.set('');
    }
  }

  addToCart(product: Product): void {
    const res = this.cartService.addItem(product, 1);
    if (res.success) {
      this.toastService.success(`+ "${product.name.mr}"`);
    }
  }

  handleQtyChange(productId: string, val: any): void {
    const qty = parseInt(val, 10);
    if (!isNaN(qty)) {
      this.cartService.updateQuantity(productId, qty);
    }
  }

  confirmClearCart(): void {
    if (confirm('चालू कार्ट रिकामी करायची आहे का?')) {
      this.cartService.clearCart();
      this.toastService.info('कार्ट रिकामी केली.');
    }
  }

  openItemDiscountPrompt(item: PosCartItem): void {
    const role = this.authService.userRole();
    const input = prompt(
      `"${item.name.mr}" साठी सवलत प्रविष्ट करा:\nटक्केवारीसाठी '%' लावा (उदा. 10%) किंवा रोख रक्कम (उदा. 50):`,
      item.manualDiscount ? `${item.manualDiscount.value}${item.manualDiscount.type === 'percentage' ? '%' : ''}` : ''
    );
    if (input === null) return;
    if (input.trim() === '' || input.trim() === '0') {
      this.cartService.setItemDiscount(item.productId, undefined);
      return;
    }
    const isPct = input.includes('%');
    const val = parseFloat(input.replace('%', '').trim());
    if (isNaN(val) || val <= 0) {
      this.toastService.warning('अवैध सवलत मूल्य');
      return;
    }

    // Role limits check
    const maxAllowedPct = role === 'super_admin' ? 100 : (role === 'admin' ? 25 : 10);
    if (isPct && val > maxAllowedPct) {
      this.toastService.error(`कॅशियर मर्यादा: कमाल ${maxAllowedPct}% सवलत अनुज्ञेय आहे!`);
      return;
    }

    this.cartService.setItemDiscount(item.productId, {
      type: isPct ? 'percentage' : 'fixed',
      value: val
    });
    this.toastService.success('सवलत लागू केली!');
  }

  openBillDiscountPrompt(): void {
    const role = this.authService.userRole();
    const input = prompt(
      `संपूर्ण बिलावर सवलत प्रविष्ट करा:\nटक्केवारीसाठी '%' लावा (उदा. 5%) किंवा रोख रक्कम (उदा. 200):`
    );
    if (input === null) return;
    if (input.trim() === '') {
      this.cartService.setBillDiscount(null);
      return;
    }
    const isPct = input.includes('%');
    const val = parseFloat(input.replace('%', '').trim());
    if (isNaN(val) || val <= 0) {
      this.toastService.warning('अवैध सवलत मूल्य');
      return;
    }

    const maxAllowedPct = role === 'super_admin' ? 100 : (role === 'admin' ? 25 : 10);
    if (isPct && val > maxAllowedPct) {
      this.toastService.error(`कॅशियर मर्यादा: कमाल ${maxAllowedPct}% सवलत अनुज्ञेय आहे!`);
      return;
    }

    this.cartService.setBillDiscount({
      scope: 'bill',
      type: isPct ? 'percentage' : 'fixed',
      value: val,
      calculatedAmount: 0,
      reason: 'Manual Bill Discount'
    });
    this.toastService.success('बिल सवलत लागू केली!');
  }

  applyCoupon(): void {
    const code = this.couponCodeInput().trim();
    if (!code) return;
    const gross = this.cartService.totals().grossAmount;
    const res = this.offerService.validateCoupon(code, gross);
    if (!res.valid || !res.offer) {
      this.toastService.warning(res.message);
      return;
    }
    const applyRes = this.cartService.applyOffer(res.offer);
    if (applyRes.success) {
      this.toastService.success(applyRes.message);
      this.couponCodeInput.set('');
    } else {
      this.toastService.warning(applyRes.message);
    }
  }

  finalizeSale(): void {
    if (this.cartService.isEmpty()) {
      this.toastService.warning('कार्ट रिकामी आहे!');
      return;
    }

    const calc = this.cartService.totals();
    const customer = this.cartService.customer();
    const paymentMethod = this.cartService.paymentMethod();
    const amountReceived = this.cartService.amountReceived();

    this.isFinalizing.set(true);

    const result = this.invoiceService.finalizeSale({
      calc,
      customer,
      paymentMethod,
      amountReceived,
      notes: customer.notes
    });

    this.isFinalizing.set(false);

    if (result.success && result.invoice) {
      this.toastService.success(`बिल #${result.invoice.invoiceNumber} यशस्वीरित्या तयार झाले!`);
      this.cartService.clearCart();
      this.activeInvoice.set(result.invoice);
    } else {
      this.toastService.error(result.message || 'बिल तयार करताना त्रुटी आली.');
    }
  }

  closeInvoiceModal(): void {
    this.activeInvoice.set(null);
    if (this.searchInputRef) {
      setTimeout(() => this.searchInputRef.nativeElement.focus(), 100);
    }
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400';
  }
}
