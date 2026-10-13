import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InquiryService } from '@core/services/inquiry.service';

interface CustomerSummary {
  name: string;
  phone: string;
  email: string;
  inquiryCount: number;
  lastDate: string;
  consent: boolean;
}

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 lg:p-8 space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif">
            ग्राहक निर्देशिका (Customer Directory)
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            चौकशी करणाऱ्या ग्राहकांचे संपर्क तपशील आणि संमती नोंदी
          </p>
        </div>

        <div class="text-xs text-slate-400">
          एकूण ग्राहक: <strong class="text-white">{{ customers().length }}</strong>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">ग्राहक नाव</th>
                <th class="py-3 px-4">मोबाईल क्रमांक</th>
                <th class="py-3 px-4">ईमेल</th>
                <th class="py-3 px-4">एकूण चौकशी</th>
                <th class="py-3 px-4">शेवटचा संपर्क</th>
                <th class="py-3 px-4">कायदेशीर संमती</th>
                <th class="py-3 px-4 text-right">थेट संपर्क</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              @for (c of customers(); track c.phone) {
                <tr class="hover:bg-slate-900/50 transition-colors">
                  <td class="py-3 px-4 font-bold text-white text-sm">
                    {{ c.name }}
                  </td>
                  <td class="py-3 px-4 font-mono text-purple-300">
                    {{ c.phone }}
                  </td>
                  <td class="py-3 px-4 text-slate-400">
                    {{ c.email }}
                  </td>
                  <td class="py-3 px-4 font-bold text-amber-300">
                    {{ c.inquiryCount }} वेळा
                  </td>
                  <td class="py-3 px-4 text-slate-400">
                    {{ c.lastDate | date:'shortDate' }}
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      ✅ संमत (Verified)
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right space-x-2">
                    <a [href]="'tel:' + c.phone" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-[11px]">
                      📞 कॉल
                    </a>
                    <a [href]="'https://wa.me/' + c.phone.replace(/[^0-9]/g, '')" target="_blank" class="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold text-[11px]">
                      💬 WhatsApp
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdminCustomersComponent {
  private inquiryService = inject(InquiryService);

  customers = computed<CustomerSummary[]>(() => {
    const inqs = this.inquiryService.inquiries();
    const map = new Map<string, CustomerSummary>();

    inqs.forEach(i => {
      const key = i.phone.trim();
      if (!map.has(key)) {
        map.set(key, {
          name: i.customerName,
          phone: i.phone,
          email: i.email,
          inquiryCount: 1,
          lastDate: i.createdAt,
          consent: i.consent
        });
      } else {
        const existing = map.get(key)!;
        existing.inquiryCount++;
        if (new Date(i.createdAt) > new Date(existing.lastDate)) {
          existing.lastDate = i.createdAt;
        }
      }
    });

    return Array.from(map.values());
  });
}
