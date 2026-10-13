import { AppliedDiscount } from './discount.model';

export interface InquiryCartItem {
  productId: string;
  sku: string;
  name: {
    mr: string;
    hi: string;
    en: string;
  };
  image: string;
  categoryName?: string;
  quantity: number;
  indicativeUnitPrice: number;
  soundLevel?: string;
  piecesPerBox?: number;
}

export type CartItem = InquiryCartItem;

export interface PosCartItem {
  productId: string;
  sku: string;
  name: {
    mr: string;
    hi: string;
    en: string;
  };
  image: string;
  categoryName?: string;
  categoryId?: string;
  originalUnitPrice: number;
  mrp?: number;
  quantity: number;
  availableStock: number;
  manualDiscount?: {
    type: 'fixed' | 'percentage';
    value: number;
  };
  discountedUnitPrice: number;
  lineDiscountAmount: number;
  taxRate: number; // e.g. 18 for 18% GST
  taxAmount: number;
  lineTotal: number;
}

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'split';

export interface PaymentBreakdown {
  cash: number;
  upi: number;
  card: number;
  referenceNotes?: string;
}

export interface CustomerSnapshot {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  consentForWhatsApp?: boolean;
}
