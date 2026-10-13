import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoDataService } from '@core/services/demo-data.service';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { UserProfile, UserRole } from '@core/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 lg:p-8 space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-serif">
            स्टाफ व परवानगी व्यवस्थापन (Staff & Authorization)
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            अधिकृत कर्मचाऱ्यांची खाती आणि भूमिका (Super Admin, Store Manager, Staff)
          </p>
        </div>

        <button
          type="button"
          (click)="openAddStaff()"
          class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-colors flex items-center gap-2"
        >
          <span>➕</span> नवीन कर्मचारी जोडा (Add Staff)
        </button>
      </div>

      <!-- Users Table -->
      <div class="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">कर्मचारी नाव</th>
                <th class="py-3 px-4">ईमेल पत्ता</th>
                <th class="py-3 px-4">भूमिका (Role)</th>
                <th class="py-3 px-4">मोबाईल</th>
                <th class="py-3 px-4">खाते स्थिती</th>
                <th class="py-3 px-4 text-right">कृती</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              @for (u of users(); track u.uid) {
                <tr class="hover:bg-slate-900/50 transition-colors">
                  <td class="py-3 px-4 font-bold text-white text-sm">
                    {{ u.displayName }}
                  </td>
                  <td class="py-3 px-4 font-mono text-purple-300">
                    {{ u.email }}
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase"
                      [ngClass]="{
                        'bg-purple-900/60 text-purple-300 border border-purple-700': u.role === 'super_admin',
                        'bg-blue-900/60 text-blue-300 border border-blue-700': u.role === 'admin',
                        'bg-emerald-900/60 text-emerald-300 border border-emerald-700': u.role === 'staff'
                      }">
                      {{ u.role }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-slate-400">
                    {{ u.phone || '-' }}
                  </td>
                  <td class="py-3 px-4">
                    <button
                      type="button"
                      (click)="toggleActive(u)"
                      class="px-2 py-0.5 rounded text-[10px] font-bold transition-colors"
                      [ngClass]="u.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-500'"
                    >
                      {{ u.active ? 'सक्रीय (Active)' : 'निष्क्रिय (Disabled)' }}
                    </button>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <button
                      type="button"
                      (click)="switchRolePrompt(u)"
                      class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-[11px]"
                    >
                      रोल बदला
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Security Guidance Card -->
      <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
        <h4 class="font-bold text-white flex items-center gap-2">
          <span>🔒</span> सुरक्षितता व भूमिका अधिकार (Role Boundaries):
        </h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Super Admin:</strong> संपूर्ण अधिकार, कर्मचारी खाती, सेटिंग्ज व ऑडीट लॉग प्रवेश.</li>
          <li><strong>Admin / Store Manager:</strong> उत्पादने, दर, साठा हालचाली व ग्राहक चौकशीचे व्यवस्थापन.</li>
          <li><strong>Staff:</strong> चौकशी पाहणे, नोट्स नोंदवणे व साठा तपासणे (खरेदी खर्च व सेटिंग्ज प्रतिबंधित).</li>
        </ul>
      </div>

    </div>
  `
})
export class AdminUsersComponent {
  private demoData = inject(DemoDataService);
  private toastService = inject(ToastService);
  authService = inject(AuthService);

  users = signal<UserProfile[]>(this.demoData.getDemoUsers());

  toggleActive(u: UserProfile): void {
    const next = this.users().map(item => {
      if (item.uid === u.uid) {
        return { ...item, active: !item.active };
      }
      return item;
    });
    this.users.set(next);
    this.toastService.success(`खाते स्थिती बदलली!`);
  }

  switchRolePrompt(u: UserProfile): void {
    const roles: UserRole[] = ['staff', 'admin', 'super_admin'];
    const currentIdx = roles.indexOf(u.role);
    const nextRole = roles[(currentIdx + 1) % roles.length];
    
    const next = this.users().map(item => {
      if (item.uid === u.uid) {
        return { ...item, role: nextRole };
      }
      return item;
    });
    this.users.set(next);
    this.toastService.success(`भूमिका ${nextRole} अशी बदलली!`);
  }

  openAddStaff(): void {
    const name = prompt('कर्मचाऱ्याचे पूर्ण नाव प्रविष्ट करा:');
    if (!name) return;
    const email = prompt('ईमेल पत्ता प्रविष्ट करा (उदा. ramesh@pratikphatake.com):');
    if (!email) return;

    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      displayName: name,
      email,
      role: 'staff',
      phone: '+91 98220 77777',
      active: true,
      createdAt: new Date().toISOString()
    };

    this.users.set([...this.users(), newUser]);
    this.toastService.success('नवीन कर्मचारी जोडला गेला!');
  }
}
