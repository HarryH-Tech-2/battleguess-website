import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';

export const supportedLanguages = ['en', 'fr', 'es'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (supportedLanguages as readonly string[]).includes(lang);
}

// Lazy loaders for non-default locales — keeps ~50KB of translations out of the
// initial bundle for the 95%+ of visitors who land on English. The English
// bundle is imported statically because it's also the fallback, so i18next
// needs it synchronously during init.
const localeLoaders: Record<Exclude<SupportedLanguage, 'en'>, () => Promise<Record<string, unknown>>> = {
  fr: () => import('./locales/fr.json').then(m => m.default as Record<string, unknown>),
  es: () => import('./locales/es.json').then(m => m.default as Record<string, unknown>),
};

// Detect language from URL on initial page load
const pathLang = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '';
const detectedLang: SupportedLanguage = isSupportedLanguage(pathLang) ? pathLang : 'en';

// Ensure a locale bundle is loaded into i18next; safe to call repeatedly.
export async function ensureLocaleLoaded(lang: SupportedLanguage): Promise<void> {
  if (lang === 'en') return;
  if (i18n.hasResourceBundle(lang, 'translation')) return;
  const translation = await localeLoaders[lang]();
  i18n.addResourceBundle(lang, 'translation', translation);
}

// Kick off i18n init + (if needed) async locale fetch. main.tsx awaits this
// before the first render so components never see a missing-translation flash.
export const i18nReady: Promise<void> = (async () => {
  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

  if (detectedLang !== 'en') {
    await ensureLocaleLoaded(detectedLang);
    await i18n.changeLanguage(detectedLang);
  }
})();

export default i18n;
