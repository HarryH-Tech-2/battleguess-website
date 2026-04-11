import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  /**
   * Previously used to emit per-page hreflang alternates. Kept as an optional
   * prop so existing callers don't need to change while real content
   * translations are being built out.
   */
  path?: string;
  jsonLd?: object | object[];
  ogImage?: string;
  robots?: string;
}

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

export function SEOHead({ title, description, canonical, jsonLd, ogImage, robots = 'index, follow' }: SEOHeadProps) {
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

    // Hreflang alternates are intentionally not emitted: the /fr and /es
    // routes exist at runtime but the underlying content (battle descriptions,
    // blog posts, etc.) is still English, so pointing hreflang at them would
    // cause duplicate-content penalties. Re-enable once body content is
    // actually translated.
    document.querySelectorAll('link[hreflang]').forEach(el => el.remove());

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
  }, [title, description, canonical, jsonLd, ogImage, robots]);

  return null;
}
