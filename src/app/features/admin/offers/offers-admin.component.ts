import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Offer, OfferType, DiscountType } from '@core/models';
import { OfferService } from '@core/services/offer.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-offers-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6 lg:p-8 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif flex items-center gap-2">
            <span>🎉</span>
            <span>सण ऑफर्स व कूपन व्यवस्थापन (Offers & Coupons)</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            काऊंटर बिलिंग व ग्राहक कॅटलॉगसाठी सवलत योजना, प्रोमो कोड व कूपन नियम
          </p>
        </div>

        <button
          type="button"
          (click)="showCreateModal.set(true)"
          class="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <span>➕</span> नवीन ऑफर तयार करा
        </button>
      </div>

      <!-- Offers Grid / Table -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (offer of offerService.offers(); track offer.id) {
          <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-800">
                  {{ offer.code }}
                </span>
                <button
                  type="button"
                  (click)="offerService.toggleOfferStatus(offer.id)"
                  [ngClass]="offer.active ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-500 border-slate-700'"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors"
                >
                  {{ offer.active ? '● सक्रीय (Active)' : '○ निष्क्रिय' }}
                </button>
              </div>

              <h3 class="font-bold text-sm text-white">
                {{ offer.title.mr }}
              </h3>
              <p class="text-xs text-slate-400 line-clamp-2">
                {{ offer.description.mr }}
              </p>
            </div>

            <div class="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
              <div class="flex justify-between text-slate-400">
                <span>सवलत मूल्य:</span>
                <span class="font-mono font-bold text-amber-400">
                  {{ offer.discountValue }}{{ offer.discountType === 'percentage' ? '%' : '₹' }}
                  @if (offer.maximumDiscount) {
                    <span class="text-[10px] text-slate-500">(कमाल ₹{{ offer.maximumDiscount }})</span>
                  }
                </span>
              </div>

              <div class="flex justify-between text-slate-400">
                <span>किमान बिल (Min Order):</span>
                <span class="font-mono text-white">₹{{ offer.minimumAmount }}</span>
              </div>

              <div class="flex justify-between text-slate-400 text-[11px]">
                <span>वापरलेली संख्या:</span>
                <span class="font-mono text-purple-300">
                  {{ offer.usageCount }} @if (offer.usageLimit) { / {{ offer.usageLimit }} }
                </span>
              </div>

              <div class="pt-2 flex items-center justify-between">
                <span class="text-[10px] text-slate-500">
                  {{ offer.stackingAllowed ? '✅ इतर सवलतींसोबत एकत्र अनुज्ञेय' : '⚠️ स्वतंत्र ऑफर' }}
                </span>
                <button
                  type="button"
                  (click)="confirmDelete(offer.id)"
                  class="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                >
                  काढा 🗑️
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Create Offer Modal -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 class="font-bold text-sm text-white">नवीन ऑफर / कूपन तयार करा</h3>
              <button
                type="button"
                (click)="showCreateModal.set(false)"
                class="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block font-semibold text-slate-300 mb-1">कूपन कोड (Coupon Code) *</label>
                <input
                  type="text"
                  [(ngModel)]="newOffer.code"
                  placeholder="उदा. DIWALI20"
                  class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white uppercase font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label class="block font-semibold text-slate-300 mb-1">शीर्षक (मराठी) *</label>
                <input
                  type="text"
                  [(ngModel)]="newOffer.title.mr"
                  placeholder="उदा. दिवाळी महा धमाका २०%"
                  class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label class="block font-semibold text-slate-300 mb-1">तपशील (मराठी)</label>
                <textarea
                  rows="2"
                  [(ngModel)]="newOffer.description.mr"
                  placeholder="उदा. ₹५,००० च्या पुढील खरेदीवर थेट २०% सवलत..."
                  class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-300 mb-1">ऑफर प्रकार</label>
                  <select
                    [(ngModel)]="newOffer.offerType"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="bill_discount">बिल सवलत (Bill Discount)</option>
                    <option value="coupon">कूपन कोड (Coupon Code)</option>
                    <option value="festival_special">सण विशेष (Festival Special)</option>
                  </select>
                </div>

                <div>
                  <label class="block font-semibold text-slate-300 mb-1">सवलत प्रकार</label>
                  <select
                    [(ngModel)]="newOffer.discountType"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="percentage">टक्केवारी (%)</option>
                    <option value="fixed">निश्चित रक्कम (₹)</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-300 mb-1">सवलत मूल्य *</label>
                  <input
                    type="number"
                    [(ngModel)]="newOffer.discountValue"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label class="block font-semibold text-slate-300 mb-1">किमान खरेदी (₹)</label>
                  <input
                    type="number"
                    [(ngModel)]="newOffer.minimumAmount"
                    class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div class="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="stacking"
                  [(ngModel)]="newOffer.stackingAllowed"
                  class="rounded text-purple-600 focus:ring-0"
                />
                <label for="stacking" class="text-slate-300 cursor-pointer">
                  इतर सवलतींसोबत एकत्र लागू करण्यास अनुमती द्या (Stacking Allowed)
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                (click)="showCreateModal.set(false)"
                class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                रद्द करा
              </button>
              <button
                type="button"
                (click)="submitCreateOffer()"
                class="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold"
              >
                ऑफर तयार करा
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class OffersAdminComponent {
  offerService = inject(OfferService);
  toastService = inject(ToastService);

  showCreateModal = signal<boolean>(false);

  newOffer = {
    code: '',
    title: { mr: '', hi: '', en: '' },
    description: { mr: '', hi: '', en: '' },
    offerType: 'bill_discount' as OfferType,
    discountType: 'percentage' as DiscountType,
    discountValue: 10,
    minimumAmount: 2000,
    maximumDiscount: 1000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    stackingAllowed: false,
    usageLimit: 500,
    active: true
  };

  confirmDelete(id: string): void {
    if (confirm('ही ऑफर कायमची हटवायची आहे का?')) {
      this.offerService.deleteOffer(id);
      this.toastService.info('ऑफर हटवली गेली.');
    }
  }

  submitCreateOffer(): void {
    if (!this.newOffer.code.trim() || !this.newOffer.title.mr.trim()) {
      this.toastService.warning('कृपया कोड आणि शीर्षक भरा.');
      return;
    }

    this.offerService.createOffer({
      code: this.newOffer.code.trim().toUpperCase(),
      title: {
        mr: this.newOffer.title.mr,
        hi: this.newOffer.title.mr,
        en: this.newOffer.title.mr
      },
      description: {
        mr: this.newOffer.description.mr,
        hi: this.newOffer.description.mr,
        en: this.newOffer.description.mr
      },
      offerType: this.newOffer.offerType,
      discountType: this.newOffer.discountType,
      discountValue: this.newOffer.discountValue,
      minimumAmount: this.newOffer.minimumAmount,
      maximumDiscount: this.newOffer.maximumDiscount,
      startDate: this.newOffer.startDate,
      endDate: this.newOffer.endDate,
      stackingAllowed: this.newOffer.stackingAllowed,
      usageLimit: this.newOffer.usageLimit,
      active: true
    });

    this.toastService.success('नवीन ऑफर यशस्वीरित्या तयार झाली!');
    this.showCreateModal.set(false);
  }
}
