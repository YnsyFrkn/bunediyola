"use client";

import { useState } from "react";

type MailHealthState = "idle" | "checking" | "connected" | "failed";

type MailFailureReason =
  | "not_configured"
  | "authentication_failed"
  | "sender_not_verified"
  | "api_failed"
  | "connection_failed"
  | "timeout"
  | "unknown";

const failureMessages: Record<MailFailureReason, string> = {
  not_configured: "Railway SMTP degiskenlerinden biri eksik.",
  authentication_failed:
    "Mail servisi API anahtarini veya SMTP bilgilerini kabul etmedi.",
  sender_not_verified:
    "Resend gonderici alan adini dogrulamadi. RESEND_FROM icin dogrulanmis bir domain kullan.",
  api_failed: "Resend API istegi basarisiz oldu. API anahtari, gonderici adresi ve Resend loglarini kontrol et.",
  connection_failed: "Railway Gmail sunucusuna baglanamadi. SMTP host ve port ayarlarini kontrol et.",
  timeout: "Gmail baglantisi zaman asimina ugradi. Biraz sonra yeniden dene.",
  unknown: "SMTP testi bilinmeyen bir hatayla tamamlanamadi. Railway loglarini kontrol et.",
};

export function MailHealthCheck() {
  const [state, setState] = useState<MailHealthState>("idle");
  const [failureReason, setFailureReason] = useState<MailFailureReason | null>(null);

  async function checkMail() {
    setState("checking");
    setFailureReason(null);

    try {
      const response = await fetch("/api/admin/mail-health", {
        method: "POST",
        cache: "no-store",
      });
      const result = (await response.json()) as {
        mail?: {
          connected?: boolean;
          reason?: MailFailureReason | null;
        };
        delivery?: {
          sent?: boolean;
          reason?: MailFailureReason | null;
        };
      };

      if (response.ok && result.mail?.connected && result.delivery?.sent) {
        setState("connected");
        return;
      }

      setFailureReason(result.delivery?.reason ?? result.mail?.reason ?? "unknown");
      setState("failed");
    } catch {
      setFailureReason("unknown");
      setState("failed");
    }
  }

  return (
    <article className="rounded-[28px] border border-[#f1e6dd] bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c2410c]">
        Email Servisi
      </p>
      <h2 className="mt-4 font-heading text-3xl text-[#111827]">
        {state === "connected"
          ? "SMTP baglantisi hazir"
          : state === "failed"
            ? "SMTP baglantisi basarisiz"
            : "SMTP baglantisini dogrula"}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#6b7280]">
        {state === "connected"
          ? "Test maili admin email adresine gonderildi. Hos geldin ve sifre sifirlama mailleri hazir."
          : state === "failed"
            ? failureMessages[failureReason ?? "unknown"]
            : "Mail servisini dogrular ve admin email adresine gercek bir test mesaji gonderir."}
      </p>
      <button
        type="button"
        onClick={checkMail}
        disabled={state === "checking"}
        className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "checking" ? "Kontrol ediliyor..." : "SMTP ve Test Mailini Kontrol Et"}
      </button>
    </article>
  );
}
