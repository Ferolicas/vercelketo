import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface HeaderLinkProps {
  href: string;
  children: ReactNode;
}

export default function HeaderLink({ href, children }: HeaderLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-2 py-4 border-b-4 transition-colors ${
        isActive
          ? "border-accent text-accent"
          : "border-transparent text-black hover:text-accent"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}