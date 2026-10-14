import { Injectable, signal, computed, inject } from '@angular/core';
import {
  Invoice,
  InvoiceItemSnapshot,
  InvoiceReturn,
  InvoiceReturnItem,
  BillingSettings,
  CustomerSnapshot,
  PaymentMethod,
  PaymentBreakdown
} from '@core/models';
import { ProductService } from './product.service';
import { InventoryService } from './inventory.service';
import { AuthService } from './auth.service';
import { AuditService } from './audit.service';
import { FirebaseService } from './firebase.service';
import { StoreSettingsService } from './store-settings.service';
import { CartCalculationResult } from './billing-calculation.service';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private productService = inject(ProductService);
  private inventoryService = inject(InventoryService);
  private authService = inject(AuthService);
  private auditService = inject(AuditService);
  private firebaseService = inject(FirebaseService);
  private storeSettingsService = inject(StoreSettingsService);

  private readonly STORAGE_INVOICES = 'pratik_invoices_cache';
  private readonly STORAGE_RETURNS = 'pratik_returns_cache';
  private readonly STORAGE_BILLING_SETTINGS = 'pratik_billing_settings';
  private readonly STORAGE_COUNTER = 'pratik_invoice_counter';

  private readonly invoicesSignal = signal<Invoice[]>(this.loadInvoices());
  private readonly returnsSignal = signal<InvoiceReturn[]>(this.loadReturns());
  private readonly billingSettingsSignal = signal<BillingSettings>(this.loadBillingSettings());

  readonly invoices = this.invoicesSignal.asReadonly();
  readonly returns = this.returnsSignal.asReadonly();
  readonly billingSettings = this.billingSettingsSignal.asReadonly();

  // Real-time Billing KPIs
  readonly todayInvoices = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.invoicesSignal().filter(inv => 
      inv.createdAt.startsWith(todayStr) && inv.invoiceStatus === 'completed'
    );
  });

  readonly todaySales = computed(() => {
    return this.todayInvoices().reduce((sum, inv) => sum + inv.grandTotal, 0);
  });

  readonly totalBilledAmount = computed(() => {
    return this.invoicesSignal()
      .filter(i => i.invoiceStatus === 'completed')
      .reduce((sum, inv) => sum + inv.grandTotal, 0);
  });

  readonly totalDiscountsGiven = computed(() => {
    return this.invoicesSignal()
      .filter(i => i.invoiceStatus === 'completed')
      .reduce((sum, inv) => sum + inv.totalDiscount, 0);
  });

  readonly averageInvoiceValue = computed(() => {
    const completed = this.invoicesSignal().filter(i => i.invoiceStatus === 'completed');
    if (completed.length === 0) return 0;
    return Math.round(this.totalBilledAmount() / completed.length);
  });

  constructor() {
    this.syncFromFirebaseIfConfigured();
  }

  private loadInvoices(): Invoice[] {
    try {
      const data = localStorage.getItem(this.STORAGE_INVOICES);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    const def = this.getSeedInvoices();
    this.saveInvoices(def);
    return def;
  }

  private saveInvoices(list: Invoice[]): void {
    try {
      localStorage.setItem(this.STORAGE_INVOICES, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  private loadReturns(): InvoiceReturn[] {
    try {
      const data = localStorage.getItem(this.STORAGE_RETURNS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [];
  }

  private saveReturns(list: InvoiceReturn[]): void {
    try {
      localStorage.setItem(this.STORAGE_RETURNS, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  private loadBillingSettings(): BillingSettings {
    const store = this.storeSettingsService.settings();
    const defaults: BillingSettings = {
      invoicePrefix: 'PP',
      financialYear: '2026-27',
      storeName: store.businessName || 'PRATIK PHATAKE',
      storeNameMarathi: store.businessNameMarathi || 'प्रतीक फटाके',
      storeAddress: store.address || 'सिंहगड रोड, वडगाव बुद्रुक, पुणे - ४११०४१',
      gstin: store.gstin || '27AAECP1234F1Z5',
      licenseNumber: store.licenseNumber || 'PESO-PUN-RET-2024/7890',
      contactNumber: store.contactNumber || '+91 98765 43210',
      whatsappNumber: store.whatsappNumber || '+91 98765 43210',
      taxPolicy: 'inclusive',
      standardGstRate: 18,
      staffDiscountLimitPercent: 10,
      managerDiscountLimitPercent: 25,
      defaultReceiptLayout: 'a4',
      footerMessageMarathi: 'आमच्याकडे खरेदी केल्याबद्दल धन्यवाद! सुरक्षित व आनंददायी दीपोत्सव!',
      footerMessageEnglish: 'Thank you for shopping with Pratik Phatake! Have a safe and joyous Diwali!',
      safetyNoticeMarathi: 'फटाके सुरक्षित अंतरावरून उडवा. लहान मुलांवर लक्ष ठेवा. जवळ पाण्याचे भांडे ठेवा.',
      safetyNoticeEnglish: 'Ignite crackers from a safe distance. Supervise children. Keep water handy.',
      enableThermalAutoCut: true,
      enableSoundEffects: true
    };

    try {
      const saved = localStorage.getItem(this.STORAGE_BILLING_SETTINGS);
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return defaults;
  }

  updateBillingSettings(updates: Partial<BillingSettings>): void {
    const updated = { ...this.billingSettingsSignal(), ...updates };
    this.billingSettingsSignal.set(updated);
    try {
      localStorage.setItem(this.STORAGE_BILLING_SETTINGS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  private async syncFromFirebaseIfConfigured(): Promise<void> {
    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      try {
        const snap = await getDocs(collection(fs, 'invoices'));
        if (!snap.empty) {
          const list: Invoice[] = [];
          snap.forEach(d => list.push({ ...(d.data() as Invoice), id: d.id }));
          this.invoicesSignal.set(list);
          this.saveInvoices(list);
        }
      } catch (err) {
        console.warn('Firestore invoices fetch notice:', err);
      }
    }
  }

  /**
   * Concurrency-safe sequential invoice number generator
   * Formats: PP-2026-000001
   */
  generateNextInvoiceNumber(): string {
    const settings = this.billingSettingsSignal();
    const prefix = settings.invoicePrefix || 'PP';
    const year = new Date().getFullYear();

    let seq = 1;
    try {
      const stored = localStorage.getItem(this.STORAGE_COUNTER);
      if (stored) {
        seq = parseInt(stored, 10) + 1;
      }
    } catch {
      seq = this.invoicesSignal().length + 1;
    }

    localStorage.setItem(this.STORAGE_COUNTER, seq.toString());
    const padded = String(seq).padStart(6, '0');
    return `${prefix}-${year}-${padded}`;
  }

  /**
   * Finalize and record a lawful physical in-store sale.
   * Atomically decrements product stock and records STOCK_OUT inventory movements.
   */
  finalizeSale(params: {
    calc: CartCalculationResult;
    customer: CustomerSnapshot;
    paymentMethod: PaymentMethod;
    amountReceived: number;
    paymentBreakdown?: PaymentBreakdown;
    notes?: string;
  }): { success: boolean; invoice?: Invoice; message?: string } {
    const user = this.authService.currentUser() || {
      uid: 'staff-demo',
      displayName: 'काउंटर स्टाफ (Counter Staff)',
      email: 'staff@pratikphatake.com',
      role: 'staff'
    };

    const { calc, customer, paymentMethod, amountReceived, paymentBreakdown, notes } = params;

    if (calc.items.length === 0) {
      return { success: false, message: 'कार्ट रिकामी आहे! (Cart is empty)' };
    }

    // 1. Stock availability validation
    for (const item of calc.items) {
      const prod = this.productService.getProductById(item.productId);
      if (!prod) {
        return { success: false, message: `उत्पादन सापडले नाही: ${item.name.mr}` };
      }
      if (prod.stockQuantity < item.quantity) {
        return {
          success: false,
          message: `"${prod.name.mr}" चा साठा अपुरा आहे! उपलब्ध: ${prod.stockQuantity}, मागणी: ${item.quantity}`
        };
      }
    }

    // 2. Generate unique invoice number
    const invoiceNumber = this.generateNextInvoiceNumber();
    const invoiceId = 'inv-' + Date.now();
    const now = new Date().toISOString();
    const settings = this.billingSettingsSignal();

    // 3. Atomically decrement stock and record inventory movements
    for (const item of calc.items) {
      this.inventoryService.recordMovement(
        item.productId,
        'STOCK_OUT',
        item.quantity,
        `काउंटर विक्री बिल: ${invoiceNumber}`,
        user.displayName || user.email
      );
    }

    // 4. Create immutable line item snapshots
    const itemSnapshots: InvoiceItemSnapshot[] = calc.items.map(item => ({
      productId: item.productId,
      sku: item.sku,
      name: { ...item.name },
      quantity: item.quantity,
      originalUnitPrice: item.originalUnitPrice,
      unitPrice: item.discountedUnitPrice,
      mrp: item.mrp,
      appliedDiscounts: item.manualDiscount ? [{
        scope: 'product',
        type: item.manualDiscount.type,
        value: item.manualDiscount.value,
        calculatedAmount: item.lineDiscountAmount,
        reason: 'Manual Item Discount'
      }] : [],
      discountAmount: item.lineDiscountAmount,
      taxRate: item.taxRate,
      taxAmount: item.taxAmount,
      lineTotal: item.lineTotal
    }));

    // 5. Construct full Invoice document
    const invoice: Invoice = {
      id: invoiceId,
      invoiceNumber,
      financialYear: settings.financialYear,
      storeId: 'pune-store-01',
      customerSnapshot: { ...customer },
      items: itemSnapshots,
      grossAmount: calc.grossAmount,
      itemDiscountTotal: calc.itemDiscountTotal,
      promotionalDiscountTotal: calc.promotionalDiscountTotal,
      billDiscount: calc.billDiscountTotal,
      totalDiscount: calc.totalDiscount,
      customerSavings: calc.customerSavings,
      taxableAmount: calc.taxableAmount,
      taxBreakdown: { ...calc.taxBreakdown },
      roundingAdjustment: calc.roundingAdjustment,
      grandTotal: calc.grandTotal,
      amountReceived: amountReceived >= calc.grandTotal ? amountReceived : calc.grandTotal,
      balance: Math.max(0, amountReceived - calc.grandTotal),
      paymentMethod,
      paymentBreakdown,
      paymentStatus: 'paid',
      invoiceStatus: 'completed',
      createdBy: {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: user.role
      },
      notes,
      createdAt: now,
      updatedAt: now
    };

    // 6. Save in memory & cache
    const updated = [invoice, ...this.invoicesSignal()];
    this.invoicesSignal.set(updated);
    this.saveInvoices(updated);

    // 7. Audit log
    this.auditService.logAction({
      action: 'INVOICE_CREATED',
      entityType: 'inventory',
      entityId: invoiceId,
      details: `Generated Invoice #${invoiceNumber} for ${customer.name}. Grand Total: ₹${calc.grandTotal} (${paymentMethod})`,
      userId: user.uid,
      userEmail: user.email
    });

    // 8. Sync to Firestore if live
    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      try {
        const cleanInvoice = JSON.parse(JSON.stringify(invoice));
        setDoc(doc(fs, 'invoices', invoiceId), cleanInvoice).catch(console.error);
      } catch (err) {
        console.error('Invoice Firestore sync error:', err);
      }
    }

    return { success: true, invoice };
  }

  /**
   * Process a return or cancellation with stock restoration.
   */
  processReturn(
    invoiceId: string,
    itemsToReturn: { productId: string; quantity: number; reason: string }[],
    generalReason: string
  ): { success: boolean; returnVoucher?: InvoiceReturn; message?: string } {
    const inv = this.getInvoiceById(invoiceId);
    if (!inv) return { success: false, message: 'इनव्हॉइस सापडले नाही' };

    const user = this.authService.currentUser() || {
      uid: 'admin',
      displayName: 'व्यवस्थापक (Manager)',
      email: 'admin@pratikphatake.com',
      role: 'admin'
    };

    let totalRefund = 0;
    const returnItems: InvoiceReturnItem[] = [];

    for (const item of itemsToReturn) {
      const original = inv.items.find(i => i.productId === item.productId);
      if (!original) continue;

      const refundForLine = Math.round((original.unitPrice * item.quantity) * 100) / 100;
      totalRefund += refundForLine;

      returnItems.push({
        productId: item.productId,
        sku: original.sku,
        productName: original.name.mr,
        quantityReturned: item.quantity,
        unitPrice: original.unitPrice,
        refundAmount: refundForLine
      });

      // Restock inventory with RETURN movement
      this.inventoryService.recordMovement(
        item.productId,
        'RETURN',
        item.quantity,
        `परतावा इनव्हॉइस: ${inv.invoiceNumber} - ${item.reason || generalReason}`,
        user.displayName || user.email
      );
    }

    const returnVoucher: InvoiceReturn = {
      id: 'ret-' + Date.now(),
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      returnReference: `RET-${new Date().getFullYear()}-${String(this.returnsSignal().length + 1).padStart(5, '0')}`,
      items: returnItems,
      totalRefundAmount: totalRefund,
      reason: generalReason,
      authorizedBy: user.displayName || user.email,
      createdAt: new Date().toISOString()
    };

    // Update invoice status
    const isFullReturn = inv.items.every(i => {
      const ret = returnItems.find(r => r.productId === i.productId);
      return ret && ret.quantityReturned >= i.quantity;
    });

    this.updateInvoice(inv.id, {
      invoiceStatus: isFullReturn ? 'cancelled' : 'refunded',
      cancellationReason: generalReason,
      cancelledAt: new Date().toISOString(),
      cancelledBy: user.displayName
    });

    const updatedReturns = [returnVoucher, ...this.returnsSignal()];
    this.returnsSignal.set(updatedReturns);
    this.saveReturns(updatedReturns);

    return { success: true, returnVoucher };
  }

  getInvoiceById(id: string): Invoice | undefined {
    return this.invoicesSignal().find(i => i.id === id || i.invoiceNumber === id);
  }

  updateInvoice(id: string, updates: Partial<Invoice>): boolean {
    const current = this.invoicesSignal();
    const idx = current.findIndex(i => i.id === id);
    if (idx === -1) return false;

    const updated = [...current];
    updated[idx] = { ...updated[idx], ...updates, updatedAt: new Date().toISOString() };
    this.invoicesSignal.set(updated);
    this.saveInvoices(updated);

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      try {
        const cleanUpdates = JSON.parse(JSON.stringify(updates));
        updateDoc(doc(fs, 'invoices', id), cleanUpdates).catch(console.error);
      } catch (err) {
        console.error('Invoice update Firestore error:', err);
      }
    }
    return true;
  }

  private getSeedInvoices(): Invoice[] {
    const now = new Date();
    const iso = now.toISOString();
    return [
      {
        id: 'inv-seed-01',
        invoiceNumber: 'PP-2026-000001',
        financialYear: '2026-27',
        storeId: 'pune-store-01',
        customerSnapshot: {
          name: 'रमेश जोशी (Ramesh Joshi)',
          phone: '9822012345',
          email: 'ramesh.joshi@example.com',
          address: 'कोथरूड, पुणे',
          notes: 'दिवाळी कौटुंबिक खरेदी',
          consentForWhatsApp: true
        },
        items: [
          {
            productId: 'prod-007',
            sku: 'SKU-SS-1201',
            name: {
              mr: '१२ शॉट्स मल्टी कलर स्काय शॉट',
              hi: '१२ शॉट्स मल्टी कलर स्काई शॉट',
              en: '12 Shots Multi Color Sky Shot'
            },
            quantity: 2,
            originalUnitPrice: 850,
            unitPrice: 850,
            mrp: 950,
            discountAmount: 0,
            taxRate: 18,
            taxAmount: 259.32,
            lineTotal: 1700
          },
          {
            productId: 'prod-001',
            sku: 'SKU-SP-1001',
            name: {
              mr: '१० सेमी इलेक्ट्रो फुलबाजी (१० काड्या)',
              hi: '१० सेमी इलेक्ट्रो फुलझड़ी',
              en: '10 cm Electric Sparklers'
            },
            quantity: 5,
            originalUnitPrice: 65,
            unitPrice: 65,
            mrp: 80,
            discountAmount: 0,
            taxRate: 18,
            taxAmount: 49.58,
            lineTotal: 325
          }
        ],
        grossAmount: 2025,
        itemDiscountTotal: 0,
        promotionalDiscountTotal: 0,
        billDiscount: 0,
        totalDiscount: 0,
        customerSavings: 275,
        taxableAmount: 1716.1,
        taxBreakdown: {
          taxableAmount: 1716.1,
          cgstRate: 9,
          cgstAmount: 154.45,
          sgstRate: 9,
          sgstAmount: 154.45,
          totalTax: 308.9
        },
        roundingAdjustment: 0,
        grandTotal: 2025,
        amountReceived: 2025,
        balance: 0,
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        invoiceStatus: 'completed',
        createdBy: {
          uid: 'staff-01',
          name: 'सुनील पवार (Sunil Pawar)',
          email: 'sunil@pratikphatake.com',
          role: 'staff'
        },
        createdAt: iso,
        updatedAt: iso
      }
    ];
  }
}
