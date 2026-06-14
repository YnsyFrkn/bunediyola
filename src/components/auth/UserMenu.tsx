"use client";

import type { UserRole } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  role?: UserRole;
};

type SessionResponse = {
  user?: SessionUser;
};

type UserMenuProps = {
  onNavigate?: () => void;
  compact?: boolean;
};

export function UserMenu({ onNavigate, compact = false }: UserMenuProps) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const session = (await response.json()) as SessionResponse | null;

        if (isMounted) {
          setUser(session?.user ?? null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSession();
    window.addEventListener("auth-changed", loadSession);

    return () => {
      isMounted = false;
      window.removeEventListener("auth-changed", loadSession);
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    setIsMenuOpen(false);
    await signOut({
      redirect: false,
    });
    setUser(null);
    onNavigate?.();
    router.push("/");
    router.refresh();
    setIsSigningOut(false);
  }

  const linkClass = compact
    ? "rounded-2xl px-4 py-3 text-sm font-semibold text-[#1f2937] transition hover:bg-[#fff7ed] hover:text-[#c2410c]"
    : "inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition hover:border-[#fdba74] hover:text-[#c2410c]";
  const primaryClass = compact
    ? "rounded-2xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
    : "inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]";

  if (isLoading) {
    return <div className={compact ? "h-11" : "h-11 w-24"} aria-hidden="true" />;
  }

  if (!user) {
    return (
      <div className={compact ? "grid gap-2" : "flex items-center"}>
        {compact ? <ThemeToggle compact /> : null}
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            openAuthModal("login");
          }}
          className={primaryClass}
        >
          Giris Yap
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="grid gap-2">
        <Link href="/profil" onClick={onNavigate} className={linkClass}>
          Profilim
        </Link>
        {user.role === "ADMIN" ? (
          <Link href="/admin" onClick={onNavigate} className={linkClass}>
            Admin Panel
          </Link>
        ) : null}
        <ThemeToggle compact />
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className={`${primaryClass} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isSigningOut ? "Cikis..." : "Cikis Yap"}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsMenuOpen((value) => !value)}
        className={linkClass}
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        Profil
        <span
          aria-hidden="true"
          className={`ml-2 text-xs transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
        >
          v
        </span>
      </button>
      {isMenuOpen ? (
        <>
          <button
            type="button"
            aria-label="Profil menusunu kapat"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-3 grid min-w-56 gap-1 rounded-3xl border border-[#eee2d8] bg-white p-3 shadow-[0_20px_50px_rgba(17,24,39,0.16)]"
          >
            <Link
              href="/profil"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#1f2937] transition hover:bg-[#fff7ed] hover:text-[#c2410c]"
              role="menuitem"
            >
              Profilim
            </Link>
            {user.role === "ADMIN" ? (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#1f2937] transition hover:bg-[#fff7ed] hover:text-[#c2410c]"
                role="menuitem"
              >
                Admin Panel
              </Link>
            ) : null}
            <div className="my-1 border-t border-[#f1e6dd]" />
            <ThemeToggle compact />
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="mt-1 rounded-2xl bg-[#111827] px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
              role="menuitem"
            >
              {isSigningOut ? "Cikis..." : "Cikis Yap"}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
