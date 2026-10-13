import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { InquiryService } from '@core/services/inquiry.service';
import { ToastService } from '@core/services/toast.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Inquiry, InquiryItem } from '@core/models';

@Component({
  selector: 'app-inquiry',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe],
  template: `
    <div class="py-12 bg-[#FAF9FF] min-h-screen">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <!-- Header -->
        <div class="text-center space-y-3">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            📋 परवानाधारक दुकान भेट व साठा चौकशी
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {{ 'inquiry.pageTitle' | translate }}
          </h1>
          <p class="text-sm text-slate-500 max-w-xl mx-auto">
            {{ 'inquiry.pageSubtitle' | translate }}
          </p>
        </div>

        <!-- Success Modal / State -->
        @if (submittedInquiry(); as inq) {
          <div class="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-10 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
            <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
              ✨
            </div>

            <div class="text-center space-y-2">
              <h2 class="text-2xl font-black text-slate-900 font-serif">
                {{ 'inquiry.successTitle' | translate }}
              </h2>
              <p class="text-sm text-slate-500">
                आमचे प्रतिनिधी आपल्या दिलेल्या नंबरवर दुकानातील उपलब्धतेबद्दल लवकरच संपर्क करतील.
              </p>
            </div>

            <div class="p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-center space-y-2">
              <span class="text-xs text-emerald-800 font-medium uppercase tracking-wider block">
                {{ 'inquiry.successRef' | translate }}
              </span>
              <div class="text-2xl sm:text-3xl font-black text-emerald-950 font-mono tracking-wider">
                {{ inq.inquiryNumber }}
              </div>
              <p class="text-xs text-emerald-700">
                कृपया दुकानात भेट दिल्यावर हा क्रमांक दाखवा.
              </p>
            </div>

            <!-- WhatsApp Direct Button -->
            <div class="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                [href]="getWhatsAppUrl(inq)"
                target="_blank"
                rel="noopener noreferrer"
                class="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>💬</span>
                <span>{{ 'inquiry.whatsappDirect' | translate }}</span>
              </a>

              <button
                type="button"
                (click)="resetForm()"
                class="px-6 py-3.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-sm transition-all"
              >
                नवीन चौकशी करा
              </button>
            </div>

            <!-- Compliance reminder -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
              ⚖️ ही चौकशी ऑनलाइन खरेदी किंवा डिलिव्हरी आरक्षण नाही. खरेदीसाठी प्रत्यक्ष दुकान भेट आवश्यक आहे.
            </div>
          </div>
        } @else {
          
          <!-- Inquiry Form Card -->
          <div class="bg-white rounded-3xl border border-purple-100 p-6 sm:p-10 shadow-sm space-y-8">
            
            <!-- Statutory Warning Banner -->
            <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <span class="text-xl">⚖️</span>
              <div class="leading-relaxed">
                <strong>वैधानिक सूचना:</strong> भारतीय सर्वोच्च न्यायालयाच्या नियमांनुसार फटाक्यांची कोणतीही ऑनलाइन खरेदी, पेमेंट किंवा होम डिलिव्हरी उपलब्ध नाही. ही चौकशी केवळ आमच्या लक्ष्मी रोड, पुणे येथील अधिकृत दुकानात प्रत्यक्ष खरेदीसाठी आहे.
              </div>
            </div>

            <form [formGroup]="inquiryForm" (ngSubmit)="onSubmit()" class="space-y-6">
              
              <!-- Customer Name & Phone -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {{ 'inquiry.nameLabel' | translate }} *
                  </label>
                  <input
                    type="text"
                    formControlName="customerName"
                    placeholder="उदा. राजेश कुलकर्णी"
                    class="w-full px-4 py-3 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/20"
                    [class.border-rose-400]="isFieldInvalid('customerName')"
                  />
                  @if (isFieldInvalid('customerName')) {
                    <p class="text-[11px] text-rose-600 mt-1">कृपया आपले नाव प्रविष्ट करा.</p>
                  }
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {{ 'inquiry.phoneLabel' | translate }} *
                  </label>
                  <input
                    type="tel"
                    formControlName="phone"
                    placeholder="उदा. 9822012345"
                    class="w-full px-4 py-3 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/20"
                    [class.border-rose-400]="isFieldInvalid('phone')"
                  />
                  @if (isFieldInvalid('phone')) {
                    <p class="text-[11px] text-rose-600 mt-1">वैध १० अंकी मोबाईल नंबर प्रविष्ट करा.</p>
                  }
                </div>
              </div>

              <!-- Email & Product Selection -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {{ 'inquiry.emailLabel' | translate }}
                  </label>
                  <input
                    type="email"
                    formControlName="email"
                    placeholder="उदा. rajesh@example.com"
                    class="w-full px-4 py-3 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/20"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {{ 'inquiry.productLabel' | translate }} *
                  </label>
                  <select
                    formControlName="selectedProductId"
                    class="w-full px-4 py-3 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                  >
                    <option value="">-- फटाके निवडा --</option>
                    @for (p of productService.activeProducts(); track p.id) {
                      <option [value]="p.id">
                        {{ p.name.mr }} (₹{{ p.retailPrice }})
                      </option>
                    }
                  </select>
                </div>
              </div>

              <!-- Quantity & Message -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="sm:col-span-1">
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {{ 'inquiry.quantityLabel' | translate }} *
                  </label>
                  <input
                    type="number"
                    formControlName="quantity"
                    min="1"
                    class="w-full px-4 py-3 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/20"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {{ 'inquiry.messageLabel' | translate }}
                  </label>
                  <input
                    type="text"
                    formControlName="message"
                    placeholder="उदा. कधी भेट देऊ शकेन किंवा विशिष्ट सवलत"
                    class="w-full px-4 py-3 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/20"
                  />
                </div>
              </div>

              <!-- Mandatory Nonbinding Consent Checkbox -->
              <div class="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    formControlName="consent"
                    class="mt-1 rounded text-purple-600 focus:ring-purple-500 w-5 h-5 border-purple-300"
                  />
                  <span class="text-xs text-slate-700 leading-relaxed font-medium">
                    {{ 'inquiry.consentLabel' | translate }}
                  </span>
                </label>
                @if (isFieldInvalid('consent')) {
                  <p class="text-[11px] text-rose-600 mt-2 font-bold">
                    ⚠️ पुढे जाण्यासाठी कायदेशीर संमती देणे अनिवार्य आहे.
                  </p>
                }
              </div>

              <!-- Submit Button -->
              <div class="pt-4">
                <button
                  type="submit"
                  [disabled]="inquiryForm.invalid || isSubmitting()"
                  class="w-full py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-800 hover:to-indigo-700 shadow-xl shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  @if (isSubmitting()) {
                    <span>लोड होत आहे...</span>
                  } @else {
                    <span>📋 {{ 'inquiry.submitButton' | translate }}</span>
                  }
                </button>
              </div>

            </form>
          </div>
        }

      </div>
    </div>
  `
})
export class InquiryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  productService = inject(ProductService);
  private inquiryService = inject(InquiryService);
  private toastService = inject(ToastService);

  isSubmitting = signal<boolean>(false);
  submittedInquiry = signal<Inquiry | null>(null);

  inquiryForm: FormGroup = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{10,15}$/)]],
    email: ['', [Validators.email]],
    selectedProductId: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    message: [''],
    consent: [false, [Validators.requiredTrue]]
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['productId']) {
        this.inquiryForm.patchValue({ selectedProductId: params['productId'] });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.inquiryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.inquiryForm.value;

    const selectedProduct = this.productService.getProductById(formVal.selectedProductId);
    const items: InquiryItem[] = selectedProduct
      ? [
          {
            productId: selectedProduct.id,
            productName: selectedProduct.name.mr,
            sku: selectedProduct.sku,
            quantity: Number(formVal.quantity),
            estimatedPrice: selectedProduct.retailPrice
          }
        ]
      : [];

    const result = this.inquiryService.submitInquiry({
      customerName: formVal.customerName,
      phone: formVal.phone,
      email: formVal.email || 'customer@inquiry.com',
      items,
      message: formVal.message,
      source: 'website_catalog'
    });

    this.submittedInquiry.set(result);
    this.isSubmitting.set(false);
    this.toastService.success(`चौकशी संदर्भ क्रमांक: ${result.inquiryNumber}`);
  }

  getWhatsAppUrl(inq: Inquiry): string {
    return this.inquiryService.generateWhatsAppUrl(inq);
  }

  resetForm(): void {
    this.submittedInquiry.set(null);
    this.inquiryForm.reset({
      quantity: 1,
      consent: false
    });
  }
}
