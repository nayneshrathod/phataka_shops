import { TestBed } from '@angular/core/testing';
import { InvoiceService } from './invoice.service';
import { ProductService } from './product.service';
import { InventoryService } from './inventory.service';
import { BillingCalculationService } from './billing-calculation.service';
import { Product } from '@core/models';

describe('InvoiceService', () => {
  let invoiceService: InvoiceService;
  let productService: ProductService;
  let inventoryService: InventoryService;
  let calcService: BillingCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    invoiceService = TestBed.inject(InvoiceService);
    productService = TestBed.inject(ProductService);
    inventoryService = TestBed.inject(InventoryService);
    calcService = TestBed.inject(BillingCalculationService);
  });

  it('should generate formatted sequential invoice numbers', () => {
    const num1 = invoiceService.generateNextInvoiceNumber();
    const num2 = invoiceService.generateNextInvoiceNumber();
    expect(num1).toMatch(/^PP-\d{4}-\d{6}$/);
    expect(num2).toMatch(/^PP-\d{4}-\d{6}$/);
    expect(num1).not.toBe(num2);
  });

  it('should atomically deduct stock and record STOCK_OUT inventory movement upon finalized sale', () => {
    const products = productService.activeProducts();
    expect(products.length).toBeGreaterThan(0);
    const targetProduct = products[0];
    const initialStock = targetProduct.stockQuantity;

    const rawItem = {
      productId: targetProduct.id,
      sku: targetProduct.sku,
      name: { ...targetProduct.name },
      image: '',
      originalUnitPrice: targetProduct.retailPrice,
      quantity: 2,
      availableStock: initialStock,
      discountedUnitPrice: targetProduct.retailPrice,
      lineDiscountAmount: 0,
      taxRate: 18,
      taxAmount: 0,
      lineTotal: targetProduct.retailPrice * 2
    };

    const calc = calcService.calculateCartTotals([rawItem], null, [], 'inclusive', 18);

    const result = invoiceService.finalizeSale({
      calc,
      customer: {
        name: 'विजय कुलकर्णी (Vijay Kulkarni)',
        phone: '9822198765',
        consentForWhatsApp: true
      },
      paymentMethod: 'upi',
      amountReceived: calc.grandTotal
    });

    expect(result.success).toBe(true);
    expect(result.invoice).toBeDefined();
    expect(result.invoice?.invoiceNumber).toBeDefined();

    // Verify stock deduction
    const updatedProduct = productService.getProductById(targetProduct.id);
    expect(updatedProduct?.stockQuantity).toBe(initialStock - 2);

    // Verify inventory movement record
    const latestMovement = inventoryService.movements()[0];
    expect(latestMovement.productId).toBe(targetProduct.id);
    expect(latestMovement.movementType).toBe('STOCK_OUT');
    expect(latestMovement.quantityChange).toBe(-2);
  });

  it('should process return, restore product stock, and create return voucher', () => {
    const invoices = invoiceService.invoices();
    expect(invoices.length).toBeGreaterThan(0);
    const inv = invoices[0];
    const itemToReturn = inv.items[0];

    const prodBefore = productService.getProductById(itemToReturn.productId);
    const stockBefore = prodBefore?.stockQuantity || 0;

    const returnRes = invoiceService.processReturn(
      inv.id,
      [{
        productId: itemToReturn.productId,
        quantity: 1,
        reason: 'दुकान काऊंटरवर तपासणीत खराब आढळले'
      }],
      'दुकान काऊंटरवर तपासणीत खराब आढळले'
    );

    expect(returnRes.success).toBe(true);
    expect(returnRes.returnVoucher).toBeDefined();
    expect(returnRes.returnVoucher?.returnReference).toMatch(/^RET-\d{4}-\d{5}$/);

    // Verify stock restoration
    const prodAfter = productService.getProductById(itemToReturn.productId);
    expect(prodAfter?.stockQuantity).toBe(stockBefore + 1);

    // Verify RETURN inventory movement
    const latestMovement = inventoryService.movements()[0];
    expect(latestMovement.movementType).toBe('RETURN');
    expect(latestMovement.quantityChange).toBe(1);
  });
});
