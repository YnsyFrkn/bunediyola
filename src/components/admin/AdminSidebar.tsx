"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const menuItems = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/posts", label: "Yazilar" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/polls", label: "Anketler" },
  { href: "/admin/comments", label: "Yorumlar" },
  { href: "/admin/users", label: "Kullanicilar" },
  { href: "/admin/notifications", label: "Bildirimler" },
  { href: "/admin/reports", label: "Sikayetler" },
  { href: "/", label: "Siteye Don" },
];

type AdminSidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
  };
};

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="h-auto rounded-[28px] border border-white/10 bg-[#111827] p-4 text-white shadow-[0_24px_60px_rgba(17,24,39,0.18)] sm:p-5 lg:flex lg:h-full lg:flex-col lg:justify-between lg:rounded-[32px]">
      <div className="flex items-center justify-between gap-4 lg:block">
        <div className="min-w-0 space-y-1 lg:space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#fdba74]">Admin</p>
          <Link href="/admin" className="font-heading text-2xl sm:text-3xl">
            bunediyola
          </Link>
          <p className="hidden text-sm leading-7 text-[#d1d5db] lg:block">
            Icerikleri rahatca yonetebilmeniz icin sade bir panel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-white/20 px-4 text-sm font-semibold transition hover:border-[#fdba74] hover:bg-white/10 lg:hidden"
          aria-expanded={isOpen}
          aria-controls="admin-mobile-menu"
        >
          {isOpen ? "Kapat" : "Admin Menu"}
        </button>
      </div>

      <div
        id="admin-mobile-menu"
        className={`${isOpen ? "mt-6 grid" : "hidden"} max-h-[calc(100dvh-10rem)] gap-6 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)] lg:mt-8 lg:flex lg:max-h-none lg:min-h-0 lg:flex-1 lg:flex-col lg:justify-between lg:overflow-visible`}
      >
        <nav className="grid gap-2">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === item.href
                : item.href === "/"
                  ? false
                  : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#fff7ed] text-[#9a3412]"
                    : "text-[#e5e7eb] hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#d1d5db]">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#fdba74]">
              Giris yapan hesap
            </p>
            <p className="mt-2 text-base font-semibold text-white">{user.name ?? "Admin"}</p>
            <p className="break-all text-sm text-[#d1d5db]">{user.email ?? "admin"}</p>
          </div>
          <p className="hidden lg:block">
            Panel yalnizca admin oturumu olan kullanicilar icin aciktir. Isin bittiginde guvenli
            sekilde cikis yapabilirsin.
          </p>
          <ThemeToggle compact />
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
