"use client";

import { useState } from "react";

type MailHealthState = "idle" | "checking" | "connected" | "failed";

export function MailHealthCheck() {
  const [state, setState] = useState<MailHealthState>("idle");

  async function checkMail() {
    setState("checking");

    try {
      const response = await fetch("/api/admin/mail-health", {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        mail?: {
          connected?: boolean;
        };
      };

      setState(response.ok && result.mail?.connected ? "connected" : "failed");
    } catch {
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
          ? "Hos geldin ve sifre sifirlama mailleri gonderilebilir."
          : state === "failed"
            ? "Railway SMTP ayarlarini ve Gmail App Password degerini kontrol et."
            : "Gmail kullanici adi ve App Password bilgilerinin kabul edildigini test eder."}
      </p>
      <button
        type="button"
        onClick={checkMail}
        disabled={state === "checking"}
        className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "checking" ? "Kontrol ediliyor..." : "SMTP Baglantisini Test Et"}
      </button>
    </article>
  );
}
