import { Injectable, signal } from '@angular/core';
import { AuditLog } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly STORAGE_KEY = 'pratik_audit_logs';
  private readonly logsSignal = signal<AuditLog[]>(this.loadLogs());

  readonly logs = this.logsSignal.asReadonly();

  private loadLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [
      {
        id: 'aud-001',
        action: 'INVENTORY_STOCK_IN',
        entityType: 'inventory',
        entityId: 'prod-spk-10cm-gold',
        details: 'Added 500 units of 10cm Electric Gold Sparklers from Standard Fireworks',
        userId: 'admin@pratikphatake.com',
        userEmail: 'admin@pratikphatake.com',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'aud-002',
        action: 'INQUIRY_STATUS_UPDATE',
        entityType: 'inquiry',
        entityId: 'inq-1002',
        details: 'Status changed from New to Contacted by Staff',
        userId: 'staff@pratikphatake.com',
        userEmail: 'staff@pratikphatake.com',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  logAction(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const newEntry: AuditLog = {
      ...log,
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    const updated = [newEntry, ...this.logsSignal()];
    this.logsSignal.set(updated);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated.slice(0, 200)));
    } catch {
      // ignore
    }
  }
}
