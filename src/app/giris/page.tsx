import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { UserLoginForm } from "@/components/auth/UserLoginForm";
import { auth } from "@/lib/auth";

type UserLoginPageProps = {
  searchParams: Promise<{
    registered?: string;
    reset?: string;
    callbackUrl?: string;
  }>;
};

function getSafeRedirectTo(value?: string) {
  if (!value) {
    return "/";
  }

  try {
    const url = new URL(value, "http://localhost:3000");
    const relativeUrl = `${url.pathname}${url.search}${url.hash}`;

    if (!relativeUrl.startsWith("/") || relativeUrl.startsWith("/admin")) {
      return "/";
    }

    return relativeUrl || "/";
  } catch {
    return "/";
  }
}

export const metadata: Metadata = {
  title: "Giris Yap | bunediyola",
  description: "bunediyola kullanici hesabina giris yap.",
};

export default async function UserLoginPage({ searchParams }: UserLoginPageProps) {
  const session = await auth();
  const { registered, reset, callbackUrl } = await searchParams;
  const redirectTo = getSafeRedirectTo(callbackUrl);

  if (session?.user) {
    redirect(redirectTo);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
            bunediyola
          </p>
          <div className="space-y-5">
            <h1 className="font-heading text-5xl leading-tight text-[#111827] sm:text-6xl">
              Hesabina giris yap
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#4b5563]">
              Profiline ulasmak ve yakinda eklenecek yorum, begeni, favori ozelliklerini
              kullanmak icin giris yap.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/kayit" className="text-[#c2410c] transition hover:text-[#9a3412]">
              Hesap olustur
            </Link>
            <Link href="/" className="text-[#4b5563] transition hover:text-[#111827]">
              Ana sayfaya don
            </Link>
          </div>
        </section>

        <UserLoginForm registered={registered === "1"} reset={reset === "1"} redirectTo={redirectTo} />
      </div>
    </main>
  );
}
