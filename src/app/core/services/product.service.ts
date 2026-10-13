import { Injectable, signal, computed, inject } from '@angular/core';
import { Product, Category, Banner } from '@core/models';
import { DemoDataService } from './demo-data.service';
import { AuditService } from './audit.service';
import { FirebaseService } from './firebase.service';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private demoData = inject(DemoDataService);
  private auditService = inject(AuditService);
  private firebaseService = inject(FirebaseService);

  private readonly STORAGE_PRODUCTS = 'pratik_products_cache';
  private readonly STORAGE_CATEGORIES = 'pratik_categories_cache';
  private readonly STORAGE_BANNERS = 'pratik_banners_cache';

  private readonly productsSignal = signal<Product[]>(this.loadInitialProducts());
  private readonly categoriesSignal = signal<Category[]>(this.loadInitialCategories());
  private readonly bannersSignal = signal<Banner[]>(this.loadInitialBanners());

  readonly products = this.productsSignal.asReadonly();
  readonly categories = this.categoriesSignal.asReadonly();
  readonly banners = this.bannersSignal.asReadonly();

  readonly activeProducts = computed(() => this.productsSignal().filter(p => p.active));
  readonly featuredProducts = computed(() => this.productsSignal().filter(p => p.active && p.featured));
  readonly lowStockProducts = computed(() => this.productsSignal().filter(p => p.stockQuantity <= p.lowStockThreshold));
  readonly activeCategories = computed(() => this.categoriesSignal().filter(c => c.active).sort((a, b) => a.sortOrder - b.sortOrder));
  readonly activeBanners = computed(() => this.bannersSignal().filter(b => b.active).sort((a, b) => a.sortOrder - b.sortOrder));

  readonly inventoryValuation = computed(() => {
    return this.productsSignal().reduce((acc, p) => acc + (p.retailPrice * p.stockQuantity), 0);
  });

  constructor() {
    this.syncFromFirebaseIfConfigured();
  }

  private loadInitialProducts(): Product[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const def = this.demoData.getProducts();
    this.saveProductsCache(def);
    return def;
  }

  private loadInitialCategories(): Category[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const def = this.demoData.getCategories();
    this.saveCategoriesCache(def);
    return def;
  }

  private loadInitialBanners(): Banner[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_BANNERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const def = this.demoData.getBanners();
    this.saveBannersCache(def);
    return def;
  }

  private saveProductsCache(products: Product[]): void {
    try {
      localStorage.setItem(this.STORAGE_PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }

  private saveCategoriesCache(categories: Category[]): void {
    try {
      localStorage.setItem(this.STORAGE_CATEGORIES, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }

  private saveBannersCache(banners: Banner[]): void {
    try {
      localStorage.setItem(this.STORAGE_BANNERS, JSON.stringify(banners));
    } catch {
      // ignore
    }
  }

  private async syncFromFirebaseIfConfigured(): Promise<void> {
    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      try {
        const prodSnap = await getDocs(collection(fs, 'products'));
        if (!prodSnap.empty) {
          const list: Product[] = [];
          prodSnap.forEach(d => list.push({ ...(d.data() as Product), id: d.id }));
          this.productsSignal.set(list);
          this.saveProductsCache(list);
        }
      } catch (err) {
        console.warn('Firestore products fetch notice:', err);
      }
    }
  }

  getProductById(id: string): Product | undefined {
    return this.productsSignal().find(p => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.productsSignal().find(p => p.slug === slug);
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this.productsSignal().filter(p => p.active && p.categoryId === categoryId);
  }

  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newId = 'prod-' + Date.now();
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    const updated = [newProduct, ...this.productsSignal()];
    this.productsSignal.set(updated);
    this.saveProductsCache(updated);

    this.auditService.logAction({
      action: 'PRODUCT_CREATE',
      entityType: 'product',
      entityId: newId,
      details: `Created product "${newProduct.name.mr}" (${newProduct.sku})`,
      userId: 'admin',
      userEmail: 'admin@pratikphatake.com'
    });

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      setDoc(doc(fs, 'products', newId), newProduct).catch(console.error);
    }

    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): boolean {
    const current = this.productsSignal();
    const index = current.findIndex(p => p.id === id);
    if (index === -1) return false;

    const updatedProduct: Product = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const nextList = [...current];
    nextList[index] = updatedProduct;

    this.productsSignal.set(nextList);
    this.saveProductsCache(nextList);

    this.auditService.logAction({
      action: 'PRODUCT_UPDATE',
      entityType: 'product',
      entityId: id,
      details: `Updated product "${updatedProduct.name.mr}" (${updatedProduct.sku})`,
      userId: 'admin',
      userEmail: 'admin@pratikphatake.com'
    });

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      updateDoc(doc(fs, 'products', id), updates).catch(console.error);
    }

    return true;
  }

  deleteProduct(id: string): boolean {
    const current = this.productsSignal();
    const target = current.find(p => p.id === id);
    if (!target) return false;

    const nextList = current.filter(p => p.id !== id);
    this.productsSignal.set(nextList);
    this.saveProductsCache(nextList);

    this.auditService.logAction({
      action: 'PRODUCT_DELETE',
      entityType: 'product',
      entityId: id,
      details: `Deleted product "${target.name.mr}" (${target.sku})`,
      userId: 'admin',
      userEmail: 'admin@pratikphatake.com'
    });

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      deleteDoc(doc(fs, 'products', id)).catch(console.error);
    }

    return true;
  }

  // Categories CRUD
  createCategory(categoryData: Omit<Category, 'id'>): Category {
    const newId = 'cat-' + Date.now();
    const newCat: Category = {
      ...categoryData,
      id: newId
    };
    const updated = [...this.categoriesSignal(), newCat];
    this.categoriesSignal.set(updated);
    this.saveCategoriesCache(updated);
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): boolean {
    const current = this.categoriesSignal();
    const index = current.findIndex(c => c.id === id);
    if (index === -1) return false;

    const updated = [...current];
    updated[index] = { ...updated[index], ...updates };
    this.categoriesSignal.set(updated);
    this.saveCategoriesCache(updated);
    return true;
  }

  deleteCategory(id: string): boolean {
    const current = this.categoriesSignal();
    const updated = current.filter(c => c.id !== id);
    this.categoriesSignal.set(updated);
    this.saveCategoriesCache(updated);
    return true;
  }

  // Banners CRUD
  createBanner(bannerData: Omit<Banner, 'id'>): Banner {
    const newId = 'ban-' + Date.now();
    const newBan: Banner = { ...bannerData, id: newId };
    const updated = [newBan, ...this.bannersSignal()];
    this.bannersSignal.set(updated);
    this.saveBannersCache(updated);
    return newBan;
  }

  updateBanner(id: string, updates: Partial<Banner>): boolean {
    const current = this.bannersSignal();
    const idx = current.findIndex(b => b.id === id);
    if (idx === -1) return false;
    const updated = [...current];
    updated[idx] = { ...updated[idx], ...updates };
    this.bannersSignal.set(updated);
    this.saveBannersCache(updated);
    return true;
  }

  deleteBanner(id: string): boolean {
    const updated = this.bannersSignal().filter(b => b.id !== id);
    this.bannersSignal.set(updated);
    this.saveBannersCache(updated);
    return true;
  }

  // Reset to Demo Data
  resetToDemoData(): void {
    const defProds = this.demoData.getProducts();
    const defCats = this.demoData.getCategories();
    const defBans = this.demoData.getBanners();

    this.productsSignal.set(defProds);
    this.categoriesSignal.set(defCats);
    this.bannersSignal.set(defBans);

    this.saveProductsCache(defProds);
    this.saveCategoriesCache(defCats);
    this.saveBannersCache(defBans);

    this.auditService.logAction({
      action: 'SYSTEM_RESET_DEMO_DATA',
      entityType: 'settings',
      entityId: 'all',
      details: 'Reset catalog, categories and banners to initial demo seed',
      userId: 'admin',
      userEmail: 'admin@pratikphatake.com'
    });
  }
}
