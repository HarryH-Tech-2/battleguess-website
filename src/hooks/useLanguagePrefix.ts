import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isSupportedLanguage } from '../i18n';

export function useLanguagePrefix() {
  const { i18n } = useTranslation();
  const location = useLocation();

  const currentLang = i18n.language;
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
    if (currentLang !== 'en' && isSupportedLanguage(currentLang)) {
      basePath = pathname.replace(`/${currentLang}`, '') || '/';
    }
    if (targetLang === 'en') return basePath;
    return `/${targetLang}${basePath}`;
  }

  return { currentLang, prefix, localePath, switchLanguagePath };
}
