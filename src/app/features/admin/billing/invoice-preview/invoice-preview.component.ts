import { Component, ElementRef, ViewChild, input, output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice } from '@core/models';
import { BillExportService } from '@core/services/bill-export.service';
import { WhatsAppShareService } from '@core/services/whatsapp-share.service';
import { StoreSettingsService } from '@core/services/store-settings.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print-bill-backdrop print:p-0 print:bg-white print:static">
      <div class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print-bill-modal print:max-h-none print:shadow-none print:rounded-none">
        
        <!-- Modal Top Bar (Hidden in Print) -->
        <div class="p-3.5 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div class="flex items-center gap-2">
            <span class="text-xl">🧾</span>
            <div>
              <h3 class="font-bold text-sm">
                बिल पावती: {{ invoice().invoiceNumber }}
              </h3>
              <p class="text-[11px] text-slate-400">
                ग्राहक: {{ invoice().customerSnapshot.name }} • एकूण: ₹{{ invoice().grandTotal }}
              </p>
            </div>
          </div>

          <!-- Layout Switcher Tabs -->
          <div class="flex items-center bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              (click)="activeLayout.set('a4')"
              [ngClass]="activeLayout() === 'a4' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              📄 A4 इनव्हॉइस
            </button>
            <button
              type="button"
              (click)="activeLayout.set('thermal')"
              [ngClass]="activeLayout() === 'thermal' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              🧾 थर्मल (80mm)
            </button>
            <button
              type="button"
              (click)="activeLayout.set('whatsapp')"
              [ngClass]="activeLayout() === 'whatsapp' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              📱 व्हॉट्सॲप कार्ड
            </button>
          </div>

          <!-- Actions & Close -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="close.emit()"
              class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Scrollable Bill Canvas Container -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white">
          
          <!-- Bill Render Target for Export & Printing -->
          <div
            #billTarget
            [ngClass]="{
              'w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 print-bill-canvas print:border-none print:shadow-none print:p-0': activeLayout() === 'a4',
              'w-[320px] bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-200 text-xs font-mono print-bill-canvas print:border-none print:shadow-none print:p-0': activeLayout() === 'thermal',
              'w-full max-w-[440px] bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-purple-500/30 print-bill-canvas': activeLayout() === 'whatsapp'
            }"
            class="transition-all"
          >
            <!-- 1. A4 Full Invoice Layout -->
            @if (activeLayout() === 'a4') {
              <div class="space-y-6 text-slate-900 text-xs">
                <!-- Header -->
                <div class="flex justify-between items-start border-b-2 border-purple-900 pb-5 avoid-break">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="text-2xl font-black text-purple-950 font-serif">प्रतीक फटाके</span>
                      <span class="text-xs font-bold text-purple-700">PRATIK PHATAKE</span>
                    </div>
                    <p class="text-[11px] text-slate-600 font-medium">अधिकृत व परवानाधारक फटाके दालन (Licensed Fireworks Retailer)</p>
                    <p class="text-[11px] text-slate-600">{{ storeSettings.settings().address }}</p>
                    <p class="text-[11px] text-slate-600">📞 {{ storeSettings.settings().contactNumber }} • ✉️ {{ storeSettings.settings().email }}</p>
                    <div class="pt-1 flex flex-wrap gap-2 text-[10px] font-bold">
                      <span class="bg-purple-50 text-purple-900 px-2 py-0.5 rounded border border-purple-200">
                        GSTIN: {{ storeSettings.settings().gstin }}
                      </span>
                      <span class="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                        PESO परवाना: {{ storeSettings.settings().licenseNumber }}
                      </span>
                    </div>
                  </div>

                  <div class="text-right space-y-1">
                    <div class="inline-block px-3 py-1 rounded-lg bg-purple-950 text-white font-bold text-xs uppercase tracking-wider">
                      कर पावती (TAX INVOICE)
                    </div>
                    <div class="text-sm font-black text-slate-900 font-mono">
                      {{ invoice().invoiceNumber }}
                    </div>
                    <div class="text-[11px] text-slate-500">
                      दिनांक: {{ invoice().createdAt | date:'dd/MM/yyyy, hh:mm a' }}
                    </div>
                    <div class="text-[11px] text-slate-500">
                      आर्थिक वर्ष: {{ invoice().financialYear }}
                    </div>
                    <div class="text-[11px] font-semibold text-purple-700">
                      कॅशियर: {{ invoice().createdBy.name }}
                    </div>
                  </div>
                </div>

                <!-- Customer Details -->
                <div class="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 flex justify-between gap-4 avoid-break">
                  <div class="space-y-0.5">
                    <span class="text-[10px] font-bold text-purple-800 uppercase">ग्राहक माहिती (Billed To)</span>
                    <div class="font-bold text-sm text-slate-900">{{ invoice().customerSnapshot.name }}</div>
                    @if (invoice().customerSnapshot.phone) {
                      <div class="text-[11px] text-slate-600 font-mono">फोन: {{ invoice().customerSnapshot.phone }}</div>
                    }
                    @if (invoice().customerSnapshot.address) {
                      <div class="text-[11px] text-slate-600">पत्ता: {{ invoice().customerSnapshot.address }}</div>
                    }
                  </div>
                  <div class="text-right space-y-0.5">
                    <span class="text-[10px] font-bold text-purple-800 uppercase">पेमेंट स्थिती</span>
                    <div class="font-black text-emerald-700 uppercase">{{ invoice().paymentStatus }} ({{ invoice().paymentMethod }})</div>
                    @if (invoice().notes) {
                      <div class="text-[11px] text-slate-500 italic max-w-xs">{{ invoice().notes }}</div>
                    }
                  </div>
                </div>

                <!-- Product Table (Responsive Container & Compact Rows for Maximum Items) -->
                <div class="overflow-x-auto border border-slate-200 rounded-xl">
                  <table class="w-full text-left border-collapse min-w-[620px] sm:min-w-0">
                    <thead>
                      <tr class="border-b-2 border-slate-300 text-[10px] uppercase font-black text-slate-600 bg-slate-50">
                        <th class="py-2 px-2">क्र.</th>
                        <th class="py-2 px-2">फटाका तपशील</th>
                        <th class="py-2 px-2">SKU</th>
                        <th class="py-2 px-2 text-center">नग</th>
                        <th class="py-2 px-2 text-right">दर (₹)</th>
                        <th class="py-2 px-2 text-right">सवलत</th>
                        <th class="py-2 px-2 text-right">कर (GST)</th>
                        <th class="py-2 px-2 text-right font-black">एकूण (₹)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      @for (item of invoice().items; track item.productId; let idx = $index) {
                        <tr class="hover:bg-slate-50/50">
                          <td class="py-1.5 px-2 font-mono text-[11px] text-slate-500">{{ idx + 1 }}</td>
                          <td class="py-1.5 px-2 font-bold text-slate-900 leading-snug">{{ item.name.mr }}</td>
                          <td class="py-1.5 px-2 font-mono text-[10px] text-slate-500">{{ item.sku }}</td>
                          <td class="py-1.5 px-2 text-center font-bold font-mono">{{ item.quantity }}</td>
                          <td class="py-1.5 px-2 text-right font-mono">₹{{ item.originalUnitPrice }}</td>
                          <td class="py-1.5 px-2 text-right text-rose-600 font-mono">
                            {{ item.discountAmount > 0 ? '-₹' + item.discountAmount : '—' }}
                          </td>
                          <td class="py-1.5 px-2 text-right text-[10px] text-slate-500 font-mono">
                            {{ item.taxRate }}% (₹{{ item.taxAmount }})
                          </td>
                          <td class="py-1.5 px-2 text-right font-bold text-slate-900 font-mono">₹{{ item.lineTotal }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

                <!-- Summary & Tax Breakup -->
                <div class="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between gap-6 avoid-break">
                  <!-- Tax Split Card -->
                  <div class="space-y-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 self-start w-full sm:w-64">
                    <div class="font-bold text-slate-800 text-[10px] uppercase border-b border-slate-200 pb-1">
                      जीएसटी कर विभागणी (GST Breakup)
                    </div>
                    <div class="flex justify-between">
                      <span>करपात्र मूल्य (Taxable):</span>
                      <span class="font-mono font-bold">₹{{ invoice().taxBreakdown.taxableAmount }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>CGST ({{ invoice().taxBreakdown.cgstRate }}%):</span>
                      <span class="font-mono">₹{{ invoice().taxBreakdown.cgstAmount }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>SGST ({{ invoice().taxBreakdown.sgstRate }}%):</span>
                      <span class="font-mono">₹{{ invoice().taxBreakdown.sgstAmount }}</span>
                    </div>
                    <div class="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1">
                      <span>एकूण कर (Total GST):</span>
                      <span class="font-mono">₹{{ invoice().taxBreakdown.totalTax }}</span>
                    </div>
                  </div>

                  <!-- Totals Column -->
                  <div class="space-y-2 w-full sm:w-72 text-xs">
                    <div class="flex justify-between text-slate-600">
                      <span>एकूण रक्कम (Gross):</span>
                      <span class="font-mono">₹{{ invoice().grossAmount }}</span>
                    </div>
                    @if (invoice().totalDiscount > 0) {
                      <div class="flex justify-between text-emerald-600 font-bold">
                        <span>एकूण सवलत (Discount):</span>
                        <span class="font-mono">-₹{{ invoice().totalDiscount }}</span>
                      </div>
                    }
                    @if (invoice().roundingAdjustment !== 0) {
                      <div class="flex justify-between text-slate-500">
                        <span>राउंड ऑफ (Round Off):</span>
                        <span class="font-mono">{{ invoice().roundingAdjustment > 0 ? '+' : '' }}₹{{ invoice().roundingAdjustment }}</span>
                      </div>
                    }
                    <div class="flex justify-between text-base font-black text-purple-950 border-t-2 border-purple-900 pt-2">
                      <span>अंतिम देय रक्कम:</span>
                      <span class="font-mono text-xl">₹{{ invoice().grandTotal }}</span>
                    </div>
                    <div class="flex justify-between text-slate-600 text-[11px] pt-1">
                      <span>प्राप्त रक्कम: ₹{{ invoice().amountReceived }}</span>
                      <span>परत बाकी: ₹{{ invoice().balance }}</span>
                    </div>
                    @if (invoice().customerSavings > 0) {
                      <div class="p-2 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-[11px] text-center border border-emerald-300">
                        🌟 ग्राहक एकूण बचत: ₹{{ invoice().customerSavings }}
                      </div>
                    }
                  </div>
                </div>

                <!-- Footer Notices -->
                <div class="pt-6 border-t border-slate-200 text-center space-y-1.5 text-[10px] text-slate-500 avoid-break">
                  <p class="font-bold text-slate-700">
                    आमच्याकडे खरेदी केल्याबद्दल मनःपूर्वक धन्यवाद! सुरक्षित व आनंददायी दीपोत्सव!
                  </p>
                  <p class="text-[9px]">
                    ⚠️ सुरक्षा सूचना: फटाके सुरक्षित अंतरावरून उडवा. लहान मुलांवर लक्ष ठेवा. जवळ पाण्याचे भांडे ठेवा.
                  </p>
                  <p class="text-[9px] font-mono">
                    संगणकीकृत पावती • स्वाक्षरीची आवश्यकता नाही • {{ invoice().invoiceNumber }}
                  </p>
                </div>
              </div>
            }

            <!-- 2. Thermal 80mm / 58mm Layout -->
            @if (activeLayout() === 'thermal') {
              <div class="space-y-3 text-slate-950">
                <div class="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">
                  <div class="text-base font-black tracking-tight font-serif">प्रतीक फटाके</div>
                  <div class="text-[10px]">PRATIK PHATAKE • PUNE</div>
                  <div class="text-[9px]">{{ storeSettings.settings().address }}</div>
                  <div class="text-[9px]">📞 {{ storeSettings.settings().contactNumber }}</div>
                  <div class="text-[9px] font-bold">GSTIN: {{ storeSettings.settings().gstin }}</div>
                  <div class="text-[9px]">PESO: {{ storeSettings.settings().licenseNumber }}</div>
                </div>

                <div class="flex justify-between text-[10px] border-b border-dashed border-slate-400 pb-2">
                  <div>
                    <div>बिल: <strong>{{ invoice().invoiceNumber }}</strong></div>
                    <div>ग्राहक: {{ invoice().customerSnapshot.name }}</div>
                  </div>
                  <div class="text-right">
                    <div>{{ invoice().createdAt | date:'dd/MM/yy, hh:mm a' }}</div>
                    <div>कॅशियर: {{ invoice().createdBy.name.split(' ')[0] }}</div>
                  </div>
                </div>

                <!-- Thermal Item List -->
                <div class="space-y-1.5 border-b border-dashed border-slate-400 pb-3">
                  <div class="flex justify-between font-bold text-[9px] border-b border-slate-300 pb-1">
                    <span>तपशील</span>
                    <span>नग x दर</span>
                    <span>रक्कम</span>
                  </div>
                  @for (item of invoice().items; track item.productId) {
                    <div class="flex justify-between text-[10px] leading-tight">
                      <div class="truncate max-w-[170px]">{{ item.name.mr }}</div>
                      <div>{{ item.quantity }}x{{ item.unitPrice }}</div>
                      <div class="font-bold">₹{{ item.lineTotal }}</div>
                    </div>
                  }
                </div>

                <!-- Thermal Summary -->
                <div class="space-y-1 text-[10px] border-b border-dashed border-slate-400 pb-2">
                  <div class="flex justify-between">
                    <span>एकूण:</span>
                    <span>₹{{ invoice().grossAmount }}</span>
                  </div>
                  @if (invoice().totalDiscount > 0) {
                    <div class="flex justify-between text-slate-700 font-bold">
                      <span>सवलत:</span>
                      <span>-₹{{ invoice().totalDiscount }}</span>
                    </div>
                  }
                  <div class="flex justify-between">
                    <span>कर (GST 18%):</span>
                    <span>₹{{ invoice().taxBreakdown.totalTax }}</span>
                  </div>
                  <div class="flex justify-between text-sm font-black pt-1 border-t border-slate-300">
                    <span>अंतिम बिल:</span>
                    <span>₹{{ invoice().grandTotal }}</span>
                  </div>
                  <div class="flex justify-between text-[9px] text-slate-600">
                    <span>पेमेंट: {{ invoice().paymentMethod.toUpperCase() }}</span>
                    <span>बचत: ₹{{ invoice().customerSavings }}</span>
                  </div>
                </div>

                <div class="text-center text-[9px] pt-1 space-y-0.5">
                  <div class="font-bold">धन्यवाद! पुन्हा भेट द्या!</div>
                  <div>सुरक्षित फटाके, सुरक्षित दिवाळी! 🪔</div>
                </div>
              </div>
            }

            <!-- 3. WhatsApp High-Res Card Layout -->
            @if (activeLayout() === 'whatsapp') {
              <div class="space-y-5 text-white">
                <!-- Top Brand Banner -->
                <div class="text-center space-y-1 border-b border-purple-500/30 pb-4">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 shadow-sm">
                    ✨ प्रतीक फटाके पुणे ✨
                  </div>
                  <h3 class="text-2xl font-black font-serif text-amber-300 pt-1">
                    अधिकृत खरेदी पावती
                  </h3>
                  <p class="text-xs text-purple-200">
                    {{ storeSettings.settings().address }}
                  </p>
                  <p class="text-[10px] text-amber-200 font-mono">
                    PESO परवाना: {{ storeSettings.settings().licenseNumber }}
                  </p>
                </div>

                <!-- Invoice Meta Pill -->
                <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex justify-between items-center text-xs">
                  <div>
                    <div class="text-[10px] text-purple-300 uppercase">बिल क्रमांक</div>
                    <div class="font-mono font-black text-amber-400">{{ invoice().invoiceNumber }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-[10px] text-purple-300 uppercase">दिनांक</div>
                    <div class="text-slate-200 font-semibold">{{ invoice().createdAt | date:'dd MMM yyyy' }}</div>
                  </div>
                </div>

                <!-- Customer Details -->
                <div class="text-xs space-y-0.5 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div class="text-[10px] text-purple-300">ग्राहक (Customer):</div>
                  <div class="font-bold text-white text-sm">{{ invoice().customerSnapshot.name }}</div>
                  @if (invoice().customerSnapshot.phone) {
                    <div class="text-slate-300 text-[11px]">📞 {{ invoice().customerSnapshot.phone }}</div>
                  }
                </div>

                <!-- Items Preview -->
                <div class="space-y-2">
                  <div class="text-[11px] font-bold text-purple-300 uppercase tracking-wider border-b border-white/10 pb-1">
                    खरेदी केलेले फटाके (Items)
                  </div>
                  <div class="space-y-1.5 text-xs">
                    @for (item of invoice().items; track item.productId) {
                      <div class="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                        <div>
                          <div class="font-semibold text-white leading-tight">{{ item.name.mr }}</div>
                          <div class="text-[10px] text-purple-300">{{ item.quantity }} नग × ₹{{ item.unitPrice }}</div>
                        </div>
                        <div class="font-mono font-bold text-amber-300">
                          ₹{{ item.lineTotal }}
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Grand Total Card -->
                <div class="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 rounded-2xl shadow-lg space-y-1 text-center">
                  <div class="text-[11px] font-black uppercase tracking-wider">अंतिम देय रक्कम (Grand Total)</div>
                  <div class="text-3xl font-black font-mono">
                    ₹{{ invoice().grandTotal.toLocaleString('en-IN') }}
                  </div>
                  <div class="text-[11px] font-bold text-slate-900 pt-0.5">
                    पेमेंट पद्धत: {{ invoice().paymentMethod.toUpperCase() }} • पावती स्थिती: यशस्वी
                  </div>
                </div>

                @if (invoice().customerSavings > 0) {
                  <div class="bg-emerald-500/20 border border-emerald-400/40 p-2.5 rounded-xl text-center text-xs text-emerald-300 font-bold">
                    🎉 तुमची एकूण बचत: ₹{{ invoice().customerSavings }}
                  </div>
                }

                <div class="text-center space-y-1 text-[11px] text-purple-200 pt-2 border-t border-purple-500/20">
                  <p class="font-semibold">🙏 प्रतीक फटाक्यांसोबत दिवाळी साजरी केल्याबद्दल धन्यवाद!</p>
                  <p class="text-[10px] text-amber-300">सुरक्षित अंतर ठेवा • सुरक्षित दीपोत्सव 🪔</p>
                </div>
              </div>
            }

          </div>

        </div>

        <!-- Modal Bottom Actions (Hidden in Print) -->
        <div class="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div class="text-xs text-slate-500">
            पावती फॉरमॅट: <strong>{{ activeLayout().toUpperCase() }}</strong>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <!-- Customer Phone Input for Direct WhatsApp -->
            <div class="flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs">
              <span class="text-slate-500 font-mono font-bold">📱 +91</span>
              <input
                type="tel"
                [value]="customerPhoneInput()"
                (input)="onPhoneChange($event)"
                placeholder="मोबाईल नंबर"
                class="bg-transparent text-slate-900 font-mono font-bold text-xs w-24 sm:w-28 outline-none placeholder:text-slate-400"
                title="व्हॉट्सॲपवर पाठवण्यासाठी मोबाईल नंबर"
              />
            </div>

            <!-- Hardware Print -->
            <button
              type="button"
              (click)="printBill()"
              class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>🖨️</span>
              <span>प्रिंट करा (Print)</span>
            </button>

            <!-- PDF Download -->
            <button
              type="button"
              (click)="downloadPdf()"
              [disabled]="isExporting()"
              class="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>📄</span>
              <span>PDF डाउनलोड</span>
            </button>

            <!-- Image Download -->
            <button
              type="button"
              (click)="downloadImage()"
              [disabled]="isExporting()"
              class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>🖼️</span>
              <span>इमेज (PNG)</span>
            </button>

            <!-- Direct Customer WhatsApp Share Button -->
            <button
              type="button"
              (click)="shareWhatsApp()"
              [disabled]="isExporting()"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              [title]="'थेट ग्राहकाच्या WhatsApp वर बिल पाठवा'"
            >
              <span>💬</span>
              <span>WhatsApp वर पाठवा</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class InvoicePreviewComponent implements OnInit {
  invoice = input.required<Invoice>();
  close = output<void>();

  @ViewChild('billTarget') billTargetRef!: ElementRef<HTMLElement>;

  storeSettings = inject(StoreSettingsService);
  exportService = inject(BillExportService);
  whatsappService = inject(WhatsAppShareService);
  toastService = inject(ToastService);

  activeLayout = signal<'a4' | 'thermal' | 'whatsapp'>('a4');
  isExporting = signal<boolean>(false);
  customerPhoneInput = signal<string>('');

  ngOnInit(): void {
    this.customerPhoneInput.set(this.invoice().customerSnapshot.phone || '');
  }

  onPhoneChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.customerPhoneInput.set(inputEl.value);
  }

  printBill(): void {
    this.exportService.triggerPrint();
  }

  async downloadPdf(): Promise<void> {
    if (!this.billTargetRef) return;
    this.isExporting.set(true);
    try {
      const filename = `Pratik_Phatake_Bill_${this.invoice().invoiceNumber}`;
      await this.exportService.downloadPdf(this.billTargetRef.nativeElement, filename, {
        format: this.activeLayout() === 'thermal' ? 'thermal' : 'a4'
      });
      this.toastService.success('PDF यशस्वीरित्या डाउनलोड झाली!');
    } catch (err) {
      console.error(err);
      this.toastService.error('PDF तयार करताना त्रुटी आली.');
    } finally {
      this.isExporting.set(false);
    }
  }

  async downloadImage(): Promise<void> {
    if (!this.billTargetRef) return;
    this.isExporting.set(true);
    try {
      const filename = `Pratik_Phatake_${this.invoice().invoiceNumber}.png`;
      const dataUrl = await this.exportService.exportToPng(this.billTargetRef.nativeElement);
      this.exportService.downloadDataUrl(dataUrl, filename);
      this.toastService.success('बिल इमेज डाउनलोड झाली!');
    } catch (err) {
      console.error(err);
      this.toastService.error('इमेज तयार करताना त्रुटी आली.');
    } finally {
      this.isExporting.set(false);
    }
  }

  async shareWhatsApp(): Promise<void> {
    if (!this.billTargetRef) return;
    this.isExporting.set(true);
    try {
      const targetPhone = this.customerPhoneInput() || this.invoice().customerSnapshot.phone;
      await this.whatsappService.shareDirectToCustomerWhatsApp(
        this.invoice(),
        targetPhone,
        this.billTargetRef.nativeElement
      );
    } catch (err) {
      console.error(err);
    } finally {
      this.isExporting.set(false);
    }
  }
}
