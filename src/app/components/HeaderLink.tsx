import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface HeaderLinkProps {
  href: string;
  children: ReactNode;
}

export default function HeaderLink({ href, children }: HeaderLinkProps) {
  const { pathname } = useRouter();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-2 py-4 border-b-4 transition-colors ${
        isActive
          ? "border-accent text-accent"
          : "border-transparent text-black hover:text-accent"
      }`}
    >
      {children}
    </Link>
  );
}