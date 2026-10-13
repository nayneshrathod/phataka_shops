import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Invoice } from '@core/models';
import { InvoiceService } from '@core/services/invoice.service';
import { WhatsAppShareService } from '@core/services/whatsapp-share.service';
import { ToastService } from '@core/services/toast.service';
import { InvoicePreviewComponent } from '../invoice-preview/invoice-preview.component';

@Component({
  selector: 'app-billing-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InvoicePreviewComponent],
  template: `
    <div class="p-6 lg:p-8 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif flex items-center gap-2">
            <span>📜</span>
            <span>बिल इतिहास व विक्री नोंदी (Billing History)</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            काऊंटरवर तयार झालेल्या सर्व कर पावत्यांचा तपशील, पुनर्मुद्रण व अहवाल
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="exportToCsv()"
            class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <span>📥</span> CSV अहवाल डाउनलोड
          </button>
          <a
            routerLink="/admin/billing"
            class="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-colors"
          >
            <span>➕</span> नवीन बिलिंग काउंटर
          </a>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400">एकूण इनव्हॉइस</div>
          <div class="text-2xl font-black text-white">{{ invoiceService.invoices().length }}</div>
          <div class="text-[10px] text-purple-400">नोंदणीकृत पावत्या</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400">एकूण विक्री (Billed Total)</div>
          <div class="text-2xl font-black text-emerald-400 font-mono">
            ₹{{ invoiceService.totalBilledAmount().toLocaleString('en-IN') }}
          </div>
          <div class="text-[10px] text-emerald-300">पूर्ण झालेली विक्री</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400">दिलेली एकूण सवलत</div>
          <div class="text-2xl font-black text-amber-400 font-mono">
            ₹{{ invoiceService.totalDiscountsGiven().toLocaleString('en-IN') }}
          </div>
          <div class="text-[10px] text-amber-300">ग्राहक बचत</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400">सरासरी बिल मूल्य (AOV)</div>
          <div class="text-2xl font-black text-purple-300 font-mono">
            ₹{{ invoiceService.averageInvoiceValue().toLocaleString('en-IN') }}
          </div>
          <div class="text-[10px] text-purple-400">प्रति ग्राहक सरासरी</div>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <!-- Search Box -->
        <div class="relative flex-1 min-w-[240px]">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="बिल क्र., ग्राहक नाव किंवा फोन शोधा..."
            class="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <span class="absolute left-3 top-2 text-slate-400">🔍</span>
        </div>

        <!-- Date Filter -->
        <div class="flex items-center gap-1.5">
          <span class="text-slate-400 text-[11px]">कालावधी:</span>
          <select
            [(ngModel)]="dateFilter"
            class="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">सर्व (All Time)</option>
            <option value="today">आज (Today)</option>
            <option value="this_week">या आठवड्यात (This Week)</option>
            <option value="this_month">या महिन्यात (This Month)</option>
          </select>
        </div>

        <!-- Payment Method Filter -->
        <div class="flex items-center gap-1.5">
          <span class="text-slate-400 text-[11px]">पेमेंट:</span>
          <select
            [(ngModel)]="paymentFilter"
            class="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">सर्व (All Modes)</option>
            <option value="cash">रोख (Cash)</option>
            <option value="upi">UPI</option>
            <option value="card">कार्ड (Card)</option>
            <option value="split">स्प्लिट (Split)</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="flex items-center gap-1.5">
          <span class="text-slate-400 text-[11px]">स्थिती:</span>
          <select
            [(ngModel)]="statusFilter"
            class="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">सर्व</option>
            <option value="completed">पूर्ण (Completed)</option>
            <option value="refunded">परतावा (Refunded)</option>
            <option value="cancelled">रद्द (Cancelled)</option>
          </select>
        </div>
      </div>

      <!-- Invoices Data Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <th class="py-3 px-4">बिल क्रमांक</th>
                <th class="py-3 px-4">दिनांक व वेळ</th>
                <th class="py-3 px-4">ग्राहक</th>
                <th class="py-3 px-4">आयटम्स</th>
                <th class="py-3 px-4 text-right">एकूण रक्कम</th>
                <th class="py-3 px-4 text-right">सवलत</th>
                <th class="py-3 px-4 text-right font-black">अंतिम बिल</th>
                <th class="py-3 px-4 text-center">पेमेंट</th>
                <th class="py-3 px-4 text-center">स्थिती</th>
                <th class="py-3 px-4 text-right">कृती</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              @for (inv of filteredInvoices(); track inv.id) {
                <tr class="hover:bg-slate-800/40 transition-colors">
                  <td class="py-3 px-4 font-mono font-bold text-purple-400">
                    {{ inv.invoiceNumber }}
                  </td>
                  <td class="py-3 px-4 text-slate-300">
                    {{ inv.createdAt | date:'dd MMM yyyy, hh:mm a' }}
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-bold text-white">{{ inv.customerSnapshot.name }}</div>
                    @if (inv.customerSnapshot.phone) {
                      <div class="text-[10px] text-slate-400 font-mono">{{ inv.customerSnapshot.phone }}</div>
                    }
                  </td>
                  <td class="py-3 px-4 text-slate-300">
                    {{ inv.items.length }} आयटम्स
                  </td>
                  <td class="py-3 px-4 text-right font-mono text-slate-400">
                    ₹{{ inv.grossAmount }}
                  </td>
                  <td class="py-3 px-4 text-right font-mono text-amber-400">
                    {{ inv.totalDiscount > 0 ? '-₹' + inv.totalDiscount : '—' }}
                  </td>
                  <td class="py-3 px-4 text-right font-mono font-black text-emerald-400 text-sm">
                    ₹{{ inv.grandTotal }}
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                      {{ inv.paymentMethod }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    @if (inv.invoiceStatus === 'completed') {
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        पूर्ण
                      </span>
                    } @else if (inv.invoiceStatus === 'refunded') {
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                        परतावा
                      </span>
                    } @else {
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                        रद्द
                      </span>
                    }
                  </td>
                  <td class="py-3 px-4 text-right space-x-1.5">
                    <button
                      type="button"
                      (click)="selectedInvoice.set(inv)"
                      class="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition-colors"
                      title="पावती पहा व प्रिंट करा"
                    >
                      पावती 🧾
                    </button>
                    <button
                      type="button"
                      (click)="shareWhatsAppDirect(inv)"
                      class="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] transition-colors"
                      title="WhatsApp वर शेअर"
                    >
                      💬
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="10" class="py-12 text-center text-slate-500">
                    कोणतेही इनव्हॉइस सापडले नाही.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Preview Modal -->
      @if (selectedInvoice()) {
        <app-invoice-preview
          [invoice]="selectedInvoice()!"
          (close)="selectedInvoice.set(null)"
        />
      }

    </div>
  `
})
export class BillingHistoryComponent {
  invoiceService = inject(InvoiceService);
  whatsappService = inject(WhatsAppShareService);
  toastService = inject(ToastService);

  searchQuery = signal<string>('');
  dateFilter = signal<string>('all');
  paymentFilter = signal<string>('all');
  statusFilter = signal<string>('all');
  selectedInvoice = signal<Invoice | null>(null);

  filteredInvoices = computed(() => {
    let list = this.invoiceService.invoices();

    // Query filter
    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter(i =>
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.customerSnapshot.name.toLowerCase().includes(q) ||
        (i.customerSnapshot.phone && i.customerSnapshot.phone.includes(q))
      );
    }

    // Payment filter
    const pay = this.paymentFilter();
    if (pay !== 'all') {
      list = list.filter(i => i.paymentMethod === pay);
    }

    // Status filter
    const st = this.statusFilter();
    if (st !== 'all') {
      list = list.filter(i => i.invoiceStatus === st);
    }

    // Date filter
    const df = this.dateFilter();
    const todayStr = new Date().toISOString().split('T')[0];
    if (df === 'today') {
      list = list.filter(i => i.createdAt.startsWith(todayStr));
    } else if (df === 'this_month') {
      const monthStr = todayStr.substring(0, 7);
      list = list.filter(i => i.createdAt.startsWith(monthStr));
    }

    return list;
  });

  shareWhatsAppDirect(inv: Invoice): void {
    const text = this.whatsappService.generateBillSummaryText(inv);
    const cleanPhone = (inv.customerSnapshot.phone || '').replace(/\D/g, '');
    const url = cleanPhone
      ? `https://wa.me/91${cleanPhone.replace(/^91/, '')}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  exportToCsv(): void {
    const invoices = this.filteredInvoices();
    if (invoices.length === 0) {
      this.toastService.warning('डाउनलोड करण्यासाठी कोणताही डेटा नाही.');
      return;
    }

    const headers = ['Invoice Number', 'Date', 'Customer Name', 'Phone', 'Gross (INR)', 'Discount (INR)', 'Grand Total (INR)', 'Payment Mode', 'Status', 'Cashier'];
    const rows = invoices.map(i => [
      i.invoiceNumber,
      i.createdAt,
      `"${i.customerSnapshot.name}"`,
      i.customerSnapshot.phone || '',
      i.grossAmount,
      i.totalDiscount,
      i.grandTotal,
      i.paymentMethod,
      i.invoiceStatus,
      `"${i.createdBy.name}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pratik_Phatake_Billing_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.toastService.success('CSV अहवाल डाऊनलोड झाला!');
  }
}
