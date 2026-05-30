"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Landing" },
  { href: "/flavours", label: "Flavours" },
  { href: "/reviews", label: "Reviews" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-[#f5f7ff]/16 bg-[#0b0f14]/60 px-3 py-2 text-[#f5f7ff] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <Link
          href="/"
          className="text-sm font-black uppercase tracking-[0.32em] text-[#f5f7ff]"
        >
          Cryo
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-md px-3 py-2 text-xs font-black uppercase tracking-[0.16em] transition md:text-sm",
                  active
                    ? "bg-[#f5f7ff] text-[#0b0f14]"
                    : "text-[#f5f7ff]/72 hover:bg-[#f5f7ff]/12 hover:text-[#f5f7ff]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
