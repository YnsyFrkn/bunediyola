"use client";

import type { UserRole } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

import { useAuthModal } from "@/components/auth/AuthModalProvider";

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

  return (
    <div className={compact ? "grid gap-2" : "flex items-center gap-2"}>
      <Link href="/profil" onClick={onNavigate} className={linkClass}>
        Profilim
      </Link>
      <Link href="/profil/favorites" onClick={onNavigate} className={linkClass}>
        Kaydettiklerim
      </Link>
      {user.role === "ADMIN" ? (
        <Link href="/admin" onClick={onNavigate} className={linkClass}>
          Admin Panel
        </Link>
      ) : null}
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
