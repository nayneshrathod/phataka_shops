import { Injectable, signal, computed, inject } from '@angular/core';
import { Offer } from '@core/models';
import { FirebaseService } from './firebase.service';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private firebaseService = inject(FirebaseService);
  private readonly STORAGE_OFFERS = 'pratik_offers_cache';

  private readonly offersSignal = signal<Offer[]>(this.loadInitialOffers());
  readonly offers = this.offersSignal.asReadonly();
  readonly activeOffers = computed(() => this.offersSignal().filter(o => o.active));

  constructor() {
    this.syncFromFirebaseIfConfigured();
  }

  private loadInitialOffers(): Offer[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_OFFERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const def = this.getDefaultOffers();
    this.saveOffersCache(def);
    return def;
  }

  private saveOffersCache(offers: Offer[]): void {
    try {
      localStorage.setItem(this.STORAGE_OFFERS, JSON.stringify(offers));
    } catch {
      // ignore
    }
  }

  private async syncFromFirebaseIfConfigured(): Promise<void> {
    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      try {
        const snap = await getDocs(collection(fs, 'offers'));
        if (!snap.empty) {
          const list: Offer[] = [];
          snap.forEach(d => list.push({ ...(d.data() as Offer), id: d.id }));
          this.offersSignal.set(list);
          this.saveOffersCache(list);
        }
      } catch (err) {
        console.warn('Firestore offers fetch notice:', err);
      }
    }
  }

  private getDefaultOffers(): Offer[] {
    const currentYear = new Date().getFullYear();
    return [
      {
        id: 'off-diwali-10',
        code: 'DIWALI10',
        title: {
          mr: 'दिवाळी महा धमाका १०% सवलत',
          hi: 'दीवाली महा धमाका १०% छूट',
          en: 'Diwali Maha Dhamaka 10% Off'
        },
        description: {
          mr: '₹३,००० च्या पुढील बिलावर १०% थेट सवलत (कमाल ₹१,००० पर्यंत)',
          hi: '₹३,००० से अधिक बिल पर १०% तुरंत छूट (अधिकतम ₹१,०००)',
          en: '10% instant discount on orders above ₹3,000 (Max ₹1,000)'
        },
        offerType: 'bill_discount',
        discountType: 'percentage',
        discountValue: 10,
        minimumAmount: 3000,
        maximumDiscount: 1000,
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear + 1}-12-31`,
        stackingAllowed: false,
        usageLimit: 500,
        usageCount: 24,
        active: true
      },
      {
        id: 'off-family-flat500',
        code: 'FAMILY500',
        title: {
          mr: 'कौटुंबिक कॉम्बो ₹५०० ऑफ',
          hi: 'पारिवारिक कॉम्बो ₹५०० छूट',
          en: 'Family Combo ₹500 Flat Off'
        },
        description: {
          mr: '₹५,००० च्या पुढील बिलावर थेट ₹५०० रोख सवलत',
          hi: '₹५,००० से अधिक खरीदारी पर ₹५०० सीधी छूट',
          en: 'Flat ₹500 discount on cart value above ₹5,000'
        },
        offerType: 'bill_discount',
        discountType: 'fixed',
        discountValue: 500,
        minimumAmount: 5000,
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear + 1}-12-31`,
        stackingAllowed: false,
        usageLimit: 200,
        usageCount: 15,
        active: true
      },
      {
        id: 'off-skyshots-15',
        code: 'SKYSHOT15',
        title: {
          mr: 'स्काय शॉट्स १५% विशेष ऑफर',
          hi: 'स्काई शॉट्स १५% विशेष छूट',
          en: 'Sky Shots 15% Special Bonanza'
        },
        description: {
          mr: 'सर्व स्काय शॉट्स उत्पादनांवर १५% सवलत',
          hi: 'सभी स्काई शॉट्स उत्पादों पर १५% छूट',
          en: '15% discount on all Sky Shots category fireworks'
        },
        offerType: 'category_discount',
        discountType: 'percentage',
        discountValue: 15,
        minimumAmount: 2000,
        maximumDiscount: 750,
        eligibleCategoryIds: ['cat-sky-shots'],
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear + 1}-12-31`,
        stackingAllowed: true,
        usageCount: 42,
        active: true
      },
      {
        id: 'off-vip-20',
        code: 'VIPPHATAKE',
        title: {
          mr: 'व्हीआयपी ग्राहक २०% कूपन',
          hi: 'वीआईपी ग्राहक २०% कूपन',
          en: 'VIP Customer 20% Special'
        },
        description: {
          mr: '₹१०,००० च्या पुढील भव्य बिलावर २०% मोठी सवलत',
          hi: '₹१०,००० से अधिक बिल पर २०% विशेष छूट',
          en: '20% mega discount on billing above ₹10,000'
        },
        offerType: 'coupon',
        discountType: 'percentage',
        discountValue: 20,
        minimumAmount: 10000,
        maximumDiscount: 3000,
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear + 1}-12-31`,
        stackingAllowed: false,
        usageLimit: 50,
        usageCount: 6,
        active: true
      }
    ];
  }

  getOfferByCode(code: string): Offer | undefined {
    const clean = code.trim().toUpperCase();
    return this.offersSignal().find(o => o.code.toUpperCase() === clean);
  }

  validateCoupon(code: string, cartGross: number): { valid: boolean; offer?: Offer; message: string } {
    const offer = this.getOfferByCode(code);
    if (!offer) {
      return { valid: false, message: 'अवैध कूपन कोड (Invalid coupon code)' };
    }
    if (!offer.active) {
      return { valid: false, message: 'हा कूपन कोड सध्या निष्क्रिय आहे (Coupon is expired or inactive)' };
    }
    const now = new Date();
    if (offer.startDate && new Date(offer.startDate) > now) {
      return { valid: false, message: 'हा कूपन अजून सुरू झालेला नाही (Coupon not yet active)' };
    }
    if (offer.endDate && new Date(offer.endDate) < now) {
      return { valid: false, message: 'कूपनची मुदत संपली आहे (Coupon has expired)' };
    }
    if (cartGross < offer.minimumAmount) {
      return {
        valid: false,
        message: `या कूपनसाठी किमान ₹${offer.minimumAmount.toLocaleString('en-IN')} चे बिल आवश्यक आहे`
      };
    }
    if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
      return { valid: false, message: 'कूपन वापर मर्यादा संपली आहे (Usage limit reached)' };
    }
    return { valid: true, offer, message: 'कूपन यशस्वीरित्या लागू केले! (Coupon applied successfully)' };
  }

  createOffer(data: Omit<Offer, 'id' | 'usageCount'>): Offer {
    const newId = 'off-' + Date.now();
    const newOffer: Offer = {
      ...data,
      id: newId,
      code: data.code.trim().toUpperCase(),
      usageCount: 0
    };
    const updated = [newOffer, ...this.offersSignal()];
    this.offersSignal.set(updated);
    this.saveOffersCache(updated);

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      setDoc(doc(fs, 'offers', newId), newOffer).catch(console.error);
    }
    return newOffer;
  }

  updateOffer(id: string, updates: Partial<Offer>): boolean {
    const current = this.offersSignal();
    const idx = current.findIndex(o => o.id === id);
    if (idx === -1) return false;

    const updated = [...current];
    updated[idx] = { ...updated[idx], ...updates };
    this.offersSignal.set(updated);
    this.saveOffersCache(updated);

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      setDoc(doc(fs, 'offers', id), updated[idx], { merge: true }).catch(console.error);
    }
    return true;
  }

  toggleOfferStatus(id: string): boolean {
    const offer = this.offersSignal().find(o => o.id === id);
    if (!offer) return false;
    return this.updateOffer(id, { active: !offer.active });
  }

  deleteOffer(id: string): boolean {
    const updated = this.offersSignal().filter(o => o.id !== id);
    this.offersSignal.set(updated);
    this.saveOffersCache(updated);

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      deleteDoc(doc(fs, 'offers', id)).catch(console.error);
    }
    return true;
  }
}
