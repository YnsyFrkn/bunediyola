"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { initialFormState } from "@/actions/formState";
import { registerUser } from "@/actions/userAuthActions";

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="text-sm font-semibold text-[#b91c1c]">{error[0]}</p>;
}

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, initialFormState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-[32px] border border-[#f1e6dd] bg-white p-6 shadow-[0_18px_50px_rgba(17,24,39,0.08)] sm:p-8"
    >
      <section className="rounded-[24px] border border-[#f3ebe3] bg-[#fffaf5] p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c2410c]">
          Hesap Olustur
        </p>
        <p className="mt-2 text-sm leading-7 text-[#4b5563]">
          Yorumlar, begeniler ve favoriler icin kullanacagin bunediyola hesabini burada
          olusturabilirsin.
        </p>
      </section>

      {state.message ? (
        <div className="rounded-[24px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm leading-7 text-[#991b1b]">
          {state.message}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-[#111827]">
          Ad Soyad
        </label>
        <input
          id="name"
          name="name"
          defaultValue={state.values?.name ?? ""}
          placeholder="Adini ve soyadini yaz"
          className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
        />
        <FieldError error={state.errors?.name} />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#111827]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email ?? ""}
          placeholder="ornek: merhaba@bunediyola.com"
          className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
        />
        <FieldError error={state.errors?.email} />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-[#111827]">
          Sifre
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="En az 8 karakter"
            className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 pr-24 outline-none transition focus:border-[#fb923c]"
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((current) => !current)}
            className="absolute right-2 top-1/2 inline-flex h-9 -translate-y-1/2 items-center rounded-full px-3 text-xs font-semibold text-[#c2410c] transition hover:bg-[#fff7ed] hover:text-[#9a3412]"
            aria-label={isPasswordVisible ? "Sifreyi gizle" : "Sifreyi goster"}
          >
            {isPasswordVisible ? "Gizle" : "Goster"}
          </button>
        </div>
        <FieldError error={state.errors?.password} />
      </div>

      <div className="space-y-2">
        <label htmlFor="passwordConfirm" className="block text-sm font-semibold text-[#111827]">
          Sifre Tekrari
        </label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type={isPasswordVisible ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Sifreni tekrar yaz"
          className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
        />
        <FieldError error={state.errors?.passwordConfirm} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Kayit olusturuluyor..." : "Kayit Ol"}
      </button>

      <div className="flex flex-wrap justify-between gap-3 text-sm font-semibold">
        <Link href="/giris" className="text-[#c2410c] transition hover:text-[#9a3412]">
          Hesabin var mi? Giris yap
        </Link>
        <Link href="/" className="text-[#4b5563] transition hover:text-[#111827]">
          Ana sayfaya don
        </Link>
      </div>
    </form>
  );
}
