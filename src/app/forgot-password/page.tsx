import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Sifremi Unuttum | bunediyola",
  description: "bunediyola hesabinin sifresini sifirla.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
            Hesap guvenligi
          </p>
          <div className="space-y-5">
            <h1 className="font-heading text-5xl leading-tight text-[#111827] sm:text-6xl">
              Sifreni sifirla
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#4b5563]">
              Email adresini yaz. Hesap kayitliyse sana tek kullanimlik sifre sifirlama linki
              gonderecegiz.
            </p>
          </div>
        </section>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}
