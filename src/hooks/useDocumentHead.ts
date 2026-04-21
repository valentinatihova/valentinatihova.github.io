import { useEffect } from 'react';
import { SITE_URL } from '../config/site';

interface DocumentHeadOptions {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}
const DEFAULT_TITLE = 'Valentina Tihova | Senior Data & MarTech Engineer';
const DEFAULT_DESCRIPTION =
  'Editorial portfolio of Valentina Tihova, Senior Data & MarTech Engineer. Decisioning systems, analytics delivery, martech architecture, case studies, and visual data storytelling.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_URL = `${SITE_URL}/`;

function setMetaContent(selector: string, content: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute('content', content);
}

function setLinkHref(rel: string, href: string) {
  const el = document.head.querySelector(`link[rel="${rel}"]`);
  if (el) el.setAttribute('href', href);
}

export function useDocumentHead({ title, description, image, url }: DocumentHeadOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[name="twitter:title"]', title);

    if (description) {
      setMetaContent('meta[name="description"]', description);
      setMetaContent('meta[property="og:description"]', description);
      setMetaContent('meta[name="twitter:description"]', description);
    }
    if (image) {
      setMetaContent('meta[property="og:image"]', image);
      setMetaContent('meta[name="twitter:image"]', image);
    }
    if (url) {
      setMetaContent('meta[property="og:url"]', url);
      setLinkHref('canonical', url);
    }

    return () => {
      document.title = previousTitle;
      setMetaContent('meta[property="og:title"]', DEFAULT_TITLE);
      setMetaContent('meta[name="twitter:title"]', DEFAULT_TITLE);
      setMetaContent('meta[name="description"]', DEFAULT_DESCRIPTION);
      setMetaContent('meta[property="og:description"]', DEFAULT_DESCRIPTION);
      setMetaContent('meta[name="twitter:description"]', DEFAULT_DESCRIPTION);
      setMetaContent('meta[property="og:image"]', DEFAULT_IMAGE);
      setMetaContent('meta[name="twitter:image"]', DEFAULT_IMAGE);
      setMetaContent('meta[property="og:url"]', DEFAULT_URL);
      setLinkHref('canonical', DEFAULT_URL);
    };
  }, [title, description, image, url]);
}
