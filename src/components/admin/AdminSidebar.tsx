"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const menuItems = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/posts", label: "Yazilar" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/comments", label: "Yorumlar" },
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

  return (
    <aside className="flex h-full flex-col justify-between rounded-[32px] border border-white/10 bg-[#111827] p-5 text-white shadow-[0_24px_60px_rgba(17,24,39,0.18)]">
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#fdba74]">Admin</p>
          <Link href="/admin" className="font-heading text-3xl">
            bunediyola
          </Link>
          <p className="text-sm leading-7 text-[#d1d5db]">
            Icerikleri rahatca yonetebilmeniz icin sade bir panel.
          </p>
        </div>

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
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#d1d5db]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#fdba74]">
            Giris yapan hesap
          </p>
          <p className="mt-2 text-base font-semibold text-white">{user.name ?? "Admin"}</p>
          <p className="text-sm text-[#d1d5db]">{user.email ?? "admin"}</p>
        </div>
        <p>
          Panel yalnizca admin oturumu olan kullanicilar icin aciktir. Isin bittiginde guvenli
          sekilde cikis yapabilirsin.
        </p>
        <ThemeToggle compact />
        <LogoutButton />
      </div>
    </aside>
  );
}
