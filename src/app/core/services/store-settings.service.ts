import { Injectable, signal, inject } from '@angular/core';
import { StoreSettings } from '@core/models';
import { DemoDataService } from './demo-data.service';
import { AuditService } from './audit.service';
import { FirebaseService } from './firebase.service';
import { doc, getDoc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class StoreSettingsService {
  private demoData = inject(DemoDataService);
  private auditService = inject(AuditService);
  private firebaseService = inject(FirebaseService);

  private readonly STORAGE_SETTINGS = 'pratik_store_settings';

  private readonly settingsSignal = signal<StoreSettings>(this.loadSettings());

  readonly settings = this.settingsSignal.asReadonly();

  constructor() {
    this.syncFromFirebaseIfConfigured();
  }

  private async syncFromFirebaseIfConfigured(): Promise<void> {
    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      try {
        const snap = await getDoc(doc(fs, 'settings', 'store'));
        if (snap.exists()) {
          const val = snap.data() as StoreSettings;
          this.settingsSignal.set(val);
          this.saveSettings(val);
        }
      } catch (err) {
        console.warn('Firestore store settings fetch notice:', err);
      }
    }
  }

  private loadSettings(): StoreSettings {
    try {
      const saved = localStorage.getItem(this.STORAGE_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const def = this.demoData.getStoreSettings();
    this.saveSettings(def);
    return def;
  }

  private saveSettings(settings: StoreSettings): void {
    try {
      localStorage.setItem(this.STORAGE_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }

  updateSettings(updates: Partial<StoreSettings>): void {
    const current = this.settingsSignal();
    const updated: StoreSettings = { ...current, ...updates };
    this.settingsSignal.set(updated);
    this.saveSettings(updated);

    this.auditService.logAction({
      action: 'SETTINGS_UPDATE',
      entityType: 'settings',
      entityId: 'store_settings',
      details: 'Updated store configuration and contact disclosures',
      userId: 'admin',
      userEmail: 'admin@pratikphatake.com'
    });

    const fs = this.firebaseService.firestore;
    if (this.firebaseService.isLiveFirebase && fs) {
      setDoc(doc(fs, 'settings', 'store'), updated).catch(console.error);
    }
  }

  resetToDefault(): void {
    const def = this.demoData.getStoreSettings();
    this.settingsSignal.set(def);
    this.saveSettings(def);
  }
}
