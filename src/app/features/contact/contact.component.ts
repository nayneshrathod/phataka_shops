import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreSettingsService } from '@core/services/store-settings.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="py-12 bg-[#FAF9FF] min-h-screen">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <!-- Header -->
        <div class="text-center space-y-3">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            📍 थेट संपर्क व दुकान पत्ता
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {{ 'contact.title' | translate }}
          </h1>
          <p class="text-sm text-slate-500 max-w-xl mx-auto">
            आमच्या अधिकृत लक्ष्मी रोड दालनाला भेट द्या किंवा फोन/WhatsApp वर माहिती मिळवा.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Contact Details Cards (7 cols) -->
          <div class="lg:col-span-7 space-y-6">
            <div class="bg-white rounded-3xl border border-purple-100 p-8 shadow-sm space-y-6">
              
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl flex-shrink-0">
                  🏢
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base">दुकान पत्ता</h3>
                  <p class="text-sm text-slate-600 mt-1 leading-relaxed">
                    {{ settingsService.settings().address }}
                  </p>
                  <p class="text-xs text-purple-600 font-medium mt-1">
                    (अलका टॉकीज चौकाजवळ, मध्यवर्ती पुणे)
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 pt-4 border-t border-purple-50">
                <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl flex-shrink-0">
                  📞
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base">फोन क्रमांक</h3>
                  <a [href]="'tel:' + settingsService.settings().contactNumber" class="text-sm font-bold text-purple-700 hover:underline mt-1 block">
                    {{ settingsService.settings().contactNumber }}
                  </a>
                  <p class="text-xs text-slate-500 mt-0.5">सकाळी ९ ते रात्री १० दरम्यान उपलब्ध</p>
                </div>
              </div>

              <div class="flex items-start gap-4 pt-4 border-t border-purple-50">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl flex-shrink-0">
                  💬
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base">WhatsApp थेट चौकशी</h3>
                  <a
                    [href]="'https://wa.me/' + settingsService.settings().whatsappNumber.replace('+', '')"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm font-bold text-emerald-700 hover:underline mt-1 block"
                  >
                    {{ settingsService.settings().whatsappNumber }}
                  </a>
                  <p class="text-xs text-slate-500 mt-0.5">साठा व दर विचारा (नॉन-ट्रान्झॅक्शनल)</p>
                </div>
              </div>

              <div class="flex items-start gap-4 pt-4 border-t border-purple-50">
                <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl flex-shrink-0">
                  ⏰
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base">कामकाजाची वेळ</h3>
                  <p class="text-sm text-slate-700 font-semibold mt-1">
                    {{ settingsService.settings().workingHours }}
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">दिवाळी सण काळात सर्व ७ दिवस सुरू</p>
                </div>
              </div>

            </div>

            <!-- Statutory Notice -->
            <div class="p-5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              ⚖️ <strong>कायदेशीर सूचना:</strong> कृपया नोंद घ्या की आम्ही कोणत्याही प्रकारची ऑनलाइन विक्री किंवा होम डिलिव्हरी करत नाही. खरेदी केवळ दुकानात प्रत्यक्ष उपस्थित राहूनच करावी.
            </div>
          </div>

          <!-- Map & Visit CTA (5 cols) -->
          <div class="lg:col-span-5 bg-white rounded-3xl border border-purple-100 p-8 shadow-sm space-y-6 text-center">
            <div class="w-20 h-20 rounded-3xl bg-purple-50 text-purple-700 flex items-center justify-center text-4xl mx-auto">
              🗺️
            </div>
            
            <div class="space-y-2">
              <h3 class="text-xl font-bold text-slate-900 font-serif">
                दुकानात प्रत्यक्ष भेट द्या
              </h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                आमच्या प्रशस्त दालनात सर्व प्रकारचे फटाके प्रत्यक्ष पाहून, त्यांची गुणवत्ता तपासून खात्रीने खरेदी करा.
              </p>
            </div>

            <div class="pt-2 space-y-3">
              <a
                [href]="settingsService.settings().googleMapsUrl || 'https://maps.google.com'"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-3.5 px-6 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>📍</span>
                <span>Google Maps वर नेव्हिगेशन सुरू करा</span>
              </a>

              <a
                routerLink="/inquiry"
                class="w-full py-3.5 px-6 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>📋</span>
                <span>ऑनलाइन साठा चौकशी फॉर्म भरा</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class ContactComponent {
  settingsService = inject(StoreSettingsService);
}
