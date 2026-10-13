import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '@core/services/inventory.service';
import { ProductService } from '@core/services/product.service';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { MovementType } from '@core/models';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 lg:p-8 space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif">
            इन्व्हेंटरी व साठा व्यवस्थापन (Inventory Movements)
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            नवीन माल आवक (Stock In), खराब स्टॉक (Damage) आणि प्रत्यक्ष मोजणी (Audit)
          </p>
        </div>

        <button
          type="button"
          (click)="openAdjustModal()"
          class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-colors flex items-center gap-2"
        >
          <span>📦</span> नवीन साठा आवक / फेरफार (Adjust Stock)
        </button>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span class="text-xs text-slate-400">एकूण साठा हालचाली (Movements Log)</span>
          <div class="text-2xl font-black text-white">{{ inventoryService.movements().length }}</div>
        </div>
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span class="text-xs text-slate-400">कमी साठा असणारी उत्पादने</span>
          <div class="text-2xl font-black text-rose-400">{{ productService.lowStockProducts().length }}</div>
        </div>
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span class="text-xs text-slate-400">एकूण साठा मूल्यांकन (Valuation)</span>
          <div class="text-2xl font-black text-emerald-400 font-mono">
            ₹{{ productService.inventoryValuation().toLocaleString('en-IN') }}
          </div>
        </div>
      </div>

      <!-- Inventory Movements Audit Table -->
      <div class="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 class="text-sm font-bold text-white font-serif">
            साठा हालचाली इतिहास (Stock Movement Log)
          </h3>
          <span class="text-xs text-slate-500">
            प्रत्येक फेरफार स्वयंचलितरित्या ऑडीट लॉगमध्ये नोंदवला जातो
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">तारीख व वेळ</th>
                <th class="py-3 px-4">फटाका (Product)</th>
                <th class="py-3 px-4">प्रकार (Type)</th>
                <th class="py-3 px-4">बदल (Delta)</th>
                <th class="py-3 px-4">आधीचा साठा → नवीन</th>
                <th class="py-3 px-4">कारण (Reason)</th>
                <th class="py-3 px-4">नोंदणीकर्ता (Staff)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              @for (m of inventoryService.movements(); track m.id) {
                <tr class="hover:bg-slate-900/50 transition-colors">
                  <td class="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {{ m.createdAt | date:'short' }}
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-bold text-white">{{ m.productName }}</div>
                    <div class="text-[10px] text-purple-400 font-mono">SKU: {{ m.sku }}</div>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      [ngClass]="{
                        'bg-emerald-950 text-emerald-300 border border-emerald-800': m.movementType === 'STOCK_IN',
                        'bg-blue-950 text-blue-300 border border-blue-800': m.movementType === 'STOCK_OUT',
                        'bg-rose-950 text-rose-300 border border-rose-800': m.movementType === 'DAMAGE',
                        'bg-amber-950 text-amber-300 border border-amber-800': m.movementType === 'ADJUSTMENT'
                      }">
                      {{ m.movementType }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-bold text-sm"
                      [ngClass]="m.quantityChange >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                    {{ m.quantityChange >= 0 ? '+' : '' }}{{ m.quantityChange }}
                  </td>
                  <td class="py-3 px-4 font-mono text-slate-300">
                    {{ m.previousQuantity }} → <strong class="text-white">{{ m.newQuantity }}</strong>
                  </td>
                  <td class="py-3 px-4 text-slate-300 max-w-xs truncate" [title]="m.reason">
                    {{ m.reason }}
                  </td>
                  <td class="py-3 px-4 text-slate-400 truncate max-w-[140px]">
                    {{ m.performedBy }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Stock Adjustment Modal -->
      @if (adjustModalOpen()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 class="text-lg font-bold text-white font-serif">
                साठा आवक / समायोजन नोंद (Stock Adjustment)
              </h3>
              <button
                type="button"
                (click)="adjustModalOpen.set(false)"
                class="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form [formGroup]="adjustForm" (ngSubmit)="submitAdjustment()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">फटाका निवडा (Product) *</label>
                <select
                  formControlName="productId"
                  class="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">-- उत्पादन निवडा --</option>
                  @for (p of productService.products(); track p.id) {
                    <option [value]="p.id">
                      {{ p.name.mr }} (शिल्लक: {{ p.stockQuantity }})
                    </option>
                  }
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">हालचालीचा प्रकार (Type) *</label>
                  <select
                    formControlName="movementType"
                    class="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="STOCK_IN">STOCK_IN (माल आवक)</option>
                    <option value="STOCK_OUT">STOCK_OUT (काऊंटर विक्री)</option>
                    <option value="DAMAGE">DAMAGE (खराब / फुटलेला)</option>
                    <option value="ADJUSTMENT">ADJUSTMENT (प्रत्यक्ष मोजणी फेरफार)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">नग संख्या (Quantity) *</label>
                  <input
                    type="number"
                    formControlName="quantityChange"
                    min="1"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">फेरफाराचे कारण (Reason) *</label>
                <input
                  type="text"
                  formControlName="reason"
                  placeholder="उदा. शिवकाशी फॅक्टरीतून नवीन लॉट आवक / काउंटर मोजणी"
                  class="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  (click)="adjustModalOpen.set(false)"
                  class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  [disabled]="adjustForm.invalid"
                  class="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  नोंद जतन करा
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminInventoryComponent {
  inventoryService = inject(InventoryService);
  productService = inject(ProductService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  adjustModalOpen = signal<boolean>(false);

  adjustForm: FormGroup = this.fb.group({
    productId: ['', Validators.required],
    movementType: ['STOCK_IN', Validators.required],
    quantityChange: [50, [Validators.required, Validators.min(1)]],
    reason: ['दिवाळी सण नवीन साठा आवक', Validators.required]
  });

  openAdjustModal(): void {
    this.adjustModalOpen.set(true);
  }

  submitAdjustment(): void {
    if (this.adjustForm.invalid) return;

    const { productId, movementType, quantityChange, reason } = this.adjustForm.value;
    const userEmail = this.authService.currentUser()?.email || 'admin@pratikphatake.com';

    const ok = this.inventoryService.recordMovement(
      productId,
      movementType as MovementType,
      Number(quantityChange),
      reason,
      userEmail
    );

    if (ok) {
      this.toastService.success('साठा फेरफार यशस्वीरित्या नोंदवला गेला!');
      this.adjustModalOpen.set(false);
      this.adjustForm.reset({
        movementType: 'STOCK_IN',
        quantityChange: 50,
        reason: 'दिवाळी सण नवीन साठा आवक'
      });
    } else {
      this.toastService.error('त्रुटी: उत्पादन सापडले नाही.');
    }
  }
}
