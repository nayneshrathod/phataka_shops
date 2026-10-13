import { CustomerSnapshot, PaymentMethod, PaymentBreakdown } from './cart.model';
import { AppliedDiscount } from './discount.model';

export type PaymentStatus = 'paid' | 'partial' | 'refunded';
export type InvoiceStatus = 'completed' | 'cancelled' | 'refunded';

export interface InvoiceItemSnapshot {
  productId: string;
  sku: string;
  name: {
    mr: string;
    hi: string;
    en: string;
  };
  quantity: number;
  originalUnitPrice: number;
  unitPrice: number;
  mrp?: number;
  appliedDiscounts?: AppliedDiscount[];
  discountAmount: number;
  taxRate: number; // e.g. 18
  taxAmount: number;
  lineTotal: number;
}

export interface TaxBreakdown {
  taxableAmount: number;
  cgstRate: number; // e.g. 9
  cgstAmount: number;
  sgstRate: number; // e.g. 9
  sgstAmount: number;
  totalTax: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. PP-2026-000001
  financialYear: string; // e.g. 2026-27
  storeId: string;
  customerId?: string;
  customerSnapshot: CustomerSnapshot;
  items: InvoiceItemSnapshot[];
  
  // Amounts
  grossAmount: number;
  itemDiscountTotal: number;
  promotionalDiscountTotal: number;
  billDiscount: number;
  totalDiscount: number;
  customerSavings: number;
  
  // Tax & Rounding
  taxableAmount: number;
  taxBreakdown: TaxBreakdown;
  roundingAdjustment: number;
  grandTotal: number;
  
  // Payments
  amountReceived: number;
  balance: number;
  paymentMethod: PaymentMethod;
  paymentBreakdown?: PaymentBreakdown;
  paymentStatus: PaymentStatus;
  invoiceStatus: InvoiceStatus;
  
  // Metadata & Audit
  createdBy: {
    uid: string;
    name: string;
    email: string;
    role: string;
  };
  idempotencyKey?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceReturnItem {
  productId: string;
  sku: string;
  productName: string;
  quantityReturned: number;
  unitPrice: number;
  refundAmount: number;
}

export interface InvoiceReturn {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  returnReference: string; // e.g. RET-2026-00001
  items: InvoiceReturnItem[];
  totalRefundAmount: number;
  reason: string;
  authorizedBy: string;
  createdAt: string;
}

export interface InvoiceCounter {
  storeId: string;
  financialYear: string;
  nextSequence: number;
}

export interface BillingAuditLog {
  id: string;
  invoiceId: string;
  invoiceNumber?: string;
  action: 'INVOICE_CREATED' | 'INVOICE_CANCELLED' | 'INVOICE_RETURNED' | 'DISCOUNT_OVERRIDE' | 'SETTINGS_CHANGED';
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  performedBy: string;
  timestamp: string;
}

export interface BillingSettings {
  invoicePrefix: string;
  financialYear: string;
  storeName: string;
  storeNameMarathi: string;
  storeAddress: string;
  gstin: string;
  licenseNumber: string;
  contactNumber: string;
  whatsappNumber: string;
  taxPolicy: 'inclusive' | 'exclusive';
  standardGstRate: number; // e.g. 18
  staffDiscountLimitPercent: number; // e.g. 10
  managerDiscountLimitPercent: number; // e.g. 25
  defaultReceiptLayout: 'a4' | 'thermal_80mm' | 'thermal_58mm' | 'whatsapp';
  footerMessageMarathi: string;
  footerMessageEnglish: string;
  safetyNoticeMarathi: string;
  safetyNoticeEnglish: string;
  enableThermalAutoCut: boolean;
  enableSoundEffects: boolean;
}
