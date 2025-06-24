import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {

  title: "Planeta Keto | Recetas Cetogénicas para Perder Peso",
  description: "Descubre +100 recetas keto gratis: desayunos, almuerzos, cenas, postres y aperitivos, bajas en carbohidratos. Menús semanales, tips científicos y guías para empezar.",
  keywords: "keto, dieta keto, recetas keto, perder peso, desayuno keto, comida cetogénica, quemar grasa,pan nube keto, pan keto, pan sin harina, receta keto, receta baja en carbohidratos, keto en español, dieta cetogénica, pan esponjoso keto, pan con orégano, pan con queso, keto fácil, keto para principiantes, keto sin gluten, keto sin harina, keto recetas fáciles, keto rápido, keto diet, ketogenic diet, comida keto, recetas saludables, pan keto casero",
  metadataBase: new URL(process.env.SITE_URL || "https://planetaketo.es"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Planeta Keto | Recetas Cetogénicas para Perder Peso",
    description: "Descubre recetas keto comprobadas para bajar de peso sin sacrificar sabor",
    images: "/og-image.jpg",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh]`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

