import { TestBed } from '@angular/core/testing';
import { PosCartService } from './pos-cart.service';
import { Product } from '@core/models';

describe('PosCartService', () => {
  let service: PosCartService;

  const mockProduct: Product = {
    id: 'prod-test-01',
    sku: 'SKU-TEST-01',
    slug: 'test-sparkler',
    name: { mr: 'टेस्ट फुलबाजी', hi: 'टेस्ट फुलझड़ी', en: 'Test Sparkler' },
    description: { mr: 'वर्णन', hi: 'विवरण', en: 'Description' },
    categoryId: 'cat-sparklers',
    images: ['https://example.com/test.jpg'],
    retailPrice: 150,
    stockQuantity: 10,
    lowStockThreshold: 2,
    manufacturer: 'Standard Fireworks',
    safetyInformation: { mr: 'सुरक्षा', hi: 'सुरक्षा', en: 'Safety' },
    complianceStatus: 'green_cracker',
    featured: true,
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosCartService);
    service.clearCart();
  });

  it('should initialize with an empty cart', () => {
    expect(service.isEmpty()).toBe(true);
    expect(service.itemCount()).toBe(0);
    expect(service.totals().grandTotal).toBe(0);
  });

  it('should add item and calculate gross total', () => {
    const res = service.addItem(mockProduct, 2);
    expect(res.success).toBe(true);
    expect(service.itemCount()).toBe(2);
    expect(service.totals().grossAmount).toBe(300);
    expect(service.totals().grandTotal).toBe(300);
  });

  it('should increment existing item quantity when added again', () => {
    service.addItem(mockProduct, 2);
    service.addItem(mockProduct, 3);
    expect(service.uniqueItemCount()).toBe(1);
    expect(service.itemCount()).toBe(5);
    expect(service.totals().grossAmount).toBe(750);
  });

  it('should prevent adding more items than available physical stock', () => {
    // mockProduct has stockQuantity: 10
    const res = service.addItem(mockProduct, 15);
    expect(res.success).toBe(false);
    expect(service.isEmpty()).toBe(true);

    // Add 8 then try to add 5 more (8 + 5 = 13 > 10)
    service.addItem(mockProduct, 8);
    const res2 = service.addItem(mockProduct, 5);
    expect(res2.success).toBe(false);
    expect(service.itemCount()).toBe(8);
  });

  it('should remove item when quantity set to 0 or removeItem called', () => {
    service.addItem(mockProduct, 2);
    expect(service.itemCount()).toBe(2);

    service.removeItem(mockProduct.id);
    expect(service.isEmpty()).toBe(true);
  });

  it('should calculate change due correctly for cash payment', () => {
    service.addItem(mockProduct, 2); // 300
    service.setPaymentMethod('cash');
    service.setAmountReceived(500);

    expect(service.changeDue()).toBe(200);
  });
});
