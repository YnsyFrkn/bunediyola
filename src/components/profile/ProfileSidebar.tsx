"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/profil", label: "Profilim" },
  { href: "/profil/comments", label: "Yorumlarim" },
  { href: "/profil/likes", label: "Begendiklerim" },
  { href: "/profil/favorites", label: "Kaydettiklerim" },
  { href: "/profil/settings", label: "Ayarlar" },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[28px] border border-[#f1e6dd] bg-white p-4 shadow-sm lg:sticky lg:top-28">
      <p className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c2410c]">
        Profil
      </p>
      <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-[#111827] text-white shadow-[0_12px_24px_rgba(17,24,39,0.12)]"
                  : "text-[#374151] hover:bg-[#fff7ed] hover:text-[#c2410c]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
