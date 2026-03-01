import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isSupportedLanguage } from '../i18n';

export function useLanguagePrefix() {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();

  const currentLang = lang && isSupportedLanguage(lang) ? lang : 'en';

  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang, i18n]);

  const prefix = currentLang === 'en' ? '' : `/${currentLang}`;

  function localePath(path: string): string {
    return `${prefix}${path}`;
  }

  /**
   * Given the current location, return the equivalent path for a different language.
   */
  function switchLanguagePath(targetLang: string): string {
    const pathname = location.pathname;
    // Strip current lang prefix if present
    let basePath = pathname;
    if (lang && isSupportedLanguage(lang)) {
      basePath = pathname.replace(`/${lang}`, '') || '/';
    }
    if (targetLang === 'en') return basePath;
    return `/${targetLang}${basePath}`;
  }

  return { currentLang, prefix, localePath, switchLanguagePath };
}
