"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { initialFormState, type FormState } from "@/actions/formState";
import { registerSchema } from "@/validations/registerSchema";
import { userLoginSchema } from "@/validations/userLoginSchema";

type AuthMode = "login" | "register";
export type PendingAuthAction =
  | {
      type: "report";
      targetType: "post" | "comment";
      targetId: string;
    }
  | null;

type AuthModalContextValue = {
  openAuthModal: (mode?: AuthMode, pendingAction?: PendingAuthAction) => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="text-sm font-semibold text-[#b91c1c]">{error[0]}</p>;
}

function getSafeRedirectTo(pathname: string, search = "") {
  const target = `${pathname}${search}`;

  if (!target || target.startsWith("/admin")) {
    return "/";
  }

  return target;
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }

  return context;
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginState, setLoginState] = useState<FormState>(initialFormState);
  const [registerState, setRegisterState] = useState<FormState>(initialFormState);
  const [pendingAction, setPendingAction] = useState<PendingAuthAction>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setLoginState(initialFormState);
    setRegisterState(initialFormState);
    setPendingAction(null);
    setIsPasswordVisible(false);
  }, []);

  const openAuthModal = useCallback((nextMode: AuthMode = "login", nextPendingAction: PendingAuthAction = null) => {
    setMode(nextMode);
    setPendingAction(nextPendingAction);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    function handleOpenAuthModal(event: Event) {
      const customEvent = event as CustomEvent<{ mode?: AuthMode }>;

      openAuthModal(customEvent.detail?.mode ?? "login");
    }

    window.addEventListener("open-auth-modal", handleOpenAuthModal);

    return () => window.removeEventListener("open-auth-modal", handleOpenAuthModal);
  }, [openAuthModal]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  async function finishAuth() {
    const actionToContinue = pendingAction;

    window.dispatchEvent(new Event("auth-changed"));
    closeModal();
    router.refresh();

    if (actionToContinue) {
      window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("auth-action-ready", {
            detail: actionToContinue,
          }),
        );
      }, 80);
    }
  }

  function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const redirectTo = getSafeRedirectTo(pathname, window.location.search);
    const rawValues = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    const parsed = userLoginSchema.safeParse({
      email: rawValues.email.toLowerCase(),
      password: rawValues.password,
      redirectTo,
    });

    if (!parsed.success) {
      setLoginState({
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
        redirectTo,
      });

      if (result?.error) {
        setLoginState({
          success: false,
          message:
            result.code === "login_rate_limited"
              ? "Cok fazla hatali giris denemesi yapildi. Lutfen 15 dakika sonra tekrar dene."
              : "Email veya sifre hatali.",
          values: {
            email: parsed.data.email,
          },
        });
        return;
      }

      await finishAuth();
    });
  }

  function submitRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const redirectTo = getSafeRedirectTo(pathname, window.location.search);
    const rawValues = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      passwordConfirm: String(formData.get("passwordConfirm") ?? ""),
    };
    const parsed = registerSchema.safeParse(rawValues);

    if (!parsed.success) {
      setRegisterState({
        success: false,
        message: "Formu kontrol edip tekrar dene.",
        errors: parsed.error.flatten().fieldErrors,
        values: {
          name: rawValues.name,
          email: rawValues.email,
        },
      });
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as FormState;

      if (!response.ok || !result.success) {
        setRegisterState(result);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: parsed.data.email.toLowerCase(),
        password: parsed.data.password,
        loginType: "user",
        redirect: false,
        redirectTo,
      });

      if (signInResult?.error) {
        setMode("login");
        setLoginState({
          success: true,
          message: "Hesabin olusturuldu. Simdi giris yapabilirsin.",
          values: {
            email: parsed.data.email,
          },
        });
        return;
      }

      await finishAuth();
    });
  }

  return (
    <AuthModalContext.Provider value={{ openAuthModal }}>
      {children}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111827]/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-[32px] bg-white p-6 shadow-[0_30px_90px_rgba(17,24,39,0.28)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
                  bunediyola
                </p>
                <h2 id="auth-modal-title" className="mt-2 font-heading text-4xl text-[#111827]">
                  {mode === "login" ? "Giris Yap" : "Kayit Ol"}
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e5e4] text-xl leading-none text-[#4b5563] transition hover:border-[#fb923c] hover:text-[#9a3412]"
                aria-label="Pencereyi kapat"
              >
                x
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 rounded-full border border-[#f1e6dd] bg-[#fffaf5] p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`min-h-10 rounded-full text-sm font-semibold transition ${
                  mode === "login" ? "bg-[#111827] text-white" : "text-[#4b5563]"
                }`}
              >
                Giris
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`min-h-10 rounded-full text-sm font-semibold transition ${
                  mode === "register" ? "bg-[#111827] text-white" : "text-[#4b5563]"
                }`}
              >
                Kayit
              </button>
            </div>

            {mode === "login" ? (
              <form onSubmit={submitLogin} className="mt-6 space-y-5">
                {loginState.message ? (
                  <div
                    className={`rounded-[20px] border px-4 py-3 text-sm leading-7 ${
                      loginState.success
                        ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                        : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
                    }`}
                  >
                    {loginState.message}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label htmlFor="modal-email" className="block text-sm font-semibold text-[#111827]">
                    Email
                  </label>
                  <input
                    id="modal-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={loginState.values?.email ?? ""}
                    className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
                  />
                  <FieldError error={loginState.errors?.email} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="modal-password" className="block text-sm font-semibold text-[#111827]">
                    Sifre
                  </label>
                  <div className="relative">
                    <input
                      id="modal-password"
                      name="password"
                      type={isPasswordVisible ? "text" : "password"}
                      autoComplete="current-password"
                      className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 pr-24 outline-none transition focus:border-[#fb923c]"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((value) => !value)}
                      className="absolute right-2 top-1/2 inline-flex h-9 -translate-y-1/2 items-center rounded-full px-3 text-xs font-semibold text-[#c2410c] transition hover:bg-[#fff7ed] hover:text-[#9a3412]"
                    >
                      {isPasswordVisible ? "Gizle" : "Goster"}
                    </button>
                  </div>
                  <FieldError error={loginState.errors?.password} />
                  <Link
                    href="/forgot-password"
                    onClick={closeModal}
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
              </form>
            ) : (
              <form onSubmit={submitRegister} className="mt-6 space-y-5">
                {registerState.message ? (
                  <div className="rounded-[20px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm leading-7 text-[#991b1b]">
                    {registerState.message}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label htmlFor="modal-name" className="block text-sm font-semibold text-[#111827]">
                    Ad Soyad
                  </label>
                  <input
                    id="modal-name"
                    name="name"
                    defaultValue={registerState.values?.name ?? ""}
                    className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
                  />
                  <FieldError error={registerState.errors?.name} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="modal-register-email" className="block text-sm font-semibold text-[#111827]">
                    Email
                  </label>
                  <input
                    id="modal-register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={registerState.values?.email ?? ""}
                    className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
                  />
                  <FieldError error={registerState.errors?.email} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="modal-register-password" className="block text-sm font-semibold text-[#111827]">
                      Sifre
                    </label>
                    <input
                      id="modal-register-password"
                      name="password"
                      type={isPasswordVisible ? "text" : "password"}
                      autoComplete="new-password"
                      className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
                    />
                    <FieldError error={registerState.errors?.password} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-register-password-confirm" className="block text-sm font-semibold text-[#111827]">
                      Tekrar
                    </label>
                    <input
                      id="modal-register-password-confirm"
                      name="passwordConfirm"
                      type={isPasswordVisible ? "text" : "password"}
                      autoComplete="new-password"
                      className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
                    />
                    <FieldError error={registerState.errors?.passwordConfirm} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((value) => !value)}
                  className="text-sm font-semibold text-[#c2410c] transition hover:text-[#9a3412]"
                >
                  {isPasswordVisible ? "Sifreyi gizle" : "Sifreyi goster"}
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Kayit olusturuluyor..." : "Kayit Ol"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </AuthModalContext.Provider>
  );
}
