import { Injectable, inject } from '@angular/core';
import { Invoice } from '@core/models';
import { BillExportService } from './bill-export.service';
import { ToastService } from './toast.service';
import { StoreSettingsService } from './store-settings.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppShareService {
  private exportService = inject(BillExportService);
  private toastService = inject(ToastService);
  private settingsService = inject(StoreSettingsService);

  /**
   * Generates bilingual structured WhatsApp bill summary message.
   */
  generateBillSummaryText(invoice: Invoice): string {
    const store = this.settingsService.settings();
    const dateFormatted = new Date(invoice.createdAt).toLocaleString('mr-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    let msg = `✨ *${store.businessNameMarathi || 'प्रतीक फटाके'} — खरेदी पावती*\n`;
    msg += `🧾 *बिल क्र. (Invoice No):* ${invoice.invoiceNumber}\n`;
    msg += `📅 *दिनांक (Date):* ${dateFormatted}\n`;
    msg += `👤 *ग्राहक (Customer):* ${invoice.customerSnapshot.name}\n`;
    msg += `🏬 *पत्ता:* ${store.address}\n`;
    msg += `📜 *PESO परवाना:* ${store.licenseNumber}\n`;
    msg += `--------------------------------\n`;
    msg += `📋 *खरेदी तपशील (Items):*\n`;

    invoice.items.forEach((item, index) => {
      msg += `${index + 1}. *${item.name.mr}*\n`;
      msg += `   ${item.quantity} नग × ₹${item.unitPrice} = ₹${item.lineTotal}\n`;
    });

    msg += `--------------------------------\n`;
    msg += `💵 *एकूण रक्कम (Gross):* ₹${invoice.grossAmount}\n`;
    if (invoice.totalDiscount > 0) {
      msg += `🎉 *दिलेली सवलत (Discount):* -₹${invoice.totalDiscount}\n`;
    }
    msg += `💰 *अंतिम देय रक्कम (Grand Total):* *₹${invoice.grandTotal}*\n`;
    msg += `💳 *पेमेंट पद्धत:* ${invoice.paymentMethod.toUpperCase()}\n`;
    if (invoice.customerSavings > 0) {
      msg += `🌟 *तुमची एकूण बचत (You Saved):* ₹${invoice.customerSavings}\n`;
    }
    msg += `--------------------------------\n`;
    msg += `🪔 *${store.taglineMarathi || 'सुरक्षित आणि आनंददायी दिवाळी साजरी करा!'}*\n`;
    msg += `🙏 आमच्या दुकानाला भेट दिल्याबद्दल धन्यवाद!`;

    return msg;
  }

  /**
   * Shares the invoice DIRECTLY to the customer's mobile number on WhatsApp (wa.me/{phone}).
   * Also downloads the bill image so it can be attached.
   */
  async shareDirectToCustomerWhatsApp(
    invoice: Invoice,
    customPhone?: string,
    elementToCapture?: HTMLElement
  ): Promise<void> {
    const summaryText = this.generateBillSummaryText(invoice);
    const rawPhone = (customPhone || invoice.customerSnapshot.phone || '')
      .replace(/\D/g, '')
      .replace(/^0+/, '');
    const internationalPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    // Optional background receipt image download
    if (elementToCapture) {
      try {
        const blob = await this.exportService.exportToBlob(elementToCapture);
        if (blob) {
          this.exportService.downloadBlob(blob, `Pratik_Bill_${invoice.invoiceNumber}.png`);
        }
      } catch (err) {
        console.warn('Image capture background export failed:', err);
      }
    }

    const waUrl = internationalPhone
      ? `https://wa.me/${internationalPhone}?text=${encodeURIComponent(summaryText)}`
      : `https://wa.me/?text=${encodeURIComponent(summaryText)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (internationalPhone) {
      this.toastService.success(`ग्राहकाच्या WhatsApp (+${internationalPhone}) वर थेट बिल पाठवले जात आहे!`);
    } else {
      this.toastService.info('व्हॉट्सॲपवर बिल उघडले.');
    }
  }

  /**
   * Shares the invoice via Native Web Share API (with image file) if supported,
   * or triggers image download and opens WhatsApp wa.me link as fallback.
   */
  async shareInvoice(
    invoice: Invoice,
    elementToCapture?: HTMLElement
  ): Promise<{ shared: boolean; mode: 'native_file' | 'whatsapp_link'; message?: string }> {
    return this.shareDirectToCustomerWhatsApp(invoice, undefined, elementToCapture).then(() => ({
      shared: true,
      mode: 'whatsapp_link'
    }));
  }
}
