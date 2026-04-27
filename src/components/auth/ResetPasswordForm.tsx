"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { initialFormState } from "@/actions/formState";
import { resetPassword } from "@/actions/passwordResetActions";

type ResetPasswordFormProps = {
  token: string;
};

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="text-sm font-semibold text-[#b91c1c]">{error[0]}</p>;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(resetPassword, initialFormState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-[32px] border border-[#f1e6dd] bg-white p-6 shadow-[0_18px_50px_rgba(17,24,39,0.08)] sm:p-8"
    >
      <input type="hidden" name="token" value={token} />

      {state.message ? (
        <div
          className={`rounded-[24px] border px-4 py-3 text-sm leading-7 ${
            state.success
              ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
              : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-[#111827]">
          Yeni Sifre
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Yeni sifreni gir"
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
        <p className="text-sm leading-6 text-[#6b7280]">Sifre en az 8 karakter olmali.</p>
        <FieldError error={state.errors?.password} />
      </div>

      <div className="space-y-2">
        <label htmlFor="passwordConfirm" className="block text-sm font-semibold text-[#111827]">
          Yeni Sifre Tekrari
        </label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type={isPasswordVisible ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Yeni sifreni tekrar gir"
          className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
        />
        <FieldError error={state.errors?.passwordConfirm} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Guncelleniyor..." : "Sifremi Guncelle"}
      </button>

      <Link
        href="/giris"
        className="inline-flex text-sm font-semibold text-[#c2410c] transition hover:text-[#9a3412]"
      >
        Giris sayfasina don
      </Link>
    </form>
  );
}
