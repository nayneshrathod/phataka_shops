import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@shared/components/header.component';
import { FooterComponent } from '@shared/components/footer.component';
import { ToastComponent } from '@shared/components/toast.component';
import { MobileNavComponent } from '@shared/components/mobile-nav.component';
import { PwaPromptComponent } from '@shared/components/pwa-prompt.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ToastComponent,
    MobileNavComponent,
    PwaPromptComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-[#FAF9FF] text-[#171323] selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden w-full relative">
      <app-header />
      <main class="flex-1 w-full overflow-x-hidden">
        <router-outlet />
      </main>
      <app-footer />
      <app-mobile-nav />
      <app-pwa-prompt />
      <app-toast-container />
    </div>
  `
})
export class PublicLayoutComponent {}
