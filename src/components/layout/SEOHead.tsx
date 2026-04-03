import { useEffect } from 'react';
import { supportedLanguages } from '../../i18n';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  path?: string;
  jsonLd?: object | object[];
  ogImage?: string;
  robots?: string;
}

const BASE_URL = 'https://battleguess.app';

function setMetaTag(property: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let tag = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, property);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function SEOHead({ title, description, canonical, path, jsonLd, ogImage, robots = 'index, follow' }: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    setMetaTag('description', description);
    setMetaTag('robots', robots);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', canonical, true);
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:url', canonical);

    if (ogImage) {
      setMetaTag('og:image', ogImage, true);
      setMetaTag('twitter:image', ogImage);
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    // Clean up old hreflang tags
    document.querySelectorAll('link[hreflang]').forEach(el => el.remove());

    // Generate hreflang tags for all supported languages + x-default
    if (path !== undefined) {
      const basePath = path || '/';

      for (const lang of supportedLanguages) {
        const hreflang = document.createElement('link');
        hreflang.rel = 'alternate';
        hreflang.hreflang = lang;
        hreflang.href = lang === 'en' ? `${BASE_URL}${basePath}` : `${BASE_URL}/${lang}${basePath}`;
        document.head.appendChild(hreflang);
      }

      // x-default points to English (no prefix)
      const xDefault = document.createElement('link');
      xDefault.rel = 'alternate';
      xDefault.hreflang = 'x-default';
      xDefault.href = `${BASE_URL}${basePath}`;
      document.head.appendChild(xDefault);
    }

    // JSON-LD
    document.querySelectorAll('.seo-jsonld').forEach(el => el.remove());
    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((item, index) => {
        const script = document.createElement('script');
        script.className = 'seo-jsonld';
        script.id = `seo-jsonld-${index}`;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(item);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.querySelectorAll('.seo-jsonld').forEach(el => el.remove());
    };
  }, [title, description, canonical, path, jsonLd, ogImage, robots]);

  return null;
}
