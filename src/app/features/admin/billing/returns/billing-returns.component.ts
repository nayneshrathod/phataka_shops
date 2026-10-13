import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Invoice, InvoiceReturn } from '@core/models';
import { InvoiceService } from '@core/services/invoice.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-billing-returns',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6 lg:p-8 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif flex items-center gap-2">
            <span>🔄</span>
            <span>फटाके परतावा व विक्री रद्द (Returns & Cancellations)</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            अधिकृत काऊंटर परतावा, साठा पुनर्नोंद (Inventory Restock) व रिफंड व्हाउचर
          </p>
        </div>

        <a
          routerLink="/admin/billing/history"
          class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-colors self-start"
        >
          <span>📜</span> बिल इतिहासाकडे जा
        </a>
      </div>

      <!-- Statutory Regulatory Return Advisory Box -->
      <div class="p-4 rounded-2xl bg-amber-950/60 border border-amber-800 text-xs text-amber-200 flex items-start gap-3">
        <span class="text-xl">⚠️</span>
        <div class="space-y-1">
          <h4 class="font-bold text-amber-300">नियंत्रित फटाके परतावा नियम (Regulated Safety Return Policy):</h4>
          <p class="leading-relaxed">
            फटाके हे स्फोटक कायद्यांतर्गत येत असल्याने उघडलेले अथवा वापरलेले फटाके परतावा स्वीकारता येत नाहीत. केवळ दुकान आवारातील न उघडलेले बॉक्स किंवा काऊंटर तपासणीतील खराब बॉक्स त्वरित तपासणीअंती परत घेऊन साठ्यात पुनर्नोंद करता येतात.
          </p>
        </div>
      </div>

      <!-- Two Columns: Process Return Form (Left) + Recent Returns List (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left 7 Cols: Process New Return -->
        <div class="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 class="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <span>🔍</span> मूळ बिल शोधा (Lookup Invoice)
          </h3>

          <!-- Invoice Lookup Bar -->
          <div class="flex gap-2">
            <input
              type="text"
              [(ngModel)]="searchInvoiceNo"
              placeholder="बिल क्रमांक प्रविष्ट करा (उदा. PP-2026-000001)"
              class="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 uppercase font-mono focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              (click)="lookupInvoice()"
              class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
            >
              शोधा
            </button>
          </div>

          @if (foundInvoice()) {
            <!-- Invoice Details Card -->
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div class="flex justify-between items-start text-xs border-b border-slate-800 pb-2">
                <div>
                  <div class="font-mono font-bold text-purple-400">{{ foundInvoice()?.invoiceNumber }}</div>
                  <div class="text-white font-semibold">{{ foundInvoice()?.customerSnapshot?.name }}</div>
                  <div class="text-slate-400 text-[11px]">{{ foundInvoice()?.createdAt | date:'dd MMM yyyy, hh:mm a' }}</div>
                </div>
                <div class="text-right">
                  <div class="text-emerald-400 font-mono font-bold text-base">₹{{ foundInvoice()?.grandTotal }}</div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    {{ foundInvoice()?.paymentMethod }}
                  </span>
                </div>
              </div>

              <!-- Item Return Selection Table -->
              <div class="space-y-2">
                <div class="text-xs font-bold text-slate-300">परत करावयाचे फटाके निवडा:</div>
                <div class="space-y-2">
                  @for (item of returnItemsMap; track item.productId) {
                    <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 text-xs">
                      <div class="flex items-center gap-3">
                        <input
                          type="checkbox"
                          [(ngModel)]="item.selected"
                          class="rounded text-purple-600 focus:ring-0"
                        />
                        <div>
                          <div class="font-bold text-white">{{ item.name }}</div>
                          <div class="text-[11px] text-slate-400">मूळ खरेदी: {{ item.originalQty }} नग • दर: ₹{{ item.unitPrice }}</div>
                        </div>
                      </div>

                      @if (item.selected) {
                        <div class="flex items-center gap-2">
                          <span class="text-[11px] text-slate-400">परत नग:</span>
                          <input
                            type="number"
                            [(ngModel)]="item.quantityToReturn"
                            [max]="item.originalQty"
                            min="1"
                            class="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white font-mono text-center"
                          />
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Return Reason Selector -->
              <div class="space-y-1.5 pt-2">
                <label class="block text-xs font-bold text-slate-300">परतावा अधिकृत कारण (Return Reason) *</label>
                <select
                  [(ngModel)]="returnReason"
                  class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="काऊंटर तपासणीत बॉक्स खराब आढळला (Damaged box discovered at counter)">
                    काऊंटर तपासणीत बॉक्स खराब आढळला (Damaged box discovered at counter)
                  </option>
                  <option value="दुकान आवारात ग्राहक बदल / एक्स्चेंज (Exchange before exit)">
                    दुकान आवारात ग्राहक बदल / एक्स्चेंज (Exchange before exit)
                  </option>
                  <option value="ग्राहकाने खरेदी रद्द केली (Customer cancelled at counter)">
                    ग्राहकाने खरेदी रद्द केली (Customer cancelled at counter)
                  </option>
                  <option value="इतर व्यवस्थापकीय कारण (Other authorized reason)">
                    इतर व्यवस्थापकीय कारण (Other authorized reason)
                  </option>
                </select>
              </div>

              <!-- Submit Return Button -->
              <button
                type="button"
                (click)="processReturnSubmit()"
                class="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>परतावा नोंदवा आणि साठ्यात जमा करा (Process & Restock)</span>
              </button>
            </div>
          }
        </div>

        <!-- Right 5 Cols: Past Returns History -->
        <div class="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 class="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <span>📋</span> परतावा नोंदी इतिहास (Return Vouchers)
          </h3>

          <div class="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            @for (ret of invoiceService.returns(); track ret.id) {
              <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="font-mono font-bold text-amber-400">{{ ret.returnReference }}</span>
                    <div class="text-[11px] text-slate-400">मूळ बिल: {{ ret.invoiceNumber }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-mono font-bold text-rose-400">-₹{{ ret.totalRefundAmount }}</div>
                    <div class="text-[10px] text-slate-500">{{ ret.createdAt | date:'dd/MM/yy, hh:mm a' }}</div>
                  </div>
                </div>

                <div class="text-[11px] text-slate-300">
                  कारण: <em>{{ ret.reason }}</em>
                </div>

                <div class="text-[10px] text-slate-500 pt-1 border-t border-slate-900 flex justify-between">
                  <span>परतावा आयटम्स: {{ ret.items.length }}</span>
                  <span>अधिकृत: {{ ret.authorizedBy }}</span>
                </div>
              </div>
            } @empty {
              <div class="py-12 text-center text-slate-500 text-xs">
                कोणतीही परतावा नोंद उपलब्ध नाही.
              </div>
            }
          </div>
        </div>

      </div>

    </div>
  `
})
export class BillingReturnsComponent {
  invoiceService = inject(InvoiceService);
  toastService = inject(ToastService);

  searchInvoiceNo = signal<string>('');
  foundInvoice = signal<Invoice | null>(null);
  returnReason = signal<string>('काऊंटर तपासणीत बॉक्स खराब आढळला (Damaged box discovered at counter)');

  returnItemsMap: {
    productId: string;
    name: string;
    originalQty: number;
    unitPrice: number;
    selected: boolean;
    quantityToReturn: number;
  }[] = [];

  lookupInvoice(): void {
    const q = this.searchInvoiceNo().trim().toUpperCase();
    if (!q) return;

    const inv = this.invoiceService.getInvoiceById(q);
    if (!inv) {
      this.toastService.warning(`इनव्हॉइस "${q}" सापडले नाही.`);
      this.foundInvoice.set(null);
      return;
    }

    this.foundInvoice.set(inv);
    this.returnItemsMap = inv.items.map(item => ({
      productId: item.productId,
      name: item.name.mr,
      originalQty: item.quantity,
      unitPrice: item.unitPrice,
      selected: false,
      quantityToReturn: 1
    }));
  }

  processReturnSubmit(): void {
    const inv = this.foundInvoice();
    if (!inv) return;

    const selected = this.returnItemsMap.filter(i => i.selected);
    if (selected.length === 0) {
      this.toastService.warning('कृपया परत करण्यासाठी किमान १ फटाका निवडा.');
      return;
    }

    const itemsToReturn = selected.map(s => ({
      productId: s.productId,
      quantity: Math.min(s.originalQty, Math.max(1, s.quantityToReturn)),
      reason: this.returnReason()
    }));

    const result = this.invoiceService.processReturn(
      inv.id,
      itemsToReturn,
      this.returnReason()
    );

    if (result.success && result.returnVoucher) {
      this.toastService.success(`परतावा व्हाउचर ${result.returnVoucher.returnReference} तयार झाले आणि साठ्यात पुनर्नोंद झाली!`);
      this.foundInvoice.set(null);
      this.searchInvoiceNo.set('');
    } else {
      this.toastService.error(result.message || 'परतावा नोंदवताना त्रुटी आली.');
    }
  }
}
