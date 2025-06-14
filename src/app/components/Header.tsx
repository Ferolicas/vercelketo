import Link from "next/link";
import HeaderLink from "./HeaderLink";
import { client } from "@/lib/sanityClient";

async function getSiteTitle(): Promise<string> {
  const data = await client.fetch<{ siteTitle?: string }>(`*[_type == "homePage"][0]{siteTitle}`);
  return data?.siteTitle || "Planeta Keto";
}

export default async function Header() {
  const siteTitle = await getSiteTitle();

  return (
    <header className="m-0 px-4 bg-white shadow-md">
      <nav className="flex items-center justify-between h-16">
        <h2 className="m-0 text-lg font-bold">
          <Link href="/" className="no-underline text-black">
            {siteTitle}
          </Link>
        </h2>
        <div className="flex gap-4">
          <HeaderLink href="/">Home</HeaderLink>
          <HeaderLink href="/blog">Blog</HeaderLink>
          <HeaderLink href="/about">About</HeaderLink>
        </div>
        {/* Ejemplo de redes sociales, puedes personalizar o eliminar */}
        <div className="flex gap-3">
          <a
            href="https://twitter.com/astrodotbuild"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-black transition-colors"
            aria-label="Twitter"
          >
            <svg width={24} height={24} fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
            </svg>
          </a>
          {/* Agrega más iconos/redes si lo deseas */}
        </div>
      </nav>
    </header>
  );
}