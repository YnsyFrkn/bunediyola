import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Yeni Sifre Belirle | bunediyola",
  description: "bunediyola hesabin icin yeni sifre belirle.",
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
            Hesap guvenligi
          </p>
          <div className="space-y-5">
            <h1 className="font-heading text-5xl leading-tight text-[#111827] sm:text-6xl">
              Yeni sifre belirle
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#4b5563]">
              Link gecerliyse yeni sifreni belirleyebilir ve hesabina yeniden giris yapabilirsin.
            </p>
          </div>
        </section>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="rounded-[32px] border border-[#fecaca] bg-[#fef2f2] p-6 text-[#991b1b] shadow-sm sm:p-8">
            <h2 className="font-heading text-3xl text-[#111827]">Link gecersiz</h2>
            <p className="mt-3 text-base leading-7">
              Sifre sifirlama linki eksik veya gecersiz. Lutfen yeniden sifirlama linki iste.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
