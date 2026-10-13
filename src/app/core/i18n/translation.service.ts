import { Injectable, signal, computed } from '@angular/core';
import { TRANSLATIONS, SupportedLang } from './translations';

export type { SupportedLang };

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'pratik_phatake_lang';
  
  // Default language is Marathi ('mr') as per business requirement
  private readonly currentLangSignal = signal<SupportedLang>(this.getInitialLang());

  readonly currentLang = this.currentLangSignal.asReadonly();

  readonly availableLanguages: { code: SupportedLang; label: string; flag: string }[] = [
    { code: 'mr', label: 'मराठी', flag: '🚩' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'en', label: 'English', flag: '🌐' }
  ];

  private getInitialLang(): SupportedLang {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(this.STORAGE_KEY) as SupportedLang | null;
        if (saved && (saved === 'mr' || saved === 'hi' || saved === 'en')) {
          return saved;
        }
      }
    } catch {
      // In SSR or test environments
    }
    return 'mr'; // Default Marathi
  }

  setLanguage(lang: SupportedLang): void {
    this.currentLangSignal.set(lang);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, lang);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch {
      // ignore storage errors
    }
  }

  setLang(lang: SupportedLang): void {
    this.setLanguage(lang);
  }

  t(key: string): string {
    const lang = this.currentLangSignal();
    const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.mr;
    if (dictionary && dictionary[key]) {
      return dictionary[key];
    }
    // Fallback to English, then Marathi, then return key
    return (TRANSLATIONS.en && TRANSLATIONS.en[key]) || (TRANSLATIONS.mr && TRANSLATIONS.mr[key]) || key;
  }
}
