import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import Navigation from "@/components/Navigation"
import PerformanceOptimizer from "@/components/PerformanceOptimizer"
import SEOBreadcrumbs from "@/components/SEOBreadcrumbs"
import { FooterLinks } from "@/components/InternalLinks"
import SchemaMarkup from "@/components/SchemaMarkup"
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics"
import SearchConsoleVerification from "@/components/analytics/SearchConsoleVerification"
import ConversionTrackingSetup from "@/components/analytics/ConversionTracking"

// Enhanced performance components
import CriticalCSS, { LayoutStabilizer } from "@/components/performance/CriticalCSS"
import WebVitalsTracker from "@/components/performance/WebVitalsTracker"
import AdSenseOptimizer from "@/components/performance/AdSenseOptimizer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Planeta Keto | +500 Recetas Cetogénicas GRATIS 2025",
  description: "🥑 Recetas keto fáciles y rápidas. Pierde peso con la dieta cetogénica más efectiva. +500 recetas GRATIS, menús semanales y guía completa.",
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
        
        {/* Critical CSS injection */}
        <CriticalCSS />
        
        {/* Schema Markup para Organization y Website */}
        <SchemaMarkup 
          type="organization" 
          data={{}} 
        />
        <SchemaMarkup 
          type="website" 
          data={{}} 
        />
        
        {/* Google Search Console Verification */}
        <SearchConsoleVerification 
          verificationCode={process.env.GOOGLE_VERIFICATION}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] bg-white`}
      >
        <LayoutStabilizer>
          <Navigation />
          <SEOBreadcrumbs />
          <main className="min-h-screen">
            {children}
          </main>
          <FooterLinks />
        </LayoutStabilizer>

        <Analytics />
        
        {/* Enhanced Performance Optimizer */}
        <PerformanceOptimizer 
          enablePreloading={true}
          enableServiceWorker={true}
          enableImageOptimization={true}
          enableResourceHints={true}
        />
        
        {/* Web Vitals Tracker (development only) */}
        <WebVitalsTracker />
        
        {/* Enhanced Google Analytics 4 with conversion tracking */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID} />
            <ConversionTrackingSetup measurementId={process.env.NEXT_PUBLIC_GA_ID} />
          </>
        )}
        
        {/* Optimized AdSense with performance tracking */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <AdSenseOptimizer 
            clientId={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
            enableLazyLoading={true}
            enablePerformanceTracking={true}
            adLoadDelay={2000}
          />
        )}
      </body>
    </html>
  );
}