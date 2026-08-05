import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import ar from './locales/ar.json';

const STORAGE_KEY = 'dashboard-language';

/**
 * The languages offered in the header switcher.
 *
 * `dir` is what drives the whole right to left layout: it is handed to Ant
 * Design's ConfigProvider, which mirrors every component, and written to
 * <html dir> so the CSS logical properties in index.css flip with it.
 *
 * To add a language: drop a JSON file next to this one, import it above, add it
 * to `resources`, and add a row here. Nothing else needs to change.
 */
export const LANGUAGES = [
  { code: 'en', label: 'English', shortLabel: 'EN', dir: 'ltr' },
  { code: 'es', label: 'Español', shortLabel: 'ES', dir: 'ltr' },
  { code: 'ar', label: 'العربية', shortLabel: 'AR', dir: 'rtl' },
];

export const DEFAULT_LANGUAGE = 'en';

export const getLanguageMeta = (code) =>
  LANGUAGES.find((language) => language.code === code) || LANGUAGES[0];

const readStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.some((language) => language.code === stored)) return stored;
  } catch {
    /* private browsing, fall through to the browser preference */
  }
  const browser = navigator.language?.slice(0, 2);
  return LANGUAGES.some((language) => language.code === browser) ? browser : DEFAULT_LANGUAGE;
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    ar: { translation: ar },
  },
  lng: readStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    // React escapes for us already.
    escapeValue: false,
  },
});

i18n.on('languageChanged', (code) => {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* the choice just will not survive a reload */
  }
});

export default i18n;
