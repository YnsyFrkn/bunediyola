import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Kayit Ol | bunediyola",
  description: "bunediyola hesabini olustur.",
};

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/profil");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
            bunediyola
          </p>
          <div className="space-y-5">
            <h1 className="font-heading text-5xl leading-tight text-[#111827] sm:text-6xl">
              Hesabini olustur
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#4b5563]">
              V3 ile yorum, begeni ve favori gibi kisisel alanlarin temeli burada basliyor.
              Hesabin olustugunda public site deneyimin girisli hale gelir.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/giris" className="text-[#c2410c] transition hover:text-[#9a3412]">
              Zaten hesabin var mi?
            </Link>
            <Link href="/" className="text-[#4b5563] transition hover:text-[#111827]">
              Iceriklere goz at
            </Link>
          </div>
        </section>

        <RegisterForm />
      </div>
    </main>
  );
}
