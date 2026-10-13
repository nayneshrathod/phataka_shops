import { TestBed } from '@angular/core/testing';
import { BillingCalculationService } from './billing-calculation.service';
import { PosCartItem, Offer } from '@core/models';

describe('BillingCalculationService', () => {
  let service: BillingCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingCalculationService);
  });

  it('should round numbers to 2 decimal places with financial precision', () => {
    expect(service.round(123.456)).toBe(123.46);
    expect(service.round(123.454)).toBe(123.45);
    expect(service.round(10.005)).toBe(10.01);
  });

  it('should calculate line item with percentage discount correctly', () => {
    const item: PosCartItem = {
      productId: 'p1',
      sku: 'SKU-01',
      name: { mr: 'फुलबाजी', hi: 'फुलझड़ी', en: 'Sparklers' },
      image: '',
      originalUnitPrice: 100,
      quantity: 5,
      availableStock: 20,
      manualDiscount: { type: 'percentage', value: 10 },
      discountedUnitPrice: 100,
      lineDiscountAmount: 0,
      taxRate: 18,
      taxAmount: 0,
      lineTotal: 500
    };

    const calculated = service.calculateLineItem(item, 'inclusive');
    // Subtotal = 500, 10% discount = 50, discountedSubtotal = 450
    expect(calculated.lineDiscountAmount).toBe(50);
    expect(calculated.discountedUnitPrice).toBe(90);
    expect(calculated.lineTotal).toBe(450);
    // In inclusive mode: taxAmount = 450 - (450 / 1.18) = 68.64
    expect(calculated.taxAmount).toBe(68.64);
  });

  it('should calculate cart totals with tax-inclusive model and round-off', () => {
    const items: PosCartItem[] = [
      {
        productId: 'p1',
        sku: 'SKU-01',
        name: { mr: 'अनार', hi: 'अनार', en: 'Flowerpot' },
        image: '',
        originalUnitPrice: 250,
        quantity: 2,
        availableStock: 50,
        discountedUnitPrice: 250,
        lineDiscountAmount: 0,
        taxRate: 18,
        taxAmount: 0,
        lineTotal: 500
      }
    ];

    const result = service.calculateCartTotals(items, null, [], 'inclusive', 18);
    expect(result.grossAmount).toBe(500);
    expect(result.totalDiscount).toBe(0);
    expect(result.grandTotal).toBe(500);
    expect(result.taxBreakdown.cgstRate).toBe(9);
    expect(result.taxBreakdown.sgstRate).toBe(9);
    expect(result.taxBreakdown.totalTax).toBe(76.27);
  });

  it('should apply promotional coupon discount when eligible threshold is met', () => {
    const items: PosCartItem[] = [
      {
        productId: 'p1',
        sku: 'SKU-01',
        name: { mr: 'स्काय शॉट्स', hi: 'स्काई शॉट्स', en: 'Sky Shots' },
        image: '',
        originalUnitPrice: 1000,
        quantity: 4,
        availableStock: 20,
        discountedUnitPrice: 1000,
        lineDiscountAmount: 0,
        taxRate: 18,
        taxAmount: 0,
        lineTotal: 4000
      }
    ];

    const offer: Offer = {
      id: 'off-test',
      code: 'DIWALI10',
      title: { mr: 'दिवाळी १०%', hi: 'दीवाली १०%', en: 'Diwali 10%' },
      description: { mr: '१०% सवलत', hi: '१०% छूट', en: '10% off' },
      offerType: 'bill_discount',
      discountType: 'percentage',
      discountValue: 10,
      minimumAmount: 3000,
      maximumDiscount: 500,
      startDate: '2020-01-01',
      endDate: '2030-12-31',
      stackingAllowed: false,
      usageCount: 0,
      active: true
    };

    const result = service.calculateCartTotals(items, null, [offer], 'inclusive', 18);
    expect(result.grossAmount).toBe(4000);
    // 10% of 4000 = 400, cap is 500, so 400 applied
    expect(result.promotionalDiscountTotal).toBe(400);
    expect(result.grandTotal).toBe(3600);
  });

  it('should not allow grandTotal to drop below zero', () => {
    const items: PosCartItem[] = [
      {
        productId: 'p1',
        sku: 'SKU-01',
        name: { mr: 'फुलबाजी', hi: 'फुलझड़ी', en: 'Sparklers' },
        image: '',
        originalUnitPrice: 50,
        quantity: 1,
        availableStock: 10,
        discountedUnitPrice: 50,
        lineDiscountAmount: 0,
        taxRate: 18,
        taxAmount: 0,
        lineTotal: 50
      }
    ];

    const bigDiscount = {
      scope: 'bill' as const,
      type: 'fixed' as const,
      value: 1000,
      calculatedAmount: 0,
      reason: 'Huge manual discount'
    };

    const result = service.calculateCartTotals(items, bigDiscount, [], 'inclusive', 18);
    expect(result.grandTotal).toBe(0);
    expect(result.billDiscountTotal).toBe(50); // Capped at subtotal
  });
});
