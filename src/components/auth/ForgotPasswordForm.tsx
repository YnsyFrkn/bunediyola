"use client";

import Link from "next/link";
import { useActionState } from "react";

import { initialFormState } from "@/actions/formState";
import { requestPasswordReset } from "@/actions/passwordResetActions";

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="text-sm font-semibold text-[#b91c1c]">{error[0]}</p>;
}

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialFormState);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-[32px] border border-[#f1e6dd] bg-white p-6 shadow-[0_18px_50px_rgba(17,24,39,0.08)] sm:p-8"
    >
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

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Gonderiliyor..." : "Sifirlama Linki Gonder"}
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
