import { Injectable, signal, computed, inject } from '@angular/core';
import { Product, PosCartItem, CustomerSnapshot, PaymentMethod, PaymentBreakdown, AppliedDiscount, Offer } from '@core/models';
import { BillingCalculationService, CartCalculationResult } from './billing-calculation.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PosCartService {
  private calcService = inject(BillingCalculationService);
  private toastService = inject(ToastService);

  private readonly itemsSignal = signal<PosCartItem[]>([]);
  private readonly customerSignal = signal<CustomerSnapshot>({
    name: 'Walk-in Customer (काउंटर ग्राहक)',
    phone: '',
    email: '',
    address: '',
    notes: '',
    consentForWhatsApp: false
  });
  private readonly billDiscountSignal = signal<AppliedDiscount | null>(null);
  private readonly appliedOffersSignal = signal<Offer[]>([]);
  private readonly paymentMethodSignal = signal<PaymentMethod>('cash');
  private readonly paymentBreakdownSignal = signal<PaymentBreakdown>({
    cash: 0,
    upi: 0,
    card: 0
  });
  private readonly amountReceivedSignal = signal<number>(0);
  private readonly taxPolicySignal = signal<'inclusive' | 'exclusive'>('inclusive');
  private readonly standardGstRateSignal = signal<number>(18);

  // Readonly signals
  readonly items = this.itemsSignal.asReadonly();
  readonly customer = this.customerSignal.asReadonly();
  readonly billDiscount = this.billDiscountSignal.asReadonly();
  readonly appliedOffers = this.appliedOffersSignal.asReadonly();
  readonly paymentMethod = this.paymentMethodSignal.asReadonly();
  readonly paymentBreakdown = this.paymentBreakdownSignal.asReadonly();
  readonly amountReceived = this.amountReceivedSignal.asReadonly();
  readonly taxPolicy = this.taxPolicySignal.asReadonly();
  readonly standardGstRate = this.standardGstRateSignal.asReadonly();

  // Computeds
  readonly itemCount = computed(() => this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0));
  readonly uniqueItemCount = computed(() => this.itemsSignal().length);
  readonly isEmpty = computed(() => this.itemsSignal().length === 0);

  readonly totals = computed<CartCalculationResult>(() => {
    return this.calcService.calculateCartTotals(
      this.itemsSignal(),
      this.billDiscountSignal(),
      this.appliedOffersSignal(),
      this.taxPolicySignal(),
      this.standardGstRateSignal()
    );
  });

  readonly changeDue = computed(() => {
    const received = this.amountReceivedSignal();
    const grandTotal = this.totals().grandTotal;
    return Math.max(0, this.calcService.round(received - grandTotal));
  });

  /**
   * Add a product to the billing cart with strict stock limit enforcement.
   */
  addItem(product: Product, quantity = 1): { success: boolean; message?: string } {
    if (product.stockQuantity <= 0) {
      const msg = `"${product.name.mr}" चा साठा शिल्लक नाही! (Out of stock)`;
      this.toastService.warning(msg);
      return { success: false, message: msg };
    }

    const currentItems = this.itemsSignal();
    const existingIndex = currentItems.findIndex(i => i.productId === product.id);

    if (existingIndex > -1) {
      const existing = currentItems[existingIndex];
      const newQty = existing.quantity + quantity;

      if (newQty > product.stockQuantity) {
        const msg = `कमाल उपलब्ध साठा ${product.stockQuantity} नग आहे. (Stock limit reached)`;
        this.toastService.warning(msg);
        return { success: false, message: msg };
      }

      const updated = [...currentItems];
      updated[existingIndex] = {
        ...existing,
        quantity: newQty,
        availableStock: product.stockQuantity
      };
      this.itemsSignal.set(updated);
      this.autoSyncAmountReceived();
      return { success: true };
    }

    // New item
    if (quantity > product.stockQuantity) {
      const msg = `केवळ ${product.stockQuantity} नग शिल्लक आहेत.`;
      this.toastService.warning(msg);
      return { success: false, message: msg };
    }

    const newItem: PosCartItem = {
      productId: product.id,
      sku: product.sku,
      name: { ...product.name },
      image: product.images[0] || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400',
      categoryName: product.categoryName,
      categoryId: product.categoryId,
      originalUnitPrice: product.retailPrice,
      mrp: product.retailPrice,
      quantity,
      availableStock: product.stockQuantity,
      discountedUnitPrice: product.retailPrice,
      lineDiscountAmount: 0,
      taxRate: this.standardGstRateSignal(),
      taxAmount: 0,
      lineTotal: product.retailPrice * quantity
    };

    this.itemsSignal.set([newItem, ...currentItems]);
    this.autoSyncAmountReceived();
    return { success: true };
  }

  updateQuantity(productId: string, quantity: number): { success: boolean; message?: string } {
    const current = this.itemsSignal();
    const idx = current.findIndex(i => i.productId === productId);
    if (idx === -1) return { success: false };

    if (quantity <= 0) {
      this.removeItem(productId);
      return { success: true };
    }

    const item = current[idx];
    if (quantity > item.availableStock) {
      const msg = `उपलब्ध साठा फक्त ${item.availableStock} नग आहे!`;
      this.toastService.warning(msg);
      return { success: false, message: msg };
    }

    const updated = [...current];
    updated[idx] = { ...item, quantity };
    this.itemsSignal.set(updated);
    this.autoSyncAmountReceived();
    return { success: true };
  }

  removeItem(productId: string): void {
    const updated = this.itemsSignal().filter(i => i.productId !== productId);
    this.itemsSignal.set(updated);
    this.autoSyncAmountReceived();
  }

  setItemDiscount(productId: string, discount?: { type: 'fixed' | 'percentage'; value: number }): void {
    const current = this.itemsSignal();
    const idx = current.findIndex(i => i.productId === productId);
    if (idx === -1) return;

    const updated = [...current];
    updated[idx] = {
      ...updated[idx],
      manualDiscount: discount && discount.value > 0 ? discount : undefined
    };
    this.itemsSignal.set(updated);
    this.autoSyncAmountReceived();
  }

  setBillDiscount(discount: AppliedDiscount | null): void {
    this.billDiscountSignal.set(discount);
    this.autoSyncAmountReceived();
  }

  applyOffer(offer: Offer): { success: boolean; message: string } {
    const current = this.appliedOffersSignal();
    if (current.some(o => o.id === offer.id)) {
      return { success: false, message: 'ही ऑफर आधीच लागू आहे (Offer already applied)' };
    }

    if (!offer.stackingAllowed && current.length > 0) {
      // Replace non-stacking offers
      this.appliedOffersSignal.set([offer]);
      this.autoSyncAmountReceived();
      return { success: true, message: `ऑफर "${offer.title.mr}" लागू केली!` };
    }

    this.appliedOffersSignal.set([...current, offer]);
    this.autoSyncAmountReceived();
    return { success: true, message: `ऑफर "${offer.title.mr}" लागू केली!` };
  }

  removeOffer(offerId: string): void {
    const updated = this.appliedOffersSignal().filter(o => o.id !== offerId);
    this.appliedOffersSignal.set(updated);
    this.autoSyncAmountReceived();
  }

  setCustomer(customer: Partial<CustomerSnapshot>): void {
    this.customerSignal.update(curr => ({ ...curr, ...customer }));
  }

  setPaymentMethod(method: PaymentMethod): void {
    this.paymentMethodSignal.set(method);
    if (method === 'cash') {
      this.amountReceivedSignal.set(this.totals().grandTotal);
    }
  }

  setAmountReceived(amount: number): void {
    this.amountReceivedSignal.set(Math.max(0, amount));
  }

  setPaymentBreakdown(breakdown: PaymentBreakdown): void {
    this.paymentBreakdownSignal.set(breakdown);
    const sum = (breakdown.cash || 0) + (breakdown.upi || 0) + (breakdown.card || 0);
    this.amountReceivedSignal.set(sum);
  }

  setTaxConfig(policy: 'inclusive' | 'exclusive', gstRate = 18): void {
    this.taxPolicySignal.set(policy);
    this.standardGstRateSignal.set(gstRate);
  }

  private autoSyncAmountReceived(): void {
    // If cash mode, auto-fill tendered amount with current grandTotal for frictionless cashier speed
    if (this.paymentMethodSignal() === 'cash') {
      this.amountReceivedSignal.set(this.totals().grandTotal);
    }
  }

  clearCart(): void {
    this.itemsSignal.set([]);
    this.billDiscountSignal.set(null);
    this.appliedOffersSignal.set([]);
    this.customerSignal.set({
      name: 'Walk-in Customer (काउंटर ग्राहक)',
      phone: '',
      email: '',
      address: '',
      notes: '',
      consentForWhatsApp: false
    });
    this.paymentMethodSignal.set('cash');
    this.amountReceivedSignal.set(0);
    this.paymentBreakdownSignal.set({ cash: 0, upi: 0, card: 0 });
  }
}
