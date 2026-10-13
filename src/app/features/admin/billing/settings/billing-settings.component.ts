import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillingSettings } from '@core/models';
import { InvoiceService } from '@core/services/invoice.service';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-billing-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6 lg:p-8 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif flex items-center gap-2">
            <span>⚙️</span>
            <span>बिलिंग व पावती कॉन्फिगरेशन (Billing Settings)</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            इनव्हॉइस अनुक्रमांक, जीएसटी दर, सवलत मर्यादा आणि प्रिंटर पर्याय
          </p>
        </div>

        <button
          type="button"
          (click)="saveSettings()"
          [disabled]="!authService.isAdmin()"
          class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40"
        >
          बदल जतन करा (Save Changes)
        </button>
      </div>

      <!-- Settings Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        
        <!-- 1. Invoice Numbering & Financial Year -->
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 class="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <span>🔢</span> इनव्हॉइस नंबरिंग व आर्थिक वर्ष
          </h3>

          <div class="space-y-3">
            <div>
              <label class="block font-semibold text-slate-400 mb-1">इनव्हॉइस प्रिफिक्स (Prefix)</label>
              <input
                type="text"
                [(ngModel)]="settings.invoicePrefix"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase focus:outline-none focus:border-purple-500"
              />
              <p class="text-[10px] text-slate-500 mt-1">उदा. PP ➔ PP-2026-000001</p>
            </div>

            <div>
              <label class="block font-semibold text-slate-400 mb-1">आर्थिक वर्ष (Financial Year)</label>
              <input
                type="text"
                [(ngModel)]="settings.financialYear"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-400 mb-1">डीफॉल्ट पावती फॉरमॅट (Default Layout)</label>
              <select
                [(ngModel)]="settings.defaultReceiptLayout"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="a4">A4 पूर्ण इनव्हॉइस (A4 Tax Invoice)</option>
                <option value="thermal_80mm">८०मिमी थर्मल पावती (80mm POS Receipt)</option>
                <option value="thermal_58mm">५८मिमी मिनी थर्मल पावती (58mm POS Receipt)</option>
                <option value="whatsapp">व्हॉट्सॲप डिजिटल कार्ड (WhatsApp Card)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 2. Tax Configuration -->
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 class="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <span>🏛️</span> जीएसटी कर व किंमत नियम (GST & Pricing)
          </h3>

          <div class="space-y-3">
            <div>
              <label class="block font-semibold text-slate-400 mb-1">किंमत कर धोरण (Tax Policy)</label>
              <select
                [(ngModel)]="settings.taxPolicy"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="inclusive">कर समाविष्ट (Tax Inclusive - MRP मध्ये GST समाविष्ट)</option>
                <option value="exclusive">कर अतिरिक्त (Tax Exclusive - बिलावर GST स्वतंत्रपणे)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-400 mb-1">प्रमाणित GST दर (%)</label>
              <input
                type="number"
                [(ngModel)]="settings.standardGstRate"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
              />
              <p class="text-[10px] text-slate-500 mt-1">फटाक्यांसाठी साधारणतः १८% GST (९% CGST + ९% SGST) लागू असतो.</p>
            </div>
          </div>
        </div>

        <!-- 3. Discount Permission Limits -->
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 class="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <span>🔒</span> कर्मचारी सवलत मर्यादा (Discount Ceilings)
          </h3>

          <div class="space-y-3">
            <div>
              <label class="block font-semibold text-slate-400 mb-1">काउंटर स्टाफ कमाल सवलत मर्यादा (%)</label>
              <input
                type="number"
                [(ngModel)]="settings.staffDiscountLimitPercent"
                max="100"
                min="0"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
              />
              <p class="text-[10px] text-slate-500 mt-1">कॅशियर स्वतःहून कमाल या मर्यादेपर्यंत सवलत देऊ शकतात.</p>
            </div>

            <div>
              <label class="block font-semibold text-slate-400 mb-1">स्टोअर मॅनेजर कमाल सवलत मर्यादा (%)</label>
              <input
                type="number"
                [(ngModel)]="settings.managerDiscountLimitPercent"
                max="100"
                min="0"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <!-- 4. Receipt Messages -->
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 class="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <span>📜</span> पावती संदेश व वैधानिक सूचना (Disclaimers)
          </h3>

          <div class="space-y-3">
            <div>
              <label class="block font-semibold text-slate-400 mb-1">पावती आभार संदेश (मराठी)</label>
              <textarea
                rows="2"
                [(ngModel)]="settings.footerMessageMarathi"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-400 mb-1">सुरक्षा सूचना (मराठी)</label>
              <textarea
                rows="2"
                [(ngModel)]="settings.safetyNoticeMarathi"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class BillingSettingsComponent {
  invoiceService = inject(InvoiceService);
  authService = inject(AuthService);
  toastService = inject(ToastService);

  settings: BillingSettings = { ...this.invoiceService.billingSettings() };

  saveSettings(): void {
    if (!this.authService.isAdmin()) {
      this.toastService.error('केवळ व्यवस्थापकांना (Admin) सेटिंग्ज बदलण्याची परवानगी आहे.');
      return;
    }
    this.invoiceService.updateBillingSettings(this.settings);
    this.toastService.success('बिलिंग सेटिंग्ज यशस्वीरित्या जतन केल्या!');
  }
}
