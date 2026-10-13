import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="py-12 bg-[#FAF9FF] min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            🎉 दिवाळी विशेष सण ऑफर्स २०२६
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {{ 'nav.offers' | translate }}
          </h1>
          <p class="text-sm text-slate-500">
            परवानाधारक दुकानात प्रत्यक्ष खरेदीवर विशेष कॉम्बो सवलती आणि दर्जेदार उत्पादने.
          </p>
        </div>

        <!-- Featured Promo Banners -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="rounded-3xl p-8 bg-gradient-to-br from-purple-900 to-indigo-950 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6">
            <div class="space-y-3">
              <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950">
                कॉम्बो ऑफर १
              </span>
              <h3 class="text-2xl font-black font-serif text-amber-300">
                कौटुंबिक शुभ दिवाळी कॉम्बो हॅम्पर
              </h3>
              <p class="text-xs text-purple-200/80 leading-relaxed">
                २५ विविध वस्तूंचा परिपूर्ण संच. फुलबाज्या, अनार, चक्र, कारंजे आणि मुलांचे खेळणे एकाच पेटीत. दुकानात प्रत्यक्ष खरेदीवर विशेष सवलत.
              </p>
            </div>
            <div>
              <div class="text-2xl font-black text-white">
                ₹१,२५० <span class="text-xs text-slate-400 line-through">₹१,६००</span>
              </div>
              <div class="pt-4">
                <a routerLink="/inquiry" class="inline-block px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md">
                  दुकानासाठी चौकशी करा →
                </a>
              </div>
            </div>
          </div>

          <div class="rounded-3xl p-8 bg-gradient-to-br from-amber-700 via-purple-950 to-slate-950 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6">
            <div class="space-y-3">
              <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-400 text-slate-950">
                कॉम्बो ऑफर २
              </span>
              <h3 class="text-2xl font-black font-serif text-amber-200">
                महाराजा रॉयल सेलिब्रेशन कॉम्बो (स्काय शो सह)
              </h3>
              <p class="text-xs text-purple-200/80 leading-relaxed">
                ४५ राजेशाही फटाके, ३० शॉट्स नाईट ग्लोरी स्काय केक सह. भव्य दीपोत्सवासाठी आणि सोसायट्यांसाठी उत्तम निवड.
              </p>
            </div>
            <div>
              <div class="text-2xl font-black text-white">
                ₹२,८५० <span class="text-xs text-slate-400 line-through">₹३,५००</span>
              </div>
              <div class="pt-4">
                <a routerLink="/inquiry" class="inline-block px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md">
                  दुकानासाठी चौकशी करा →
                </a>
              </div>
            </div>
          </div>

        </div>

        <!-- Compliance Note -->
        <div class="p-5 bg-white rounded-2xl border border-purple-100 text-xs text-slate-600 leading-relaxed text-center max-w-3xl mx-auto shadow-sm">
          ⚖️ <strong>सूचना:</strong> सर्व सवलती व ऑफर्स केवळ आमच्या लक्ष्मी रोड, पुणे येथील अधिकृत दुकानात प्रत्यक्ष खरेदीसाठी लागू आहेत. कायद्यानुसार ऑनलाइन पेमेंट किंवा कुरिअर डिलिव्हरी स्वीकारली जात नाही.
        </div>

      </div>
    </div>
  `
})
export class OffersComponent {
  productService = inject(ProductService);
}
