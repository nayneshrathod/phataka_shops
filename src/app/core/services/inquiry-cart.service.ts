import { Injectable, signal, computed, inject } from '@angular/core';
import { Product, InquiryCartItem } from '@core/models';
import { ToastService } from './toast.service';
import { StoreSettingsService } from './store-settings.service';

@Injectable({
  providedIn: 'root'
})
export class InquiryCartService {
  private toastService = inject(ToastService);
  private settingsService = inject(StoreSettingsService);

  private readonly STORAGE_KEY = 'pratik_customer_inquiry_cart';

  private readonly itemsSignal = signal<InquiryCartItem[]>(this.loadCart());
  readonly items = this.itemsSignal.asReadonly();

  readonly itemCount = computed(() => this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0));
  readonly uniqueItemCount = computed(() => this.itemsSignal().length);
  readonly isEmpty = computed(() => this.itemsSignal().length === 0);

  readonly estimatedTotal = computed(() => {
    return this.itemsSignal().reduce((sum, item) => sum + (item.quantity * item.indicativeUnitPrice), 0);
  });

  private loadCart(): InquiryCartItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [];
  }

  private saveCart(items: InquiryCartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  addItem(product: Product, quantity = 1): void {
    const current = this.itemsSignal();
    const idx = current.findIndex(i => i.productId === product.id);

    if (idx > -1) {
      const updated = [...current];
      updated[idx] = {
        ...updated[idx],
        quantity: updated[idx].quantity + quantity
      };
      this.itemsSignal.set(updated);
      this.saveCart(updated);
    } else {
      const newItem: InquiryCartItem = {
        productId: product.id,
        sku: product.sku,
        name: { ...product.name },
        image: product.images[0] || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400',
        categoryName: product.categoryName,
        quantity,
        indicativeUnitPrice: product.retailPrice,
        soundLevel: product.soundLevel,
        piecesPerBox: product.piecesPerBox
      };
      const updated = [newItem, ...current];
      this.itemsSignal.set(updated);
      this.saveCart(updated);
    }

    this.toastService.success(`"${product.name.mr}" चौकशी यादीत जोडले गेले!`);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const updated = this.itemsSignal().map(item => {
      if (item.productId === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.itemsSignal.set(updated);
    this.saveCart(updated);
  }

  removeItem(productId: string): void {
    const updated = this.itemsSignal().filter(i => i.productId !== productId);
    this.itemsSignal.set(updated);
    this.saveCart(updated);
    this.toastService.info('आयटम चौकशी यादीतून काढला गेला.');
  }

  clearCart(): void {
    this.itemsSignal.set([]);
    this.saveCart([]);
  }

  /**
   * Generates formatted WhatsApp text message for non-binding catalog inquiry.
   */
  generateWhatsAppInquiryText(customerName: string, customerPhone: string, notes?: string): string {
    const settings = this.settingsService.settings();
    const items = this.itemsSignal();
    const total = this.estimatedTotal();

    let text = `✨ *${settings.businessNameMarathi || 'प्रतीक फटाके'} — ग्राहक चौकशी यादी*\n`;
    text += `🏬 ${settings.address}\n`;
    text += `👤 ग्राहक नाव: ${customerName || 'अनामिक ग्राहक'}\n`;
    if (customerPhone) text += `📞 फोन: ${customerPhone}\n`;
    text += `\n📋 *निवडलेले फटाके:*\n`;

    items.forEach((item, index) => {
      text += `${index + 1}. *${item.name.mr}* (SKU: ${item.sku})\n`;
      text += `   नग: ${item.quantity} × ₹${item.indicativeUnitPrice} = ₹${item.quantity * item.indicativeUnitPrice}\n`;
    });

    text += `\n💰 *अंदाजे एकूण रक्कम:* ₹${total.toLocaleString('en-IN')}\n`;
    if (notes) {
      text += `📝 *टीप:* ${notes}\n`;
    }
    text += `\n⚠️ *वैधानिक सूचना (Statutory Notice):*\n`;
    text += `ही केवळ माहिती व चौकशी यादी आहे, कोणतीही ऑनलाईन खरेदी किंवा बुकिंग नाही. कृपया प्रत्यक्ष खरेदीसाठी आमच्या अधिकृत दुकानाला भेट द्या.`;

    return text;
  }
}
