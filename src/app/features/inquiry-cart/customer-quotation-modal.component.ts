import { Component, ElementRef, ViewChild, input, output, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CartItem } from '@core/models';
import { StoreSettingsService } from '@core/services/store-settings.service';
import { BillExportService } from '@core/services/bill-export.service';
import { ToastService } from '@core/services/toast.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-customer-quotation-modal',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print-bill-backdrop print:p-0 print:bg-white print:static">
      <div class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print-bill-modal print:max-h-none print:shadow-none print:rounded-none">
        
        <!-- Top Toolbar (Hidden during Print) -->
        <div class="p-3.5 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div class="flex items-center gap-2">
            <span class="text-xl">🧾</span>
            <div>
              <h3 class="font-bold text-sm">
                {{ 'quote.title' | translate }}
              </h3>
              <p class="text-[11px] text-slate-400">
                {{ 'quote.number' | translate }} {{ quoteNumber }} • {{ 'quote.tableTotal' | translate }}: ₹{{ totalAmount().toLocaleString('en-IN') }}
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons & Direct WhatsApp Input -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Direct Mobile WhatsApp Input -->
            <div class="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
              <span class="text-slate-400 font-mono font-bold">📱 +91</span>
              <input
                type="tel"
                [value]="editablePhone()"
                (input)="onPhoneInput($event)"
                placeholder="मोबाईल नंबर"
                class="bg-transparent text-white font-mono text-xs w-24 sm:w-28 outline-none placeholder:text-slate-500"
                title="व्हॉट्सॲपसाठी ग्राहकाचा मोबाईल नंबर"
              />
            </div>

            <!-- Direct Customer WhatsApp Button -->
            <button
              type="button"
              (click)="shareToCustomerWhatsApp()"
              class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              [title]="'थेट ग्राहकाच्या WhatsApp वर पाठवा'"
            >
              <span>📱</span>
              <span>{{ 'cart.shareCustomerWhatsApp' | translate }}</span>
            </button>

            <!-- Store WhatsApp Button -->
            <button
              type="button"
              (click)="shareToStoreWhatsApp()"
              class="px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              [title]="'दुकानदाराच्या WhatsApp वर पाठवा'"
            >
              <span>🏪</span>
              <span>{{ 'cart.shareStoreWhatsApp' | translate }}</span>
            </button>

            <!-- Print Button -->
            <button
              type="button"
              (click)="printBill()"
              class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              [title]="'cart.printBill' | translate"
            >
              <span>🖨️</span>
              <span>{{ 'cart.printBill' | translate }}</span>
            </button>

            <!-- PDF Download -->
            <button
              type="button"
              (click)="downloadPdf()"
              [disabled]="isExporting()"
              class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              [title]="'cart.downloadPdf' | translate"
            >
              <span>📥</span>
              <span>{{ isExporting() ? ('common.loading' | translate) : ('cart.downloadPdf' | translate) }}</span>
            </button>

            <!-- Image Download -->
            <button
              type="button"
              (click)="downloadImage()"
              [disabled]="isExporting()"
              class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              [title]="'cart.downloadPng' | translate"
            >
              <span>🖼️</span>
              <span>{{ 'cart.downloadPng' | translate }}</span>
            </button>

            <!-- Close Modal -->
            <button
              type="button"
              (click)="close.emit()"
              class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors ml-1 cursor-pointer"
              [title]="'cart.close' | translate"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Scrollable Bill Canvas Container -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white">
          
          <!-- Printable Estimate Canvas Target -->
          <div
            #quotationCanvas
            class="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 space-y-6 text-slate-900 text-xs print-bill-canvas"
          >
            
            <!-- 1. Store Header -->
            <div class="flex justify-between items-start border-b-2 border-purple-900 pb-5 avoid-break">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-black text-purple-950 font-serif">{{ 'brand.name' | translate }}</span>
                  <span class="text-xs font-bold text-purple-700 font-mono tracking-wider">PRATIK PHATAKE</span>
                </div>
                <p class="text-[11px] text-slate-600 font-medium">{{ 'brand.subtitle' | translate }}</p>
                <p class="text-[11px] text-slate-600">{{ storeSettings.settings().address }}</p>
                <p class="text-[11px] text-slate-600">
                  📞 {{ 'cart.callStore' | translate }} {{ storeSettings.settings().contactNumber }} • ✉️ {{ storeSettings.settings().email }}
                </p>
                <div class="pt-1 flex flex-wrap gap-2 text-[10px] font-bold">
                  <span class="bg-purple-50 text-purple-900 px-2 py-0.5 rounded border border-purple-200 font-mono">
                    GSTIN: {{ storeSettings.settings().gstin }}
                  </span>
                  <span class="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                    {{ 'legal.pesoCertified' | translate }}: {{ storeSettings.settings().licenseNumber }}
                  </span>
                </div>
              </div>

              <!-- Estimate Badge & Reference Info -->
              <div class="text-right space-y-1">
                <div class="inline-block px-3 py-1 rounded-lg bg-purple-950 text-white font-black text-xs uppercase tracking-wider">
                  {{ 'quote.title' | translate }}
                </div>
                <div class="text-sm font-black text-purple-900 font-mono">
                  {{ quoteNumber }}
                </div>
                <div class="text-[11px] text-slate-500">
                  {{ 'quote.date' | translate }} {{ currentDate | date:'dd/MM/yyyy, hh:mm a' }}
                </div>
                <div class="text-[11px] font-semibold text-emerald-700">
                  {{ 'quote.type' | translate }}
                </div>
              </div>
            </div>

            <!-- 2. Customer Information Block -->
            <div class="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 flex flex-wrap justify-between gap-4 text-xs avoid-break">
              <div class="space-y-0.5">
                <span class="text-[10px] font-bold uppercase tracking-wider text-purple-800">{{ 'quote.customerDetails' | translate }}</span>
                <p class="font-bold text-slate-900 text-sm">
                  {{ customerName() || ('quote.customerDetails' | translate) }}
                </p>
                @if (editablePhone() || customerPhone()) {
                  <p class="text-slate-600 font-mono">📱 {{ 'cart.customerPhone' | translate }}: {{ editablePhone() || customerPhone() }}</p>
                }
                @if (customerCity()) {
                  <p class="text-slate-600">📍 {{ 'cart.customerCity' | translate }}: {{ customerCity() }}</p>
                }
              </div>

              <div class="text-right space-y-0.5">
                <span class="text-[10px] font-bold uppercase tracking-wider text-purple-800">{{ 'quote.storeNote' | translate }}</span>
                <p class="text-slate-700 font-medium max-w-xs truncate">
                  {{ customerNotes() || ('brand.tagline' | translate) }}
                </p>
                <p class="text-[10px] text-slate-500 italic">
                  * {{ 'cart.noteDisclaimer' | translate }}
                </p>
              </div>
            </div>

            <!-- 3. Selected Items Table (Responsive container with compact rows for maximum items) -->
            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left border-collapse min-w-[520px] sm:min-w-0">
                <thead>
                  <tr class="bg-slate-100 text-[11px] font-bold text-slate-700 border-b border-slate-200">
                    <th class="py-2 px-2 text-center w-10">{{ 'quote.tableSr' | translate }}</th>
                    <th class="py-2 px-2.5">{{ 'quote.tableItem' | translate }}</th>
                    <th class="py-2 px-2 text-center w-16">{{ 'quote.tableQty' | translate }}</th>
                    <th class="py-2 px-2 text-right w-24">{{ 'quote.tableRate' | translate }}</th>
                    <th class="py-2 px-2 text-right w-28">{{ 'quote.tableTotal' | translate }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs">
                  @for (item of items(); track item.productId; let idx = $index) {
                    <tr class="hover:bg-slate-50">
                      <td class="py-1.5 px-2 text-center font-mono text-slate-400 text-[11px]">{{ idx + 1 }}</td>
                      <td class="py-1.5 px-2.5 space-y-0.5">
                        <div class="font-bold text-slate-900 text-xs leading-snug">{{ item.name[translationService.currentLang()] || item.name.mr }}</div>
                        <div class="text-[10px] text-slate-500 font-mono">
                          SKU: {{ item.sku }} {{ item.categoryName ? '• ' + item.categoryName : '' }}
                        </div>
                      </td>
                      <td class="py-1.5 px-2 text-center font-bold font-mono text-slate-900 text-xs">{{ item.quantity }}</td>
                      <td class="py-1.5 px-2 text-right font-mono text-slate-700 text-xs">₹{{ item.indicativeUnitPrice.toFixed(2) }}</td>
                      <td class="py-1.5 px-2 text-right font-black font-mono text-slate-900 text-xs">
                        ₹{{ (item.quantity * item.indicativeUnitPrice).toFixed(2) }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- 4. Totals & Financial Summary -->
            <div class="flex justify-between items-start gap-4 pt-2 avoid-break">
              <div class="max-w-xs space-y-1 text-[11px] text-slate-500">
                <p><strong>{{ 'quote.totalItems' | translate }}</strong> {{ items().length }}</p>
                <p><strong>{{ 'quote.totalPieces' | translate }}</strong> {{ totalPieces() }}</p>
                <div class="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-medium text-[10px]">
                  ✨ {{ 'quote.festivalOfferTip' | translate }}
                </div>
              </div>

              <!-- Grand Total Box -->
              <div class="w-64 bg-purple-50/70 p-4 rounded-xl border border-purple-200 space-y-2">
                <div class="flex justify-between text-slate-600 text-xs">
                  <span>{{ 'quote.subtotal' | translate }}</span>
                  <span class="font-mono font-bold">₹{{ totalAmount().toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-emerald-700 text-xs font-semibold">
                  <span>{{ 'quote.estimatedOffer' | translate }}</span>
                  <span>{{ 'quote.applicable' | translate }}</span>
                </div>
                <div class="border-t border-purple-200 pt-2 flex justify-between items-center text-sm">
                  <span class="font-black text-purple-950">{{ 'quote.grandEstimate' | translate }}</span>
                  <span class="text-lg font-black text-purple-950 font-mono">
                    ₹{{ totalAmount().toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 5. Legal Advisory & Compliance Terms -->
            <div class="border-t-2 border-dashed border-slate-300 pt-4 space-y-2 text-[10px] text-slate-600 avoid-break">
              <div class="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                <span>⚖️</span>
                <span>{{ 'quote.statutoryTitle' | translate }}</span>
              </div>
              <ul class="list-disc pl-4 space-y-1 leading-relaxed text-slate-600">
                <li>
                  {{ 'quote.rule1' | translate }}
                </li>
                <li>
                  {{ 'quote.rule2' | translate }}
                </li>
                <li>
                  {{ 'quote.rule3' | translate }}
                </li>
                <li>
                  {{ 'quote.rule4' | translate }}
                </li>
              </ul>
            </div>

            <!-- 6. Bottom Signatory Section -->
            <div class="flex justify-between items-end pt-4 border-t border-slate-200 text-slate-500 text-[10px] avoid-break">
              <div>
                <p>{{ 'quote.computerGenerated' | translate }}</p>
                <p class="font-mono text-[9px] text-slate-400">Printed: {{ currentDate | date:'yyyy-MM-dd HH:mm:ss' }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-slate-800 font-serif text-xs">{{ 'quote.forStore' | translate }}</p>
                <p class="text-[9px] text-purple-700 font-semibold">{{ 'quote.authorizedRep' | translate }}</p>
              </div>
            </div>

          </div>

        </div>

        <!-- Modal Footer Actions (Mobile & Bottom) -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p class="text-xs text-slate-500">
            {{ 'quote.bringReceipt' | translate }}
          </p>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              (click)="printBill()"
              class="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>🖨️</span>
              <span>{{ 'cart.printBill' | translate }}</span>
            </button>
            <button
              type="button"
              (click)="shareToCustomerWhatsApp()"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              [title]="'थेट ग्राहकाच्या WhatsApp वर पाठवा'"
            >
              <span>📱</span>
              <span>{{ 'cart.shareCustomerWhatsApp' | translate }}</span>
            </button>
            <button
              type="button"
              (click)="shareToStoreWhatsApp()"
              class="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-emerald-100 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              [title]="'दुकानदाराच्या WhatsApp वर पाठवा'"
            >
              <span>🏪</span>
              <span>{{ 'cart.shareStoreWhatsApp' | translate }}</span>
            </button>
            <button
              type="button"
              (click)="close.emit()"
              class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              {{ 'cart.close' | translate }}
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CustomerQuotationModalComponent implements OnInit {
  items = input.required<CartItem[]>();
  customerName = input<string>('');
  customerPhone = input<string>('');
  customerCity = input<string>('');
  customerNotes = input<string>('');

  close = output<void>();

  @ViewChild('quotationCanvas') quotationCanvas!: ElementRef<HTMLElement>;

  storeSettings = inject(StoreSettingsService);
  translationService = inject(TranslationService);
  private billExport = inject(BillExportService);
  private toast = inject(ToastService);

  currentDate = new Date();
  quoteNumber = `EST-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  isExporting = signal<boolean>(false);
  editablePhone = signal<string>('');

  ngOnInit(): void {
    this.editablePhone.set(this.customerPhone() || '');
  }

  onPhoneInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.editablePhone.set(inputEl.value);
  }

  totalPieces(): number {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  }

  totalAmount(): number {
    return this.items().reduce((sum, item) => sum + (item.quantity * item.indicativeUnitPrice), 0);
  }

  printBill(): void {
    window.print();
  }

  async downloadPdf(): Promise<void> {
    if (!this.quotationCanvas?.nativeElement) return;
    this.isExporting.set(true);
    try {
      await this.billExport.downloadPdf(this.quotationCanvas.nativeElement, `Pratik-Phatake-${this.quoteNumber}`);
      this.toast.success(
        this.translationService.currentLang() === 'en'
          ? 'Quotation bill PDF downloaded successfully!'
          : this.translationService.currentLang() === 'hi'
            ? 'अनुमानित बिल PDF डाउनलोड सफल!'
            : 'अंदाजे बिल PDF डाऊनलोड यशस्वी!'
      );
    } catch {
      this.toast.error(
        this.translationService.currentLang() === 'en'
          ? 'Failed to generate PDF. Please use the Print option.'
          : this.translationService.currentLang() === 'hi'
            ? 'PDF तैयार करते समय त्रुटि आई। कृपया प्रिंट विकल्प का उपयोग करें।'
            : 'PDF तयार करताना त्रुटी आली. कृपया प्रिंट पर्याय वापरा.'
      );
    } finally {
      this.isExporting.set(false);
    }
  }

  async downloadImage(): Promise<void> {
    if (!this.quotationCanvas?.nativeElement) return;
    this.isExporting.set(true);
    try {
      const dataUrl = await this.billExport.exportToPng(this.quotationCanvas.nativeElement);
      this.billExport.downloadDataUrl(dataUrl, `Pratik-Phatake-${this.quoteNumber}.png`);
      this.toast.success(
        this.translationService.currentLang() === 'en'
          ? 'Quotation PNG image downloaded successfully!'
          : this.translationService.currentLang() === 'hi'
            ? 'अनुमानित बिल इमेज (PNG) डाउनलोड हो गई!'
            : 'अंदाजे बिल इमेज (PNG) डाऊनलोड झाली!'
      );
    } catch {
      this.toast.error(
        this.translationService.currentLang() === 'en'
          ? 'Error generating image.'
          : this.translationService.currentLang() === 'hi'
            ? 'इमेज तैयार करते समय त्रुटि आई।'
            : 'इमेज तयार करताना त्रुटी आली.'
      );
    } finally {
      this.isExporting.set(false);
    }
  }

  buildWhatsAppText(): string {
    const lang = this.translationService.currentLang();
    const defaultCust = lang === 'en' ? 'Respected Customer' : lang === 'hi' ? 'सम्माननीय ग्राहक' : 'सन्माननीय ग्राहक';
    const name = this.customerName() || defaultCust;
    const phone = this.editablePhone() || this.customerPhone();
    const total = this.totalAmount().toLocaleString('en-IN');
    const count = this.items().length;
    const pieces = this.totalPieces();

    let itemsSummary = '';
    this.items().forEach((item, i) => {
      const itemName = item.name[lang] || item.name.mr;
      itemsSummary += `${i + 1}. ${itemName} x ${item.quantity} = ₹${(item.quantity * item.indicativeUnitPrice).toFixed(2)}\n`;
    });

    let title = '*प्रतीक फटाके — ग्राहक अंदाजे बिल / कोटेशन पावती*';
    let quoteNoLbl = 'पावती क्र';
    let dateLbl = 'दिनांक';
    let custLbl = 'ग्राहक';
    let areaLbl = 'परिसर';
    let selLbl = 'निवडलेले फटाके';
    let typeUnitLbl = 'प्रकार';
    let pieceUnitLbl = 'नग';
    let totalLbl = 'अंदाजे एकूण रक्कम';
    let discl = 'टीप: सर्वोच्च न्यायालय व PESO मार्गदर्शक तत्त्वांनुसार ही केवळ अंदाजे नोंद पावती आहे. खरेदीसाठी दुकानाला प्रत्यक्ष भेट द्या.';
    let addrLbl = 'पत्ता';
    let phoneLbl = 'फोन';

    if (lang === 'hi') {
      title = '*प्रतीक पटाखे — ग्राहक अनुमानित बिल / कोटेशन रसीद*';
      quoteNoLbl = 'रसीद क्र';
      dateLbl = 'दिनांक';
      custLbl = 'ग्राहक';
      areaLbl = 'क्षेत्र';
      selLbl = 'चयनित पटाखे';
      typeUnitLbl = 'प्रकार';
      pieceUnitLbl = 'नग';
      totalLbl = 'अनुमानित कुल राशि';
      discl = 'नोट: सुप्रीम कोर्ट व PESO दिशानिर्देशों के अनुसार यह केवल अनुमानित कोटेशन है। पटाखों की खरीद के लिए कृपया दुकान पर पधारें।';
      addrLbl = 'पता';
      phoneLbl = 'फ़ोन';
    } else if (lang === 'en') {
      title = '*PRATIK PHATAKE — Customer Quotation / Estimate Receipt*';
      quoteNoLbl = 'Quote Ref';
      dateLbl = 'Date';
      custLbl = 'Customer';
      areaLbl = 'Area';
      selLbl = 'Selected Fireworks';
      typeUnitLbl = 'types';
      pieceUnitLbl = 'pcs';
      totalLbl = 'Estimated Total';
      discl = 'Note: Per Supreme Court & PESO guidelines, this is an indicative inquiry estimate only. Please visit our licensed store for direct counter purchase.';
      addrLbl = 'Address';
      phoneLbl = 'Phone';
    }

    return `${title}\n` +
      `${quoteNoLbl}: ${this.quoteNumber}\n` +
      `${dateLbl}: ${this.currentDate.toLocaleDateString('en-IN')}\n\n` +
      `*${custLbl}:* ${name} ${phone ? '(' + phone + ')' : ''}\n` +
      `${this.customerCity() ? areaLbl + ': ' + this.customerCity() + '\n' : ''}` +
      `--------------------------------\n` +
      `*${selLbl}:* (${count} ${typeUnitLbl}, ${pieces} ${pieceUnitLbl})\n` +
      `${itemsSummary}` +
      `--------------------------------\n` +
      `*${totalLbl}: ₹${total}*\n\n` +
      `_${discl}_\n` +
      `${addrLbl}: ${this.storeSettings.settings().address}\n` +
      `${phoneLbl}: ${this.storeSettings.settings().contactNumber}`;
  }

  async shareToCustomerWhatsApp(): Promise<void> {
    const raw = (this.editablePhone() || this.customerPhone() || '').replace(/\D/g, '').replace(/^0+/, '');
    if (!raw) {
      this.toast.warning(
        this.translationService.currentLang() === 'en'
          ? 'Please enter customer mobile number to send bill via WhatsApp.'
          : this.translationService.currentLang() === 'hi'
            ? 'व्हाट्सएप पर बिल भेजने के लिए कृपया ग्राहक का मोबाइल नंबर दर्ज करें।'
            : 'व्हॉट्सॲपवर बिल पाठवण्यासाठी कृपया ग्राहकाचा मोबाईल नंबर प्रविष्ट करा.'
      );
      return;
    }
    const intlPhone = raw.length === 10 ? `91${raw}` : raw;
    await this.openWhatsAppWithPhone(intlPhone, true);
  }

  async shareToStoreWhatsApp(): Promise<void> {
    const storePhone = this.storeSettings.settings().whatsappNumber.replace(/\D/g, '');
    await this.openWhatsAppWithPhone(storePhone, false);
  }

  shareWhatsApp(): void {
    const phone = this.editablePhone() || this.customerPhone();
    if (phone && phone.trim().length >= 10) {
      this.shareToCustomerWhatsApp();
    } else {
      this.shareToStoreWhatsApp();
    }
  }

  private async openWhatsAppWithPhone(phone: string, isCustomer: boolean): Promise<void> {
    const text = this.buildWhatsAppText();

    // Background bill PNG auto-download so user has the graphic invoice ready to attach
    if (this.quotationCanvas?.nativeElement) {
      try {
        const dataUrl = await this.billExport.exportToPng(this.quotationCanvas.nativeElement);
        this.billExport.downloadDataUrl(dataUrl, `Pratik-Phatake-${this.quoteNumber}.png`);
      } catch (err) {
        console.warn('Background receipt PNG capture skipped:', err);
      }
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    const lang = this.translationService.currentLang();
    if (isCustomer) {
      this.toast.success(
        lang === 'en'
          ? `Opening WhatsApp to customer (+${phone})...`
          : lang === 'hi'
            ? `ग्राहक (+${phone}) के व्हाट्सएप पर बिल भेजा जा रहा है...`
            : `ग्राहकाच्या (+${phone}) व्हॉट्सॲपवर थेट बिल पाठवले जात आहे...`
      );
    } else {
      this.toast.success(
        lang === 'en'
          ? 'Opening store WhatsApp inquiry...'
          : lang === 'hi'
            ? 'दुकानदार व्हाट्सएप पर पूछताछ खोली जा रही है...'
            : 'दुकानदाराच्या व्हॉट्सॲपवर चौकशी उघडली जात आहे...'
      );
    }
  }
}
