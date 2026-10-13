export type DiscountType = 'fixed' | 'percentage';
export type DiscountScope = 'product' | 'bill';

export type OfferType = 'bill_discount' | 'category_discount' | 'festival_special' | 'coupon';

export interface AppliedDiscount {
  id?: string;
  scope: DiscountScope;
  type: DiscountType;
  value: number; // e.g. 10 for 10% or 100 for ₹100
  calculatedAmount: number;
  reason: string;
  code?: string;
  authorizedBy?: string;
}

export interface Offer {
  id: string;
  code: string;
  title: {
    mr: string;
    hi: string;
    en: string;
  };
  description: {
    mr: string;
    hi: string;
    en: string;
  };
  offerType: OfferType;
  discountType: DiscountType;
  discountValue: number;
  minimumAmount: number;
  maximumDiscount?: number;
  startDate: string;
  endDate: string;
  eligibleCategoryIds?: string[];
  eligibleProductIds?: string[];
  stackingAllowed: boolean;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
}
