import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';
import adminEn from './locales/admin-en.json';
import adminRu from './locales/admin-ru.json';
import adminUz from './locales/admin-uz.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        translation: { ...en, ...adminEn }
      },
      ru: { 
        translation: { ...ru, ...adminRu }
      },
      uz: { 
        translation: { ...uz, ...adminUz }
      },
    },
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
