"use client";

import type { FormState } from "@/actions/formState";

type FormStatusMessageProps = {
  state: FormState;
};

export function FormStatusMessage({ state }: FormStatusMessageProps) {
  if (!state.message) {
    return null;
  }

  const title = state.success ? "Kayit Basarili" : "Kontrol Gerekli";
  const description = state.success
    ? "Degisiklikler kaydedildi. Istersen formu duzenlemeye devam edebilirsin."
    : "Formdaki alanlari kontrol edip tekrar deneyebilirsin.";

  return (
    <div
      className={`rounded-[24px] border px-4 py-4 ${
        state.success
          ? "border-[#86efac] bg-[#f0fdf4] text-[#166534]"
          : "border-[#fdba74] bg-[#fff7ed] text-[#9a3412]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-lg">{state.success ? "OK" : "!"}</div>
        <div className="space-y-1">
          <p className="text-sm font-bold uppercase tracking-[0.14em]">{title}</p>
          <p className="text-base font-semibold">{state.message}</p>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      </div>
    </div>
  );
}
