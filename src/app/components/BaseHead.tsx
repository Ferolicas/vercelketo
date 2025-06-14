// components/SeoHead.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SeoHeadProps {
  title: string;
  description: string;
  image?: string;
}

const SITE_TITLE = 'Tu Título del Sitio';
const SITE_URL = 'https://tusitio.com';
const FALLBACK_IMAGE = '/blog-placeholder-1.jpg';

export default function SeoHead({
  title,
  description,
  image = FALLBACK_IMAGE,
}: SeoHeadProps) {
  const router = useRouter();
  const canonicalURL = `${SITE_URL}${router.asPath}`;

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="sitemap" href="/sitemap-index.xml" />
      <link
        rel="alternate"
        type="application/rss+xml"
        title={SITE_TITLE}
        href={`${SITE_URL}/rss.xml`}
      />
      <link
        rel="preload"
        href="/fonts/atkinson-regular.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/atkinson-bold.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
      <link rel="canonical" href={canonicalURL} />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalURL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${SITE_URL}${image}`} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalURL} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${SITE_URL}${image}`} />
    </Head>
  );
}