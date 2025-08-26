import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import Navigation from "@/components/Navigation"
import PerformanceOptimizer from "@/components/PerformanceOptimizer"
import SEOBreadcrumbs from "@/components/SEOBreadcrumbs"
import { FooterLinks } from "@/components/InternalLinks"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planeta Keto | Las Mejores Recetas Cetogénicas en Español 2024",
  description: "🥑 +500 recetas keto GRATIS en español. Desayunos, comidas, cenas y postres cetogénicos para perder peso rápido. Menús semanales, guías paso a paso y tips de expertos. ¡Empieza tu transformación keto hoy!",
  keywords: "recetas keto, dieta keto, dieta cetogénica, bajar de peso, quemar grasa, recetas saludables, dieta baja carbohidratos, keto en español, recetas cetogénicas, comida keto, desayuno keto, almuerzo keto, cena keto, postres keto, tienda keto, dr bayter, cetosis, macros keto, menu keto, plan keto, keto facil, keto para principiantes, dieta cetogénica beneficios, alimentos keto, lista keto, productos keto, suplementos keto, libros keto, foro keto, blog keto, comunidad keto",
  metadataBase: new URL(process.env.SITE_URL || "https://planetaketo.es"),
  alternates: {
    canonical: "/",
    languages: {
      'es-ES': '/',
      'es-MX': '/',
      'es-AR': '/',
      'es-CO': '/',
    }
  },
  openGraph: {
    type: 'website',
    title: "Planeta Keto | Las Mejores Recetas Cetogénicas en Español 2024",
    description: "🥑 +500 recetas keto GRATIS. Transforma tu cuerpo con la dieta cetogénica más efectiva. Recetas fáciles, menús completos y guías de expertos.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Planeta Keto - Recetas Cetogénicas",
      }
    ],
    locale: 'es_ES',
    siteName: 'Planeta Keto',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@planetaketo',
    title: "Planeta Keto | Recetas Keto #1 en Español",
    description: "🥑 Las mejores recetas cetogénicas para perder peso. ¡Únete a miles que ya transformaron su vida!",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Food & Cooking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] bg-white`}
      >
        <Navigation />
        <SEOBreadcrumbs />
        <main className="min-h-screen">
          {children}
        </main>
        <FooterLinks />
        <Analytics />
        <PerformanceOptimizer 
          enablePreloading={true}
          enableServiceWorker={true}
          enableImageOptimization={true}
          enableResourceHints={true}
        />
        
        {/* Temporarily remove inline scripts that might block hydration */}
        {/* 
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Google Analytics
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
        */}
      </body>
    </html>
  );
}

