import { create } from 'zustand';
import { TRANSLATIONS, TranslationKey } from '../i18n/translations';

export type Language = 'en' | 'ne';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

export const useLanguageStore = create<LanguageState>((set, get) => {
  const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('ns_language') : null) as Language;
  const initialLang: Language = savedLang === 'ne' ? 'ne' : 'en';

  return {
    language: initialLang,
    setLanguage: (lang: Language) => {
      localStorage.setItem('ns_language', lang);
      set({ language: lang });
    },
    toggleLanguage: () => {
      const next = get().language === 'en' ? 'ne' : 'en';
      localStorage.setItem('ns_language', next);
      set({ language: next });
    },
    t: (key: TranslationKey, params?: Record<string, string | number>) => {
      const lang = get().language;
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
      let text = (dict as any)[key] || (TRANSLATIONS.en as any)[key] || key;

      if (params) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        });
      }
      return text;
    }
  };
});
