import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { TranslationService } from '@core/i18n/translation.service';
import { ProductService } from '@core/services/product.service';
import { InquiryService } from '@core/services/inquiry.service';
import { InventoryService } from '@core/services/inventory.service';
import { AuthService } from '@core/services/auth.service';
import { InquiryCartService } from '@core/services/inquiry-cart.service';

describe('Pratik Phatake Application Test Suite', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the main application component', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('TranslationService', () => {
    it('should default to Marathi language', () => {
      const service = TestBed.inject(TranslationService);
      expect(service.currentLang()).toBe('mr');
    });

    it('should translate brand title into Marathi by default', () => {
      const service = TestBed.inject(TranslationService);
      expect(service.t('brand.name')).toBe('प्रतीक फटाके');
    });

    it('should update translations when switching language', () => {
      const service = TestBed.inject(TranslationService);
      service.setLanguage('en');
      expect(service.currentLang()).toBe('en');
      expect(service.t('brand.name')).toBe('Pratik Phatake');
    });
  });

  describe('ProductService', () => {
    it('should load initial seed products and categories', () => {
      const service = TestBed.inject(ProductService);
      expect(service.products().length).toBeGreaterThanOrEqual(20);
      expect(service.categories().length).toBe(8);
    });

    it('should calculate non-zero total inventory valuation', () => {
      const service = TestBed.inject(ProductService);
      expect(service.inventoryValuation()).toBeGreaterThan(0);
    });

    it('should filter active products', () => {
      const service = TestBed.inject(ProductService);
      expect(service.activeProducts().length).toBeGreaterThan(0);
    });
  });

  describe('InquiryService', () => {
    it('should generate an inquiry reference number starting with INQ-2026', () => {
      const service = TestBed.inject(InquiryService);
      const res = service.submitInquiry({
        customerName: 'सुनील पवार',
        phone: '9822011111',
        email: 'sunil@example.com',
        items: [
          {
            productId: 'test-1',
            productName: '१० सेमी फुलबाज्या',
            sku: 'SPK-10',
            quantity: 2,
            estimatedPrice: 65
          }
        ]
      });

      expect(res.inquiryNumber).toMatch(/^INQ-2026-\d{4}$/);
      expect(res.consent).toBe(true);
      expect(res.status).toBe('new');
    });
  });

  describe('InventoryService', () => {
    it('should atomically record inventory stock movements', () => {
      const invService = TestBed.inject(InventoryService);
      const prodService = TestBed.inject(ProductService);
      const prods = prodService.products();
      expect(prods.length).toBeGreaterThan(0);

      const target = prods[0];
      const initialStock = target.stockQuantity;

      const ok = invService.recordMovement(
        target.id,
        'STOCK_IN',
        25,
        'चाचणी आवक',
        'tester@pratikphatake.com'
      );

      expect(ok).toBe(true);
      const updated = prodService.getProductById(target.id);
      expect(updated?.stockQuantity).toBe(initialStock + 25);
    });
  });

  describe('AuthService & Role Management', () => {
    it('should allow demo login for superadmin', async () => {
      const auth = TestBed.inject(AuthService);
      const ok = await auth.login('superadmin@pratikphatake.com', 'admin123');
      expect(ok).toBe(true);
      expect(auth.isAuthenticated()).toBe(true);
      expect(auth.isSuperAdmin()).toBe(true);
      expect(auth.isAdmin()).toBe(true);
      expect(auth.isStaff()).toBe(true);
    });

    it('should distinguish store manager (admin) role and permissions', async () => {
      const auth = TestBed.inject(AuthService);
      const ok = await auth.login('admin@pratikphatake.com', 'admin123');
      expect(ok).toBe(true);
      expect(auth.isAuthenticated()).toBe(true);
      expect(auth.isSuperAdmin()).toBe(false);
      expect(auth.isAdmin()).toBe(true);
      expect(auth.isStaff()).toBe(true);
    });

    it('should distinguish counter cashier (staff) role and permissions', async () => {
      const auth = TestBed.inject(AuthService);
      const ok = await auth.login('staff@pratikphatake.com', 'admin123');
      expect(ok).toBe(true);
      expect(auth.isAuthenticated()).toBe(true);
      expect(auth.isSuperAdmin()).toBe(false);
      expect(auth.isAdmin()).toBe(false);
      expect(auth.isStaff()).toBe(true);
    });

    it('should distinguish customer role and prevent staff access', async () => {
      const auth = TestBed.inject(AuthService);
      const ok = await auth.login('customer@pratikphatake.com', 'admin123');
      expect(ok).toBe(true);
      expect(auth.isAuthenticated()).toBe(true);
      expect(auth.isCustomer()).toBe(true);
      expect(auth.isStaff()).toBe(false);
      expect(auth.isAdmin()).toBe(false);
    });

    it('should reset session upon logout', async () => {
      const auth = TestBed.inject(AuthService);
      await auth.logout('/');
      expect(auth.isAuthenticated()).toBe(false);
      expect(auth.currentUser()).toBeNull();
    });
  });

  describe('InquiryCartService & Estimate Bill Calculation', () => {
    it('should add products to customer inquiry cart and calculate estimated total', () => {
      const prodService = TestBed.inject(ProductService);
      const cart = TestBed.inject(InquiryCartService);
      cart.clearCart();

      const prods = prodService.products();
      expect(prods.length).toBeGreaterThan(1);

      cart.addItem(prods[0], 2);
      cart.addItem(prods[1], 3);

      expect(cart.uniqueItemCount()).toBe(2);
      expect(cart.itemCount()).toBe(5);

      const expectedTotal = (prods[0].retailPrice * 2) + (prods[1].retailPrice * 3);
      expect(cart.estimatedTotal()).toBe(expectedTotal);

      // Verify WhatsApp inquiry text formatting
      const text = cart.generateWhatsAppInquiryText('राहुल शिंदे', '9822012345', 'दिवाळीसाठी ऑर्डर');
      expect(text).toContain('राहुल शिंदे');
      expect(text).toContain('अंदाजे एकूण रक्कम');
      expect(text).toContain(prods[0].name.mr);
    });
  });
});
