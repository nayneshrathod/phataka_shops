import { Injectable } from '@angular/core';
import { PosCartItem, AppliedDiscount, Offer, TaxBreakdown } from '@core/models';

export interface CartCalculationResult {
  grossAmount: number;
  itemDiscountTotal: number;
  promotionalDiscountTotal: number;
  billDiscountTotal: number;
  totalDiscount: number;
  taxableAmount: number;
  taxBreakdown: TaxBreakdown;
  roundingAdjustment: number;
  grandTotal: number;
  customerSavings: number;
  items: PosCartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class BillingCalculationService {
  /**
   * Financial 2-decimal place precision rounding (minor unit - paise protection)
   */
  round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  /**
   * Round to nearest whole integer rupee
   */
  roundToRupee(value: number): number {
    return Math.round(value);
  }

  /**
   * Recalculates an individual line item based on quantity, manual item discount, and tax rate.
   */
  calculateLineItem(item: PosCartItem, taxPolicy: 'inclusive' | 'exclusive' = 'inclusive'): PosCartItem {
    const qty = Math.max(1, item.quantity);
    const unitPrice = item.originalUnitPrice;
    const baseSubtotal = this.round(qty * unitPrice);

    let lineDiscount = 0;
    if (item.manualDiscount && item.manualDiscount.value > 0) {
      if (item.manualDiscount.type === 'percentage') {
        const pct = Math.min(100, Math.max(0, item.manualDiscount.value));
        lineDiscount = this.round(baseSubtotal * (pct / 100));
      } else {
        lineDiscount = this.round(Math.min(baseSubtotal, item.manualDiscount.value));
      }
    }

    const discountedSubtotal = Math.max(0, this.round(baseSubtotal - lineDiscount));
    const discountedUnitPrice = qty > 0 ? this.round(discountedSubtotal / qty) : 0;

    let taxAmount = 0;
    const rate = Math.max(0, item.taxRate || 0);

    if (rate > 0) {
      if (taxPolicy === 'inclusive') {
        // Price includes tax: Tax = Subtotal - (Subtotal / (1 + Rate / 100))
        taxAmount = this.round(discountedSubtotal - (discountedSubtotal / (1 + rate / 100)));
      } else {
        // Tax-exclusive: Tax is added on top of discounted subtotal
        taxAmount = this.round(discountedSubtotal * (rate / 100));
      }
    }

    const lineTotal = taxPolicy === 'inclusive' 
      ? discountedSubtotal 
      : this.round(discountedSubtotal + taxAmount);

    return {
      ...item,
      quantity: qty,
      discountedUnitPrice,
      lineDiscountAmount: lineDiscount,
      taxAmount,
      lineTotal
    };
  }

  /**
   * Evaluates promotional offer discounts across eligible items and minimum thresholds.
   */
  evaluateOfferDiscount(
    items: PosCartItem[],
    offer: Offer,
    currentGross: number
  ): number {
    if (!offer.active) return 0;
    if (currentGross < offer.minimumAmount) return 0;

    // Check date validity
    const now = new Date();
    if (offer.startDate && new Date(offer.startDate) > now) return 0;
    if (offer.endDate && new Date(offer.endDate) < now) return 0;

    let eligibleBase = 0;

    if (offer.offerType === 'category_discount' && offer.eligibleCategoryIds && offer.eligibleCategoryIds.length > 0) {
      eligibleBase = items
        .filter(i => i.categoryId && offer.eligibleCategoryIds?.includes(i.categoryId))
        .reduce((sum, i) => sum + (i.quantity * i.discountedUnitPrice), 0);
    } else if (offer.offerType === 'bill_discount' || offer.offerType === 'festival_special' || offer.offerType === 'coupon') {
      eligibleBase = items.reduce((sum, i) => sum + (i.quantity * i.discountedUnitPrice), 0);
    }

    if (eligibleBase <= 0) return 0;

    let discount = 0;
    if (offer.discountType === 'percentage') {
      const pct = Math.min(100, Math.max(0, offer.discountValue));
      discount = this.round(eligibleBase * (pct / 100));
    } else {
      discount = this.round(Math.min(eligibleBase, offer.discountValue));
    }

    if (offer.maximumDiscount && offer.maximumDiscount > 0) {
      discount = Math.min(discount, offer.maximumDiscount);
    }

    return discount;
  }

  /**
   * Deterministic full cart recalculation engine.
   */
  calculateCartTotals(
    rawItems: PosCartItem[],
    billDiscount: AppliedDiscount | null,
    appliedOffers: Offer[] = [],
    taxPolicy: 'inclusive' | 'exclusive' = 'inclusive',
    standardGstRate: number = 18
  ): CartCalculationResult {
    // 1. Process line items with item-level discounts
    const recalculatedItems = rawItems.map(item => this.calculateLineItem(item, taxPolicy));

    // 2. Compute gross amount (Quantity * Original Unit Price)
    const grossAmount = this.round(
      recalculatedItems.reduce((sum, item) => sum + (item.quantity * item.originalUnitPrice), 0)
    );

    // 3. Compute total item-level discounts
    const itemDiscountTotal = this.round(
      recalculatedItems.reduce((sum, item) => sum + item.lineDiscountAmount, 0)
    );

    let runningSubtotal = Math.max(0, this.round(grossAmount - itemDiscountTotal));

    // 4. Compute promotional offer discounts
    let promotionalDiscountTotal = 0;
    // If stacking is not allowed on all, only the first offer applies unless all have stackingAllowed
    const canStack = appliedOffers.length <= 1 || appliedOffers.every(o => o.stackingAllowed);
    const offersToProcess = canStack ? appliedOffers : (appliedOffers.length > 0 ? [appliedOffers[0]] : []);

    for (const offer of offersToProcess) {
      const offerDiscount = this.evaluateOfferDiscount(recalculatedItems, offer, runningSubtotal);
      promotionalDiscountTotal = this.round(promotionalDiscountTotal + offerDiscount);
      runningSubtotal = Math.max(0, this.round(runningSubtotal - offerDiscount));
    }

    // 5. Compute bill-level discount
    let billDiscountTotal = 0;
    if (billDiscount && billDiscount.value > 0) {
      if (billDiscount.type === 'percentage') {
        const pct = Math.min(100, Math.max(0, billDiscount.value));
        billDiscountTotal = this.round(runningSubtotal * (pct / 100));
      } else {
        billDiscountTotal = this.round(Math.min(runningSubtotal, billDiscount.value));
      }
      runningSubtotal = Math.max(0, this.round(runningSubtotal - billDiscountTotal));
    }

    const totalDiscount = this.round(itemDiscountTotal + promotionalDiscountTotal + billDiscountTotal);

    // 6. Tax Breakdown (CGST & SGST 50/50 split of GST rate)
    const effectiveGstRate = standardGstRate > 0 ? standardGstRate : 18;
    const halfRate = this.round(effectiveGstRate / 2);

    let taxableAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let totalTax = 0;
    let preRoundTotal = 0;

    if (taxPolicy === 'inclusive') {
      // In tax-inclusive mode, runningSubtotal already contains the tax
      taxableAmount = this.round(runningSubtotal / (1 + effectiveGstRate / 100));
      totalTax = this.round(runningSubtotal - taxableAmount);
      cgstAmount = this.round(totalTax / 2);
      sgstAmount = this.round(totalTax - cgstAmount); // Guard against odd paise split
      preRoundTotal = runningSubtotal;
    } else {
      // In tax-exclusive mode, tax is calculated on top of taxableAmount
      taxableAmount = runningSubtotal;
      cgstAmount = this.round(taxableAmount * (halfRate / 100));
      sgstAmount = this.round(taxableAmount * (halfRate / 100));
      totalTax = this.round(cgstAmount + sgstAmount);
      preRoundTotal = this.round(taxableAmount + totalTax);
    }

    // 7. Rounding Adjustment to nearest rupee
    const roundedGrandTotal = Math.max(0, this.roundToRupee(preRoundTotal));
    const roundingAdjustment = this.round(roundedGrandTotal - preRoundTotal);

    // 8. Total Customer Savings (compared to MRP / retail prices + discounts)
    const mrpBase = recalculatedItems.reduce((sum, item) => {
      const mrp = (item.mrp && item.mrp > item.originalUnitPrice) ? item.mrp : item.originalUnitPrice;
      return sum + (item.quantity * mrp);
    }, 0);
    const customerSavings = Math.max(0, this.round(mrpBase - roundedGrandTotal));

    return {
      grossAmount,
      itemDiscountTotal,
      promotionalDiscountTotal,
      billDiscountTotal,
      totalDiscount,
      taxableAmount,
      taxBreakdown: {
        taxableAmount,
        cgstRate: halfRate,
        cgstAmount,
        sgstRate: halfRate,
        sgstAmount,
        totalTax
      },
      roundingAdjustment,
      grandTotal: roundedGrandTotal,
      customerSavings,
      items: recalculatedItems
    };
  }
}
