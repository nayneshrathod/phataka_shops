import { Injectable, signal, inject } from '@angular/core';
import { InventoryMovement, MovementType } from '@core/models';
import { ProductService } from './product.service';
import { DemoDataService } from './demo-data.service';
import { AuditService } from './audit.service';
import { FirebaseService } from './firebase.service';
import { collection, addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private productService = inject(ProductService);
  private demoData = inject(DemoDataService);
  private auditService = inject(AuditService);
  private firebaseService = inject(FirebaseService);

  private readonly STORAGE_MOVEMENTS = 'pratik_inventory_movements';

  private readonly movementsSignal = signal<InventoryMovement[]>(this.loadMovements());

  readonly movements = this.movementsSignal.asReadonly();

  private loadMovements(): InventoryMovement[] {
    try {
      const data = localStorage.getItem(this.STORAGE_MOVEMENTS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    const def = this.demoData.getDemoInventoryMovements();
    this.saveMovements(def);
    return def;
  }

  private saveMovements(list: InventoryMovement[]): void {
    try {
      localStorage.setItem(this.STORAGE_MOVEMENTS, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  recordMovement(
    productId: string,
    movementType: MovementType,
    quantityChange: number,
    reason: string,
    performedBy: string
  ): boolean {
    const product = this.productService.getProductById(productId);
    if (!product) return false;

    const previousQuantity = product.stockQuantity;
    // Calculate new quantity
    let delta = quantityChange;
    if (['STOCK_OUT', 'DAMAGE'].includes(movementType)) {
      delta = -Math.abs(quantityChange);
    } else if (movementType === 'STOCK_IN') {
      delta = Math.abs(quantityChange);
    }

    const newQuantity = Math.max(0, previousQuantity + delta);

    // Atomically update product stock
    this.productService.updateProduct(productId, { stockQuantity: newQuantity });

    const newMovement: InventoryMovement = {
      id: 'mov-' + Date.now(),
      productId,
      productName: product.name.mr,
      sku: product.sku,
      movementType,
      quantityChange: delta,
      previousQuantity,
      newQuantity,
      reason,
      performedBy,
      createdAt: new Date().toISOString()
    };

    const updatedMovements = [newMovement, ...this.movementsSignal()];
    this.movementsSignal.set(updatedMovements);
    this.saveMovements(updatedMovements);

    this.auditService.logAction({
      action: `INVENTORY_${movementType}`,
      entityType: 'inventory',
      entityId: productId,
      details: `${movementType}: ${delta > 0 ? '+' : ''}${delta} for "${product.name.mr}" (${product.sku}). Stock: ${previousQuantity} -> ${newQuantity}. Reason: ${reason}`,
      userId: performedBy,
      userEmail: performedBy
    });

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      addDoc(collection(fs, 'inventoryMovements'), newMovement).catch(console.error);
    }

    return true;
  }
}
