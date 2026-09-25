import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
}

/**
 * Only manages <title> client-side. Description/OG/Twitter meta tags are
 * injected server-side per-request (see server/src/createApp.js +
 * seoResolver.js) based on the actual requested URL - that's what crawlers
 * and social-link-preview bots see, since they hit the real URL directly
 * rather than navigating the SPA. Having Helmet also render those tags
 * would produce duplicate <meta> elements (Helmet has no way to know about
 * tags that were already in the server-rendered HTML), which is worse for
 * SEO than leaving them server-only. <title> is safe to keep live-updated
 * here since the browser only ever has one <title> element.
 */
export default function SEO({ title }: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}
