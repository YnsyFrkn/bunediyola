"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { userLoginSchema } from "@/validations/userLoginSchema";

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="text-sm font-semibold text-[#b91c1c]">{error[0]}</p>;
}

type UserLoginFormProps = {
  registered?: boolean;
  reset?: boolean;
  redirectTo?: string;
};

type UserLoginFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};

const initialState: UserLoginFormState = {
  success: false,
  message: "",
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

export function UserLoginForm({ registered, reset, redirectTo = "/" }: UserLoginFormProps) {
  const [state, setState] = useState<UserLoginFormState>(
    registered
      ? {
          success: true,
          message: "Hesabin olusturuldu. Simdi giris yapabilirsin.",
        }
      : reset
        ? {
            success: true,
            message: "Sifren guncellendi. Yeni sifrenle giris yapabilirsin.",
          }
      : initialState,
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawValues = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const parsed = userLoginSchema.safeParse({
      email: rawValues.email.toLowerCase(),
      password: rawValues.password,
      redirectTo: getSafeRedirectTo(redirectTo),
    });

    if (!parsed.success) {
      setState({
        success: false,
        message: "Formu kontrol edip tekrar dene.",
        errors: parsed.error.flatten().fieldErrors,
        values: {
          email: rawValues.email,
        },
      });
      return;
    }

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        loginType: "user",
        redirect: false,
        redirectTo: getSafeRedirectTo(parsed.data.redirectTo),
      });

      if (result?.error) {
        const message =
          result.code === "login_rate_limited"
            ? "Cok fazla hatali giris denemesi yapildi. Lutfen 15 dakika sonra tekrar dene."
            : "Email veya sifre hatali.";

        setState({
          success: false,
          message,
          values: {
            email: parsed.data.email,
          },
        });
        return;
      }

      setState(initialState);
      window.location.assign(getSafeRedirectTo(parsed.data.redirectTo));
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[32px] border border-[#f1e6dd] bg-white p-6 shadow-[0_18px_50px_rgba(17,24,39,0.08)] sm:p-8"
    >
      <section className="rounded-[24px] border border-[#f3ebe3] bg-[#fffaf5] p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c2410c]">
          Kullanici Girisi
        </p>
        <p className="mt-2 text-sm leading-7 text-[#4b5563]">
          Profiline, yorumlarina ve yakinda eklenecek favorilerine erismek icin hesabina giris
          yap.
        </p>
      </section>

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

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-[#111827]">
          Sifre
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Sifreni gir"
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
        <Link
          href="/forgot-password"
          className="inline-flex text-sm font-semibold text-[#c2410c] transition hover:text-[#9a3412]"
        >
          Sifremi unuttum
        </Link>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Giris yapiliyor..." : "Giris Yap"}
      </button>

      <div className="flex flex-wrap justify-between gap-3 text-sm font-semibold">
        <Link href="/kayit" className="text-[#c2410c] transition hover:text-[#9a3412]">
          Hesabin yok mu? Kayit ol
        </Link>
        <Link href="/" className="text-[#4b5563] transition hover:text-[#111827]">
          Ana sayfaya don
        </Link>
      </div>
    </form>
  );
}
