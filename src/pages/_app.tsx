// /pages/_app.tsx
import '../app/globals.css'; // Ajusta la ruta si tu CSS está en otro sitio

import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}