import Head from 'next/head';
import { useRouter } from 'next/router';

interface SeoHeadProps {
  title: string;
  description: string;
  image?: string; // URL de la imagen
}

const SITE_TITLE = 'Tu Título del Sitio'; // O importa desde un archivo de constantes
const SITE_URL = 'https://tusitio.com';   // Cambia por tu dominio real
const FALLBACK_IMAGE = '/blog-placeholder-1.jpg'; // Debe estar en /public

export default function SeoHead({
  title,
  description,
  image = FALLBACK_IMAGE,
}: SeoHeadProps) {
  const router = useRouter();
  const canonicalURL = `${SITE_URL}${router.asPath}`;

  return (
    <Head>
      {/* Global Metadata */}
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
      {/* Font preloads */}
      <link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/atkinson-bold.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalURL} />
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalURL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${SITE_URL}${image}`} />
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalURL} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${SITE_URL}${image}`} />
    </Head>
  );
}