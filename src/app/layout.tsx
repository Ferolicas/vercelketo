import './globals.css';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planeta Keto",
  description: "Recetas keto fáciles y deliciosas.",
  openGraph: {
    title: "Planeta Keto",
    description: "Recetas keto fáciles y deliciosas.",
    url: "https://tusitio.com",
    images: [
      {
        url: "https://tusitio.com/blog-placeholder-1.jpg",
        width: 1200,
        height: 630,
        alt: "Planeta Keto",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planeta Keto",
    description: "Recetas keto fáciles y deliciosas.",
    images: ["https://tusitio.com/blog-placeholder-1.jpg"],
  },
  alternates: {
    canonical: "https://tusitio.com",
    types: {
      "application/rss+xml": "https://tusitio.com/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}