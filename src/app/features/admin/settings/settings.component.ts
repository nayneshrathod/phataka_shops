import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreSettingsService } from '@core/services/store-settings.service';
import { ProductService } from '@core/services/product.service';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 lg:p-8 space-y-8">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif">
            दुकान व कायदेशीर सेटिंग्ज (Store Settings & Compliance)
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            व्यवसाय माहिती, संपर्क क्रमांक, परवाना तपशील आणि वैधानिक सूचना
          </p>
        </div>

        @if (authService.isSuperAdmin()) {
          <button
            type="button"
            (click)="resetDemoData()"
            class="px-4 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-bold transition-colors flex items-center gap-2"
          >
            <span>🔄</span> चाचणी डेटा पूर्ववत करा (Reset Demo Data)
          </button>
        }
      </div>

      <!-- Settings Form -->
      <div class="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <form [formGroup]="settingsForm" (ngSubmit)="saveSettings()" class="space-y-6">
          
          <div class="border-b border-slate-800 pb-3">
            <h3 class="text-sm font-bold text-white font-serif">
              दुकान ओळख व संपर्क (Business Identity)
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                दुकानाचे नाव (मराठी) *
              </label>
              <input
                type="text"
                formControlName="businessNameMarathi"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Business Name (English) *
              </label>
              <input
                type="text"
                formControlName="businessName"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                फोन संपर्क क्रमांक *
              </label>
              <input
                type="text"
                formControlName="contactNumber"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                WhatsApp नंबर *
              </label>
              <input
                type="text"
                formControlName="whatsappNumber"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                ईमेल पत्ता
              </label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                दुकानाचा पूर्ण पत्ता *
              </label>
              <textarea
                formControlName="address"
                rows="2"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                कामकाजाची वेळ (Working Hours) *
              </label>
              <input
                type="text"
                formControlName="workingHours"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div class="border-b border-slate-800 pb-3 pt-4">
            <h3 class="text-sm font-bold text-white font-serif">
              कायदेशीर परवाना व नोंदणी (Regulatory & Compliance)
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                PESO परवाना क्रमांक *
              </label>
              <input
                type="text"
                formControlName="licenseNumber"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                GSTIN नोंदणी क्रमांक
              </label>
              <input
                type="text"
                formControlName="gstin"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              वैधानिक इशारा व सूचना मजकूर (Statutory Disclosure)
            </label>
            <textarea
              formControlName="statutoryNoticeMarathi"
              rows="3"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
            ></textarea>
          </div>

          <div class="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              [disabled]="settingsForm.invalid"
              class="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              सेटिंग्ज जतन करा (Save Settings)
            </button>
          </div>

        </form>
      </div>

    </div>
  `
})
export class AdminSettingsComponent {
  private settingsService = inject(StoreSettingsService);
  private productService = inject(ProductService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  settingsForm: FormGroup = this.fb.group({
    businessName: [this.settingsService.settings().businessName, Validators.required],
    businessNameMarathi: [this.settingsService.settings().businessNameMarathi, Validators.required],
    contactNumber: [this.settingsService.settings().contactNumber, Validators.required],
    whatsappNumber: [this.settingsService.settings().whatsappNumber, Validators.required],
    email: [this.settingsService.settings().email, [Validators.required, Validators.email]],
    address: [this.settingsService.settings().address, Validators.required],
    workingHours: [this.settingsService.settings().workingHours, Validators.required],
    licenseNumber: [this.settingsService.settings().licenseNumber, Validators.required],
    gstin: [this.settingsService.settings().gstin, Validators.required],
    statutoryNoticeMarathi: [this.settingsService.settings().statutoryNoticeMarathi, Validators.required]
  });

  saveSettings(): void {
    if (this.settingsForm.invalid) return;
    this.settingsService.updateSettings(this.settingsForm.value);
    this.toastService.success('दुकान सेटिंग्ज यशस्वीरित्या जतन केल्या!');
  }

  resetDemoData(): void {
    if (confirm('तुम्हाला नक्की सर्व कॅटलॉग, प्रकार व सेटिंग्ज पूर्ववत (Reset to Demo) करायच्या आहेत का?')) {
      this.productService.resetToDemoData();
      this.settingsService.resetToDefault();
      this.settingsForm.patchValue(this.settingsService.settings());
      this.toastService.success('सर्व डेटा पूर्ववत केला गेला!');
    }
  }
}
