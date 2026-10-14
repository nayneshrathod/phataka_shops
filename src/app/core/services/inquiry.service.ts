import { Injectable, signal, computed, inject } from '@angular/core';
import { Inquiry, InquiryStatus, InquiryItem } from '@core/models';
import { DemoDataService } from './demo-data.service';
import { AuditService } from './audit.service';
import { FirebaseService } from './firebase.service';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private demoData = inject(DemoDataService);
  private auditService = inject(AuditService);
  private firebaseService = inject(FirebaseService);

  private readonly STORAGE_INQUIRIES = 'pratik_inquiries_cache';

  private readonly inquiriesSignal = signal<Inquiry[]>(this.loadInquiries());

  readonly inquiries = this.inquiriesSignal.asReadonly();

  readonly pendingInquiries = computed(() => {
    return this.inquiriesSignal().filter(i => i.status === 'new' || i.status === 'in_review');
  });

  readonly completedInquiries = computed(() => {
    return this.inquiriesSignal().filter(i => i.status === 'closed');
  });

  private loadInquiries(): Inquiry[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_INQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const def = this.demoData.getDemoInquiries();
    this.saveInquiries(def);
    return def;
  }

  private saveInquiries(list: Inquiry[]): void {
    try {
      localStorage.setItem(this.STORAGE_INQUIRIES, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  submitInquiry(inquiryData: {
    customerName: string;
    phone: string;
    email: string;
    items: InquiryItem[];
    message?: string;
    source?: 'website_catalog' | 'direct_inquiry' | 'whatsapp_lead' | 'walk_in';
  }): Inquiry {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const inqNumber = `INQ-2026-${randomSuffix}`;
    const totalEst = inquiryData.items.reduce((acc, it) => acc + (it.estimatedPrice * it.quantity), 0);
    const now = new Date().toISOString();

    const newInquiry: Inquiry = {
      id: 'inq-' + Date.now(),
      inquiryNumber: inqNumber,
      customerName: inquiryData.customerName,
      phone: inquiryData.phone,
      email: inquiryData.email,
      items: inquiryData.items,
      totalEstimatedAmount: totalEst,
      message: inquiryData.message || '',
      status: 'new',
      source: inquiryData.source || 'website_catalog',
      consent: true,
      createdAt: now,
      updatedAt: now
    };

    const updated = [newInquiry, ...this.inquiriesSignal()];
    this.inquiriesSignal.set(updated);
    this.saveInquiries(updated);

    this.auditService.logAction({
      action: 'INQUIRY_CREATED',
      entityType: 'inquiry',
      entityId: newInquiry.id,
      details: `New inquiry ${inqNumber} from ${newInquiry.customerName} (${newInquiry.phone})`,
      userId: 'customer',
      userEmail: newInquiry.email
    });

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      try {
        const clean = JSON.parse(JSON.stringify(newInquiry));
        addDoc(collection(fs, 'inquiries'), clean).catch(console.error);
      } catch (err) {
        console.error('Inquiry Firestore sync error:', err);
      }
    }

    return newInquiry;
  }

  updateInquiryStatus(id: string, status: InquiryStatus, staffNotes?: string): boolean {
    const list = this.inquiriesSignal();
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return false;

    const target = list[idx];
    const updatedInquiry: Inquiry = {
      ...target,
      status,
      staffNotes: staffNotes !== undefined ? staffNotes : target.staffNotes,
      updatedAt: new Date().toISOString()
    };

    const nextList = [...list];
    nextList[idx] = updatedInquiry;
    this.inquiriesSignal.set(nextList);
    this.saveInquiries(nextList);

    this.auditService.logAction({
      action: 'INQUIRY_STATUS_UPDATE',
      entityType: 'inquiry',
      entityId: id,
      details: `Inquiry ${target.inquiryNumber} status changed to ${status}`,
      userId: 'staff',
      userEmail: 'staff@pratikphatake.com'
    });

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      updateDoc(doc(fs, 'inquiries', id), {
        status,
        staffNotes: updatedInquiry.staffNotes,
        updatedAt: updatedInquiry.updatedAt
      }).catch(console.error);
    }

    return true;
  }

  deleteInquiry(id: string): boolean {
    const list = this.inquiriesSignal();
    const target = list.find(i => i.id === id);
    if (!target) return false;

    const updated = list.filter(i => i.id !== id);
    this.inquiriesSignal.set(updated);
    this.saveInquiries(updated);

    this.auditService.logAction({
      action: 'INQUIRY_DELETE',
      entityType: 'inquiry',
      entityId: id,
      details: `Deleted inquiry ${target.inquiryNumber}`,
      userId: 'admin',
      userEmail: 'admin@pratikphatake.com'
    });

    return true;
  }

  generateWhatsAppUrl(inquiry: Inquiry, whatsappNumber: string = '919822012345'): string {
    const itemsText = inquiry.items.map(it => `• ${it.productName} (अंदाजे ${it.quantity} नग)`).join('%0A');
    const msg = `नमस्कार प्रतीक फटाके,%0A%0Aमी आपल्या वेबसाइटवर फटाक्यांची उपलब्धता विचारण्यासाठी संपर्क करत आहे.%0A%0A*संदर्भ क्रमांक:* ${inquiry.inquiryNumber}%0A*नाव:* ${encodeURIComponent(inquiry.customerName)}%0A%0A*निवडलेले फटाके:*%0A${itemsText}%0A%0A(टीप: ही केवळ दुकानातील साठा व दर विचारण्यासाठी केलेली चौकशी आहे. मी दुकानात येऊन खरेदी करेन.)`;
    return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`;
  }
}
