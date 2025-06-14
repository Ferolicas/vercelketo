import { ReactNode } from "react";
import Head from "next/head";

interface MainLayoutProps {
  title?: string;
  children: ReactNode;
}

export default function MainLayout({ title = "Planeta Keto", children }: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        {/* Google Fonts: Notable & Rubik Doodle Shadow */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Notable&family=Rubik+Doodle+Shadow&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gray-50 font-sans min-h-screen text-gray-900 overflow-x-hidden">
        {children}
      </div>
    </>
  );
}