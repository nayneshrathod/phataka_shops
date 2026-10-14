import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreSettingsService } from '@core/services/store-settings.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="py-12 bg-[#FAF9FF] min-h-screen">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <!-- Hero Header -->
        <div class="text-center space-y-3">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            🏢 विश्वास, परंपरा आणि आनंद
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {{ 'about.title' | translate }}
          </h1>
          <p class="text-sm text-slate-500 max-w-xl mx-auto">
            पुण्यातील अग्रगण्य आणि विश्वासू परवानाधारक फटाके दालन
          </p>
        </div>

        <!-- Story & Values Section -->
        <div class="bg-white rounded-3xl border border-purple-100 p-8 sm:p-12 shadow-sm space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="space-y-4">
              <h2 class="text-2xl font-bold text-purple-950 font-serif">
                आमचा २५ वर्षांचा गौरवशाली प्रवास
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed">
                गेल्या अडीच दशकांपासून दालनाचे संस्थापक व संचालक <strong>श्री. प्रतीक जगताप (Pratik Jagtap)</strong> यांच्या मार्गदर्शनाखाली <strong>प्रतीक फटाके</strong> पुणेकरांच्या दिवाळीत, लग्नसमारंभात आणि सण-उत्सवांत सुरक्षिततेचा आणि आनंदाचा प्रकाश पसरवत आहे. लक्ष्मी रोडवर सुरू झालेले हे दालन आज गुणवत्तेचे आणि ग्राहकांच्या विश्वासाचे अग्रगण्य नाव बनले आहे.
              </p>
              <p class="text-sm text-slate-600 leading-relaxed">
                आम्ही केवळ शिवकाशीतील नामांकित उत्पादकांकडून (उदा. स्टँडर्ड, कालिस्वरी, कोरोनेशन) थेट १००% अधिकृत, ओरिजिनल आणि पर्यावरणपूरक हरित फटाके ग्राहकांसाठी उपलब्ध करतो.
              </p>
            </div>

            <div class="rounded-2xl overflow-hidden border border-purple-100 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80"
                alt="Pratik Phatake Store"
                class="w-full h-72 object-cover"
              />
            </div>
          </div>

          <!-- Compliance Credentials -->
          <div class="pt-8 border-t border-purple-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
              <span class="text-2xl">📜</span>
              <h4 class="font-bold text-purple-950 text-sm">PESO परवानाधारक</h4>
              <p class="text-xs text-slate-600 font-mono">{{ settingsService.settings().licenseNumber }}</p>
            </div>

            <div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <span class="text-2xl">🌱</span>
              <h4 class="font-bold text-emerald-950 text-sm">१००% हरित फटाके</h4>
              <p class="text-xs text-slate-600">CSIR-NEERI अधिकृत फॉर्म्युलेशन (३०% कमी धूर)</p>
            </div>

            <div class="p-5 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
              <span class="text-2xl">🏬</span>
              <h4 class="font-bold text-amber-950 text-sm">अधिकृत दालन</h4>
              <p class="text-xs text-slate-600">{{ settingsService.settings().address }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AboutComponent {
  settingsService = inject(StoreSettingsService);
}
