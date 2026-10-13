import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '@core/services/product.service';
import { InquiryService } from '@core/services/inquiry.service';
import { StoreSettingsService } from '@core/services/store-settings.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 lg:p-8 space-y-8">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif">
            अहवाल व विश्लेषण (Reports & Analytics)
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            साठा मूल्य, मागणी विश्लेषण आणि पुनःखरेदी यादी
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="printReport()"
            class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-2"
          >
            <span>🖨️</span> प्रिंट करा (Print)
          </button>
          <button
            type="button"
            (click)="exportInventoryCsv()"
            class="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
          >
            <span>📥</span> साठा अहवाल CSV
          </button>
        </div>
      </div>

      <!-- Printable Report Area -->
      <div class="space-y-8 print:text-black">
        
        <!-- Summary KPI Matrix -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <span class="text-xs text-slate-400">एकूण उत्पादने</span>
            <div class="text-2xl font-black text-white mt-1">{{ productService.products().length }}</div>
          </div>
          <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <span class="text-xs text-slate-400">एकूण शिल्लक नग (Total Units)</span>
            <div class="text-2xl font-black text-purple-400 mt-1">{{ totalUnits() }} नग</div>
          </div>
          <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <span class="text-xs text-slate-400">एकूण किरकोळ मूल्य (Retail Value)</span>
            <div class="text-2xl font-black text-emerald-400 font-mono mt-1">
              ₹{{ totalRetailValue().toLocaleString('en-IN') }}
            </div>
          </div>
          <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <span class="text-xs text-slate-400">अंदाजे खरेदी खर्च (Cost Value)</span>
            <div class="text-2xl font-black text-amber-400 font-mono mt-1">
              ₹{{ totalCostValue().toLocaleString('en-IN') }}
            </div>
          </div>
        </div>

        <!-- Section 1: Critical Low Stock Reorder Statement -->
        <div class="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-bold text-white font-serif flex items-center gap-2">
              <span>⚠️</span>
              <span>पुनःखरेदी आवश्यक साठा यादी (Low-Stock Reorder Report)</span>
            </h2>
            <span class="text-xs text-rose-400 font-bold">
              {{ productService.lowStockProducts().length }} उत्पादने
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th class="py-3 px-3">SKU</th>
                  <th class="py-3 px-3">उत्पादन नाव</th>
                  <th class="py-3 px-3">निर्माता</th>
                  <th class="py-3 px-3">सध्याचा साठा</th>
                  <th class="py-3 px-3">किमान मर्यादा</th>
                  <th class="py-3 px-3">शिफारस केलेली ऑर्डर</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                @for (p of productService.lowStockProducts(); track p.id) {
                  <tr class="hover:bg-slate-900/50">
                    <td class="py-3 px-3 font-mono font-bold text-purple-300">{{ p.sku }}</td>
                    <td class="py-3 px-3 font-bold text-white">{{ p.name.mr }}</td>
                    <td class="py-3 px-3 text-slate-400">{{ p.manufacturer }}</td>
                    <td class="py-3 px-3 font-bold text-rose-400">{{ p.stockQuantity }} नग</td>
                    <td class="py-3 px-3 text-slate-400">{{ p.lowStockThreshold }} नग</td>
                    <td class="py-3 px-3 font-bold text-amber-300">
                      +{{ (p.lowStockThreshold * 3) - p.stockQuantity }} नग
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="py-6 text-center text-emerald-400">
                      कोणत्याही उत्पादनाचा साठा कमी नाही. सर्व पुरवठा व्यवस्थित आहे.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2: Most Inquired Products Ranking -->
        <div class="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 class="text-base font-bold text-white font-serif flex items-center gap-2">
            <span>🔥</span>
            <span>सर्वाधिक विचारली गेलेली उत्पादने (Customer Interest Ranking)</span>
          </h2>

          <div class="space-y-3">
            @for (item of productInterestRanking(); track item.productName) {
              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-purple-900/60 text-purple-300 font-bold flex items-center justify-center text-[10px]">
                    #{{ item.rank }}
                  </span>
                  <span class="font-bold text-white">{{ item.productName }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-slate-400">{{ item.totalQty }} नग अपेक्षित</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                    {{ item.inquiryCount }} ग्राहकांची चौकशी
                  </span>
                </div>
              </div>
            }
          </div>
        </div>

      </div>

    </div>
  `
})
export class AdminReportsComponent {
  productService = inject(ProductService);
  private inquiryService = inject(InquiryService);
  private settingsService = inject(StoreSettingsService);
  private toastService = inject(ToastService);

  totalUnits = computed(() => {
    return this.productService.products().reduce((acc, p) => acc + p.stockQuantity, 0);
  });

  totalRetailValue = computed(() => {
    return this.productService.products().reduce((acc, p) => acc + (p.retailPrice * p.stockQuantity), 0);
  });

  totalCostValue = computed(() => {
    return this.productService.products().reduce((acc, p) => acc + ((p.costPrice || p.retailPrice * 0.65) * p.stockQuantity), 0);
  });

  productInterestRanking = computed(() => {
    const map = new Map<string, { count: number; qty: number }>();
    this.inquiryService.inquiries().forEach(inq => {
      inq.items.forEach(it => {
        const current = map.get(it.productName) || { count: 0, qty: 0 };
        current.count++;
        current.qty += it.quantity;
        map.set(it.productName, current);
      });
    });

    const arr = Array.from(map.entries())
      .map(([name, data]) => ({
        productName: name,
        inquiryCount: data.count,
        totalQty: data.qty,
        rank: 0
      }))
      .sort((a, b) => b.inquiryCount - a.inquiryCount);

    arr.forEach((it, idx) => (it.rank = idx + 1));
    return arr.slice(0, 8);
  });

  printReport(): void {
    window.print();
  }

  exportInventoryCsv(): void {
    const list = this.productService.products();
    let csv = 'SKU,Name_MR,RetailPrice,CostPrice,Stock,Valuation_INR\n';
    list.forEach(p => {
      const val = p.retailPrice * p.stockQuantity;
      csv += `"${p.sku}","${p.name.mr}",${p.retailPrice},${p.costPrice || 0},${p.stockQuantity},${val}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_valuation_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    this.toastService.success('साठा अहवाल डाउनलोड झाला!');
  }
}
