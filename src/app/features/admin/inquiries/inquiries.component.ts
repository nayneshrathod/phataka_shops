import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InquiryService } from '@core/services/inquiry.service';
import { ToastService } from '@core/services/toast.service';
import { Inquiry, InquiryStatus } from '@core/models';

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 lg:p-8 space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif">
            ग्राहक चौकशी व्यवस्थापन (Inquiry Pipeline)
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            दुकानात प्रत्यक्ष खरेदी करू इच्छिणाऱ्या ग्राहकांच्या चौकशीचे ट्रॅकिंग
          </p>
        </div>

        <button
          type="button"
          (click)="exportToCsv()"
          class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-2"
        >
          <span>📥</span> CSV अहवाल एक्सपोर्ट
        </button>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div class="sm:col-span-6 relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-xs">
            🔍
          </span>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="संदर्भ क्र., नाव किंवा मोबाईल शोधा..."
            class="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div class="sm:col-span-3">
          <select
            [ngModel]="statusFilter()"
            (ngModelChange)="statusFilter.set($event)"
            class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">-- सर्व स्थिती (All Status) --</option>
            <option value="new">नवीन (New)</option>
            <option value="contacted">संपर्क साधला (Contacted)</option>
            <option value="in_review">पुनरावलोकनात (In Review)</option>
            <option value="closed">पूर्ण / भेट दिली (Closed)</option>
            <option value="cancelled">रद्द (Cancelled)</option>
          </select>
        </div>

        <div class="sm:col-span-3 text-right text-xs text-slate-400 font-medium">
          एकूण: <strong class="text-white">{{ filteredInquiries().length }}</strong> चौकशी
        </div>
      </div>

      <!-- Inquiries Table -->
      <div class="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">संदर्भ क्र.</th>
                <th class="py-3 px-4">तारीख</th>
                <th class="py-3 px-4">ग्राहक नाव</th>
                <th class="py-3 px-4">संपर्क (Phone/Email)</th>
                <th class="py-3 px-4">उत्पादने व अंदाजे रक्कम</th>
                <th class="py-3 px-4">स्थिती (Status)</th>
                <th class="py-3 px-4">स्टाफ नोट्स</th>
                <th class="py-3 px-4 text-right">कृती</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              @for (inq of filteredInquiries(); track inq.id) {
                <tr class="hover:bg-slate-900/50 transition-colors">
                  <td class="py-3 px-4 font-mono font-bold text-purple-300">
                    {{ inq.inquiryNumber }}
                  </td>
                  <td class="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {{ inq.createdAt | date:'shortDate' }}
                  </td>
                  <td class="py-3 px-4 font-bold text-white">
                    {{ inq.customerName }}
                  </td>
                  <td class="py-3 px-4 space-y-0.5">
                    <div class="text-white font-medium flex items-center gap-2">
                      <span>{{ inq.phone }}</span>
                      <a [href]="'tel:' + inq.phone" class="text-purple-400 hover:underline" title="कॉल करा">📞</a>
                      <a [href]="getWhatsAppUrl(inq)" target="_blank" class="text-emerald-400 hover:underline" title="WhatsApp पाठवा">💬</a>
                    </div>
                    <div class="text-[11px] text-slate-500">{{ inq.email }}</div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="text-slate-300 font-medium">
                      @for (it of inq.items; track it.productId) {
                        <div>• {{ it.productName }} ({{ it.quantity }} नग)</div>
                      }
                    </div>
                    <div class="text-[11px] font-bold text-amber-300 mt-1">
                      अंदाजे: ₹{{ inq.totalEstimatedAmount }}
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <select
                      [ngModel]="inq.status"
                      (ngModelChange)="onStatusChange(inq, $event)"
                      class="px-2 py-1 rounded-lg text-[11px] font-bold uppercase bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="new">NEW (नवीन)</option>
                      <option value="contacted">CONTACTED (संपर्क झाला)</option>
                      <option value="in_review">IN REVIEW (विचाराधीन)</option>
                      <option value="closed">CLOSED (दुकान भेट पूर्ण)</option>
                      <option value="cancelled">CANCELLED (रद्द)</option>
                    </select>
                  </td>
                  <td class="py-3 px-4 max-w-xs">
                    <div class="text-slate-300 text-[11px] truncate" [title]="inq.staffNotes || 'नोंद नाही'">
                      {{ inq.staffNotes || '-' }}
                    </div>
                  </td>
                  <td class="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      (click)="openNotesModal(inq)"
                      class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-[11px] transition-colors"
                    >
                      नोट्स लिहा
                    </button>
                    <button
                      type="button"
                      (click)="deleteInquiry(inq)"
                      class="px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-400 font-bold text-[11px] transition-colors"
                    >
                      हटवा
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Staff Notes Modal -->
      @if (selectedInquiry(); as inq) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="text-base font-bold text-white font-serif">
                स्टाफ अंतर्गत नोट्स: {{ inq.inquiryNumber }}
              </h3>
              <button
                type="button"
                (click)="selectedInquiry.set(null)"
                class="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div class="space-y-3">
              <div class="text-xs text-slate-400">
                ग्राहक: <strong class="text-white">{{ inq.customerName }}</strong> ({{ inq.phone }})
              </div>
              <textarea
                [(ngModel)]="tempNotes"
                rows="4"
                placeholder="उदा. ग्राहकाशी फोनवर बोलणे झाले. ते उद्या संध्याकाळी दुकानात येणार आहेत."
                class="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500 placeholder-slate-500"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                (click)="selectedInquiry.set(null)"
                class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                रद्द करा
              </button>
              <button
                type="button"
                (click)="saveNotes()"
                class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md"
              >
                नोंद जतन करा
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminInquiriesComponent {
  inquiryService = inject(InquiryService);
  private toastService = inject(ToastService);

  searchQuery = signal<string>('');
  statusFilter = signal<string>('');
  selectedInquiry = signal<Inquiry | null>(null);
  tempNotes = '';

  filteredInquiries = computed(() => {
    let list = this.inquiryService.inquiries();
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();

    if (st) {
      list = list.filter(i => i.status === st);
    }
    if (q) {
      list = list.filter(i =>
        i.inquiryNumber.toLowerCase().includes(q) ||
        i.customerName.toLowerCase().includes(q) ||
        i.phone.includes(q)
      );
    }
    return list;
  });

  onStatusChange(inq: Inquiry, newStatus: InquiryStatus): void {
    this.inquiryService.updateInquiryStatus(inq.id, newStatus);
    this.toastService.success(`चौकशी स्थिती ${newStatus} अशी बदलली!`);
  }

  openNotesModal(inq: Inquiry): void {
    this.selectedInquiry.set(inq);
    this.tempNotes = inq.staffNotes || '';
  }

  saveNotes(): void {
    const inq = this.selectedInquiry();
    if (inq) {
      this.inquiryService.updateInquiryStatus(inq.id, inq.status, this.tempNotes);
      this.toastService.success('स्टाफ नोट्स जतन केल्या!');
      this.selectedInquiry.set(null);
    }
  }

  deleteInquiry(inq: Inquiry): void {
    if (confirm(`चौकशी "${inq.inquiryNumber}" हटवायची आहे का?`)) {
      this.inquiryService.deleteInquiry(inq.id);
      this.toastService.success('चौकशी हटवली गेली!');
    }
  }

  getWhatsAppUrl(inq: Inquiry): string {
    return this.inquiryService.generateWhatsAppUrl(inq);
  }

  exportToCsv(): void {
    const list = this.inquiryService.inquiries();
    let csv = 'InquiryNumber,Date,CustomerName,Phone,Email,Status,EstAmount,StaffNotes\n';
    list.forEach(i => {
      csv += `"${i.inquiryNumber}","${i.createdAt}","${i.customerName}","${i.phone}","${i.email}","${i.status}",${i.totalEstimatedAmount},"${(i.staffNotes || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pratik_phatake_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    this.toastService.success('CSV अहवाल डाउनलोड झाला!');
  }
}
