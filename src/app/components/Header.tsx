import Link from "next/link";
import HeaderLink from "./HeaderLink";
import { client } from "../../lib/sanityClient";

async function getSiteTitle() {
  const data = await client.fetch(`*[_type == "homePage"][0]{siteTitle}`);
  return data?.siteTitle || "Planeta Keto";
}

export default async function Header() {
  const siteTitle = await getSiteTitle();

  return (
    <header className="m-0 px-4 bg-white shadow-md">
      <nav className="flex items-center justify-between">
        <h2 className="m-0 text-lg font-bold">
          <Link href="/" className="no-underline text-black">
            {siteTitle}
          </Link>
        </h2>
        <div className="flex">
          <HeaderLink href="/">Home</HeaderLink>
          <HeaderLink href="/blog">Blog</HeaderLink>
          <HeaderLink href="/about">About</HeaderLink>
        </div>
        {/* ...redes sociales igual... */}
      </nav>
    </header>
  );
}