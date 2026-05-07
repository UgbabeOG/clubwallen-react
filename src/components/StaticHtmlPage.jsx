import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function normalizeHref(href) {
  if (!href) return href;
  if (href.startsWith('https://shop.morganwallen.com/')) {
    return href.replace('https://shop.morganwallen.com', '');
  }
  if (href.startsWith('https://shopify.com/') || href.startsWith('https://shop.app/')) {
    return href;
  }
  if (href.startsWith('collections/') || href.startsWith('pages/') || href.startsWith('products/')) {
    return '/' + href.replace(/\.html$/, '').replace(/^(collections|pages|products)\//, '$1/');
  }
  return href;
}

function normalizeSrc(src) {
  if (!src) return src;
  // Handle Shopify CDN URLs with URL encoding
  if (src.includes('shop.morganwallen.com') || src.includes('cdn.shopify.com')) {
    // Decode URL if needed and strip protocol/domain
    let decoded = decodeURIComponent(src);
    decoded = decoded.replace(/https?:\/\/[^\/]+/, '');
    return decoded;
  }
  if (src.startsWith('https://shop.morganwallen.com/')) {
    return src.replace('https://shop.morganwallen.com', '');
  }
  if (src.startsWith('https://')) {
    // Keep external URLs as-is
    return src;
  }
  return src;
}

export default function StaticHtmlPage({ section, titleFallback, filePath }) {
  const params = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [pageTitle, setPageTitle] = useState(titleFallback || 'Page');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const slug = params.slug;
  const path = filePath || `/${section}/${slug}.html`;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load page: ${path}`);
        }
        return response.text();
      })
      .then((htmlText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const body = doc.body;

        if (doc.title) {
          setPageTitle(doc.title);
        }

        // Rewrite all anchor links
        body.querySelectorAll('a').forEach((anchor) => {
          const href = anchor.getAttribute('href');
          const normalized = normalizeHref(href);
          if (normalized) {
            anchor.setAttribute('href', normalized);
          }
          anchor.setAttribute('target', '_self');
        });

        // Rewrite all images and srcsets
        body.querySelectorAll('img').forEach((img) => {
          const src = img.getAttribute('src');
          if (src) {
            img.setAttribute('src', normalizeSrc(src));
          }
          const srcset = img.getAttribute('srcset');
          if (srcset) {
            const normalized = srcset
              .split(',')
              .map((entry) => {
                const [url, ...rest] = entry.trim().split(/\s+/);
                return [normalizeSrc(url), ...rest].join(' ');
              })
              .join(', ');
            img.setAttribute('srcset', normalized);
          }
        });

        // Rewrite all other src attributes
        body.querySelectorAll('[src]').forEach((node) => {
          if (node.tagName !== 'IMG') {
            const src = node.getAttribute('src');
            if (src && !src.includes('https://') && !src.includes('//')) {
              const normalized = normalizeSrc(src);
              if (normalized) {
                node.setAttribute('src', normalized);
              }
            }
          }
        });

        // Remove external stylesheets and scripts
        body.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
          const href = link.getAttribute('href');
          if (href && href.includes('https://')) {
            link.remove();
          }
        });
        body.querySelectorAll('link[rel="canonical"]').forEach((link) => link.remove());
        body.querySelectorAll('script').forEach((script) => script.remove());

        setContent(body.innerHTML);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [path]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  if (loading) {
    return <section className="page-loading p-lg-lg">Loading…</section>;
  }

  if (error) {
    return (
      <section className="page-error p-lg-lg">
        <h1>Page not found</h1>
        <p>{error}</p>
        <button className="btn btn--primary" onClick={() => navigate('/')}>Return home</button>
      </section>
    );
  }

  return (
    <section className="page-content" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
