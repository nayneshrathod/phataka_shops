import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { UserRole } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslationService, SupportedLang } from '@core/i18n/translation.service';

interface RolePreset {
  role: UserRole;
  title: Record<SupportedLang, string>;
  roleBadge: string;
  email: string;
  colorClass: string;
  badgeBg: string;
  icon: string;
  description: Record<SupportedLang, string>;
  destUrl: string;
  permissions: Record<SupportedLang, string[]>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe],
  template: `
    <div class="min-h-screen bg-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <!-- Festive Ambient Background Elements -->
      <div class="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-2xl w-full mx-auto space-y-6 relative z-10">
        
        <!-- Language Switcher Bar -->
        <div class="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 w-fit mx-auto shadow-sm">
          <button
            type="button"
            (click)="setLanguage('mr')"
            [ngClass]="translationService.currentLang() === 'mr' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            🚩 मराठी
          </button>
          <button
            type="button"
            (click)="setLanguage('hi')"
            [ngClass]="translationService.currentLang() === 'hi' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            🇮🇳 हिंदी
          </button>
          <button
            type="button"
            (click)="setLanguage('en')"
            [ngClass]="translationService.currentLang() === 'en' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            🌐 English
          </button>
        </div>

        <!-- Brand Header -->
        <div class="text-center space-y-3">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-purple-900/50">
            🪔
          </div>
          <div>
            <h1 class="text-3xl font-black text-white font-serif tracking-tight">
              {{ 'login.title' | translate }}
            </h1>
            <p class="text-xs font-bold text-amber-400 uppercase tracking-widest mt-1">
              {{ 'login.subtitle' | translate }}
            </p>
          </div>
          <p class="text-xs text-slate-400 max-w-md mx-auto">
            {{ 'login.instruction' | translate }}
          </p>
        </div>

        <!-- 4 Role Selector Chips Grid -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
            <span>⚡ {{ 'login.selectRole' | translate }}</span>
            <span class="text-[11px] text-purple-400">{{ 'login.oneClickAvailable' | translate }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            @for (preset of rolePresets; track preset.role) {
              <div
                (click)="selectRole(preset)"
                [ngClass]="selectedRole() === preset.role ? 'border-purple-500 bg-purple-950/40 shadow-lg shadow-purple-900/20' : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'"
                class="p-4 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 space-y-2 relative group"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">{{ preset.icon }}</span>
                    <div>
                      <h4 class="font-bold text-sm text-white">{{ getPresetTitle(preset) }}</h4>
                      <span class="text-[10px] font-mono text-slate-400">{{ preset.email }}</span>
                    </div>
                  </div>
                  <span
                    [ngClass]="preset.badgeBg"
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                  >
                    {{ preset.roleBadge }}
                  </span>
                </div>

                <p class="text-[11px] text-slate-400 leading-relaxed">
                  {{ getPresetDescription(preset) }}
                </p>

                <div class="flex flex-wrap gap-1 pt-1">
                  @for (perm of getPresetPermissions(preset); track perm) {
                    <span class="px-1.5 py-0.5 rounded text-[9px] bg-slate-950 text-slate-300 border border-slate-800">
                      ✓ {{ perm }}
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Login Credentials Form Box -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 class="font-bold text-sm text-white">{{ 'login.credentials' | translate }}</h3>
              <p class="text-[11px] text-slate-400">
                {{ 'login.selectedRole' | translate }} <strong class="text-purple-300 font-mono">{{ getPresetTitle(selectedPreset()) }}</strong>
              </p>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              {{ 'login.passwordHint' | translate }}
            </span>
          </div>

          @if (authService.authError(); as err) {
            <div class="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>{{ err }}</span>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {{ 'login.email' | translate }}
              </label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-600 font-mono"
                placeholder="user@pratikphatake.com"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {{ 'login.password' | translate }}
              </label>
              <input
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-600 font-mono"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || authService.isLoading()"
              class="w-full py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-950 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              @if (authService.isLoading()) {
                <span>{{ 'login.authenticating' | translate }}</span>
              } @else {
                <span>{{ selectedPreset()?.icon }} {{ getPresetTitle(selectedPreset()) }} {{ 'login.loginAsBtn' | translate }}</span>
              }
            </button>
          </form>

          <!-- Back Link -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-500">
            <a routerLink="/" class="hover:text-purple-400 transition-colors flex items-center gap-1 font-semibold">
              <span>←</span> {{ 'login.backWebsite' | translate }}
            </a>
            <a routerLink="/inquiry-cart" class="hover:text-purple-400 transition-colors flex items-center gap-1">
              <span>🛒</span> {{ 'login.viewCart' | translate }}
            </a>
          </div>

        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  translationService = inject(TranslationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  rolePresets: RolePreset[] = [
    {
      role: 'super_admin',
      title: {
        mr: 'मुख्य व्यवस्थापक (Super Admin)',
        hi: 'मुख्य प्रबंधक (Super Admin)',
        en: 'Store Owner (Super Admin)'
      },
      roleBadge: '👑 SUPER ADMIN',
      email: 'superadmin@pratikphatake.com',
      colorClass: 'text-amber-400',
      badgeBg: 'bg-amber-950 text-amber-300 border border-amber-800',
      icon: '👑',
      description: {
        mr: 'दुकान मालक — सर्व प्रणालीवर पूर्ण नियंत्रण, कर्मचारी खाती व्यवस्थापन, GST व कोर सेटिंग्ज, १००% सवलत अधिकार.',
        hi: 'दुकान मालिक — संपूर्ण सिस्टम पर पूर्ण नियंत्रण, कर्मचारी खाता प्रबंधन, GST व कोर सेटिंग्स, 100% छूट अधिकार।',
        en: 'Store Owner — Complete control over inventory, staff accounts, store GST & settings, 100% discount authority.'
      },
      destUrl: '/admin/dashboard',
      permissions: {
        mr: ['स्टाफ युझर्स', 'स्टोअर GST', 'POS बिलिंग', 'सर्व अहवाल', 'अनलिमिटेड सवलत'],
        hi: ['स्टाफ यूजर्स', 'स्टोर GST', 'POS बिलिंग', 'सभी रिपोर्ट', 'असीमित छूट'],
        en: ['Staff Users', 'Store GST', 'POS Billing', 'All Reports', 'Unlimited Discount']
      }
    },
    {
      role: 'admin',
      title: {
        mr: 'स्टोअर मॅनेजर (Manager)',
        hi: 'स्टोर मैनेजर (Manager)',
        en: 'Store Manager (Admin)'
      },
      roleBadge: '👔 ADMIN',
      email: 'admin@pratikphatake.com',
      colorClass: 'text-blue-400',
      badgeBg: 'bg-blue-950 text-blue-300 border border-blue-800',
      icon: '👔',
      description: {
        mr: 'दुकान व्यवस्थापक — उत्पादने, साठा, चौकशी, काऊंटर बिलिंग, परतावा, सण ऑफर्स आणि विक्री अहवाल.',
        hi: 'स्टोर प्रबंधक — उत्पाद, स्टॉक, पूछताछ, काउंटर बिलिंग, रिटर्न, त्योहारी ऑफर्स और बिक्री रिपोर्ट।',
        en: 'Store Manager — Products CRUD, inventory stock, customer inquiries, counter billing, returns, festival offers, and sales reports.'
      },
      destUrl: '/admin/dashboard',
      permissions: {
        mr: ['उत्पादने CRUD', 'इन्व्हेंटरी साठा', 'सण ऑफर्स', '२५% सवलत मर्यादा', 'विक्री अहवाल'],
        hi: ['उत्पाद CRUD', 'इन्वेंट्री स्टॉक', 'त्योहारी ऑफर्स', '25% छूट सीमा', 'बिक्री रिपोर्ट'],
        en: ['Products CRUD', 'Inventory Stock', 'Festival Offers', '25% Max Discount', 'Sales Reports']
      }
    },
    {
      role: 'staff',
      title: {
        mr: 'काऊंटर कॅशियर (Billing Staff)',
        hi: 'काउंटर कैशियर (Billing Staff)',
        en: 'Counter Cashier (Billing Staff)'
      },
      roleBadge: '⚡ CASHIER',
      email: 'staff@pratikphatake.com',
      colorClass: 'text-emerald-400',
      badgeBg: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
      icon: '⚡',
      description: {
        mr: 'दुकान काऊंटर बिलिंग कर्मचारी — थेट POS काऊंटरवर जलद बिलिंग, पावती प्रिंटिंग, WhatsApp शेअर व ग्राहक नोंद.',
        hi: 'दुकान काउंटर बिलिंग कर्मचारी — सीधा POS काउंटर पर त्वरित बिलिंग, रसीद प्रिंटिंग, WhatsApp शेयर व ग्राहक रिकॉर्ड।',
        en: 'Counter Billing Staff — Rapid POS counter billing, invoice printing, WhatsApp share, and customer records.'
      },
      destUrl: '/admin/billing',
      permissions: {
        mr: ['थेट POS टर्मिनल', '१०% सवलत मर्यादा', 'पावती प्रिंट', 'WhatsApp शेअर', 'साठा चौकशी'],
        hi: ['सीधा POS टर्मिनल', '10% छूट सीमा', 'रसीद प्रिंट', 'WhatsApp शेयर', 'स्टॉक पूछताछ'],
        en: ['Direct POS Terminal', '10% Max Discount', 'Print Receipt', 'WhatsApp Share', 'Stock Check']
      }
    },
    {
      role: 'customer',
      title: {
        mr: 'नोंदणीकृत ग्राहक (Customer)',
        hi: 'पंजीकृत ग्राहक (Customer)',
        en: 'Registered Customer'
      },
      roleBadge: '🛍️ CUSTOMER',
      email: 'customer@pratikphatake.com',
      colorClass: 'text-purple-400',
      badgeBg: 'bg-purple-950 text-purple-300 border border-purple-800',
      icon: '🛍️',
      description: {
        mr: 'ग्राहक खाते — फटाके कॅटलॉग पाहणे, आवडती यादी, अंदाजे कोटेशन बिल पावती तयार करणे व WhatsApp चौकशी.',
        hi: 'ग्राहक खाता — पटाखा कैटलॉग देखना, पसंदीदा सूची, अनुमानित कोटेशन बिल रसीद बनाना और WhatsApp पूछताछ।',
        en: 'Customer Account — Browse crackers catalog, inquiry wishlist, generate quotation estimate receipt, and WhatsApp inquiry.'
      },
      destUrl: '/inquiry-cart',
      permissions: {
        mr: ['कॅटलॉग ब्राऊझ', 'आवडती यादी', 'कोटेशन बिल पावती', 'WhatsApp चौकशी'],
        hi: ['कैटलॉग ब्राउज़', 'पसंदीदा सूची', 'कोटेशन बिल रसीद', 'WhatsApp पूछताछ'],
        en: ['Browse Catalog', 'Wishlist', 'Quotation Bill', 'WhatsApp Inquiry']
      }
    }
  ];

  selectedRole = signal<UserRole>('super_admin');

  selectedPreset = () => this.rolePresets.find(p => p.role === this.selectedRole());

  loginForm: FormGroup = this.fb.group({
    email: ['superadmin@pratikphatake.com', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required, Validators.minLength(6)]]
  });

  setLanguage(lang: SupportedLang): void {
    this.translationService.setLang(lang);
  }

  getPresetTitle(preset: RolePreset | undefined): string {
    if (!preset) return '';
    const lang = this.translationService.currentLang();
    return preset.title[lang] || preset.title['mr'];
  }

  getPresetDescription(preset: RolePreset): string {
    const lang = this.translationService.currentLang();
    return preset.description[lang] || preset.description['mr'];
  }

  getPresetPermissions(preset: RolePreset): string[] {
    const lang = this.translationService.currentLang();
    return preset.permissions[lang] || preset.permissions['mr'];
  }

  selectRole(preset: RolePreset): void {
    this.selectedRole.set(preset.role);
    this.loginForm.patchValue({
      email: preset.email,
      password: 'admin123'
    });
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    const ok = await this.authService.login(email, password);
    if (ok) {
      const preset = this.selectedPreset();
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];
      
      const targetUrl = returnUrl || (preset ? preset.destUrl : '/admin/dashboard');

      const title = this.getPresetTitle(preset);
      const lang = this.translationService.currentLang();
      const msg = lang === 'en'
        ? `Logged in successfully! Welcome as ${title}.`
        : lang === 'hi'
          ? `सफल लॉगिन! ${title} के रूप में स्वागत है।`
          : `यशस्वी लॉगिन! ${title} म्हणून स्वागत आहे.`;

      this.toastService.success(msg);
      this.router.navigateByUrl(targetUrl);
    }
  }
}
