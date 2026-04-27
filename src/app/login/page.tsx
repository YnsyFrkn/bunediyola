import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/LoginForm";
import { auth } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

function getSafeRedirectTo(value?: string) {
  if (!value) {
    return "/admin";
  }

  try {
    const url = new URL(value, "http://localhost:3000");
    const relativeUrl = `${url.pathname}${url.search}${url.hash}`;

    if (relativeUrl.startsWith("/admin")) {
      return relativeUrl;
    }
  } catch {
    return "/admin";
  }

  return "/admin";
}

export const metadata: Metadata = {
  title: "Admin Giris | bunediyola",
  description: "bunediyola admin paneline guvenli giris yap.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  const { callbackUrl } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="rounded-[36px] border border-[#f1e6dd] bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.2),_transparent_34%),linear-gradient(180deg,_#fff7ed_0%,_#fffbf7_100%)] p-8 shadow-[0_24px_70px_rgba(17,24,39,0.08)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
            bunediyola
          </p>
          <h1 className="mt-5 font-heading text-5xl text-[#111827] sm:text-6xl">
            Admin Paneline Giris
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4b5563]">
            Icerikleri yonetmek, yazilari guncellemek ve kategori akisina devam etmek icin admin
            hesabinla giris yap.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/70 bg-white/80 p-5">
              <p className="text-sm font-semibold text-[#111827]">Korumali Alan</p>
              <p className="mt-2 text-sm leading-7 text-[#4b5563]">
                Admin sayfalari artik oturum ve rol kontroluyle korunuyor.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/80 p-5">
              <p className="text-sm font-semibold text-[#111827]">Guvenli Oturum</p>
              <p className="mt-2 text-sm leading-7 text-[#4b5563]">
                Sifreler hashli tutulur, giris sonrasi sadece admin yetkisiyle devam edilir.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/" className="text-[#c2410c] transition hover:text-[#9a3412]">
              Ana Sayfaya Don
            </Link>
            <Link href="/arama" className="text-[#4b5563] transition hover:text-[#111827]">
              Iceriklere Goz At
            </Link>
          </div>
        </section>

        <LoginForm redirectTo={getSafeRedirectTo(callbackUrl)} />
      </div>
    </main>
  );
}
