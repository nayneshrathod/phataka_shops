import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-safety',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="py-12 bg-[#FAF9FF] min-h-screen">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <!-- Header -->
        <div class="text-center space-y-3">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            🛡️ सुरक्षितता हीच आनंदाची गुरुकिल्ली
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {{ 'safety.title' | translate }}
          </h1>
          <p class="text-sm text-slate-500 max-w-xl mx-auto">
            सर्वोच्च न्यायालय, PESO आणि अग्निशामक दलाने जारी केलेली अधिकृत मार्गदर्शक तत्त्वे
          </p>
        </div>

        <!-- Emergency Contacts Bar -->
        <div class="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🚨</span>
            <div>
              <h3 class="font-bold text-rose-950 text-sm">आपत्कालीन मदत क्रमांक (Emergency Helpline)</h3>
              <p class="text-xs text-rose-700">कोणत्याही दुर्घटनेवेळी तात्काळ संपर्क साधा</p>
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs font-bold text-rose-900 font-mono">
            <span class="px-3 py-1.5 bg-white rounded-xl border border-rose-200 shadow-sm">🚒 अग्निशामक: १०१</span>
            <span class="px-3 py-1.5 bg-white rounded-xl border border-rose-200 shadow-sm">🚑 रुग्णवाहिका: १०८</span>
            <span class="px-3 py-1.5 bg-white rounded-xl border border-rose-200 shadow-sm">🚓 पोलीस: ११२</span>
          </div>
        </div>

        <!-- Do's and Don'ts Matrix -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Do's -->
          <div class="bg-white rounded-3xl border border-emerald-100 p-8 shadow-sm space-y-6">
            <div class="flex items-center gap-3 text-emerald-700">
              <span class="text-2xl">✅</span>
              <h2 class="text-xl font-bold font-serif text-slate-900">
                {{ 'safety.dos' | translate }}
              </h2>
            </div>
            
            <ul class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <li class="flex items-start gap-3">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>फटाके नेहमी मोकळ्या मैदानात किंवा इमारती, झाडे व वाहनांपासून दूर पेटवा.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>जवळ नेहमी एक बादली पाणी किंवा वाळू आणि प्रथमोपचार पेटी तयार ठेवा.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>फटाके पेटवताना सुती आणि घट्ट कपडे परिधान करा. सैल किंवा नायलॉन कपडे टाळा.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>फुलबाज्या किंवा अनार लांब अगरबत्ती किंवा फुलवातीच्या साहाय्याने सुरक्षित अंतरावरून पेटवा.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>लहान मुले फटाके उडवताना मोठ्या व्यक्तींची उपस्थिती अनिवार्य ठेवा.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>विझलेल्या फुलबाज्यांच्या तारा त्वरित पाण्याच्या बादलीत टाका.</span>
              </li>
            </ul>
          </div>

          <!-- Don'ts -->
          <div class="bg-white rounded-3xl border border-rose-100 p-8 shadow-sm space-y-6">
            <div class="flex items-center gap-3 text-rose-700">
              <span class="text-2xl">❌</span>
              <h2 class="text-xl font-bold font-serif text-slate-900">
                {{ 'safety.donts' | translate }}
              </h2>
            </div>

            <ul class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <li class="flex items-start gap-3">
                <span class="text-rose-600 font-bold">✗</span>
                <span>फटाके कधीही हातात धरून पेटवू नका किंवा अंगावर फेकू नका.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-rose-600 font-bold">✗</span>
                <span>बंद घरात, बाल्कनीत किंवा इमारतीच्या जिन्यात फटाके पेटवू नका.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-rose-600 font-bold">✗</span>
                <span>न फुटलेल्या (फुसक्या) फटाक्याजवळ पुन्हा लगेच जाऊ नका किंवा तोंड जवळ नेऊ नका.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-rose-600 font-bold">✗</span>
                <span>काचेच्या बाटल्यांमध्ये किंवा डब्यांमध्ये ठेवून कधीही रॉकेट किंवा फटाके पेटवू नका.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-rose-600 font-bold">✗</span>
                <span>दवाखाने, आजारी व्यक्ती, वृद्ध व पाळीव प्राण्यांच्या जवळ फटाके उडवणे टाळा.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-rose-600 font-bold">✗</span>
                <span>खिशात फटाके किंवा माचिस बाळगू नका.</span>
              </li>
            </ul>
          </div>

        </div>

        <!-- Green Cracker Mandate Strip -->
        <div class="bg-emerald-950 text-white rounded-3xl p-8 space-y-4 shadow-xl">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🌱</span>
            <h3 class="text-lg font-bold text-amber-300">
              सर्वोच्च न्यायालयाचे हरित फटाके बंधन
            </h3>
          </div>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
            सर्वोच्च न्यायालयाच्या आदेशानुसार केवळ CSIR-NEERI मान्यताप्राप्त हरित फटाक्यांचा वापर करण्यास परवानगी आहे. प्रतीक फटाके केवळ अधिकृत QR कोड असणारे हरित फटाके विकते, ज्यामुळे बेरियम व इतर विषारी घटकांपासून संरक्षण मिळते.
          </p>
        </div>

      </div>
    </div>
  `
})
export class SafetyComponent {}
