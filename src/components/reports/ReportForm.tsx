"use client";

import { useActionState } from "react";

import { createCommentReport, createPostReport } from "@/actions/reportActions";
import { initialFormState } from "@/actions/formState";
import { reportReasonLabels } from "@/validations/reportSchema";

type ReportFormProps = {
  targetType: "post" | "comment";
  targetId: string;
};

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="mt-2 text-sm font-semibold text-[#b91c1c]">{error[0]}</p>;
}

export function ReportForm({ targetType, targetId }: ReportFormProps) {
  const action =
    targetType === "post"
      ? createPostReport.bind(null, targetId)
      : createCommentReport.bind(null, targetId);
  const [state, formAction, isPending] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div
          className={`rounded-[20px] border px-4 py-3 text-sm leading-7 ${
            state.success
              ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
              : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div>
        <label htmlFor={`report-reason-${targetId}`} className="block text-sm font-semibold text-[#111827]">
          Sebep
        </label>
        <select
          id={`report-reason-${targetId}`}
          name="reason"
          defaultValue={state.values?.reason ?? ""}
          required
          className="mt-2 w-full rounded-2xl border border-[#e7e5e4] bg-white px-4 py-3 text-base outline-none transition focus:border-[#fb923c]"
        >
          <option value="">Sebep sec</option>
          {Object.entries(reportReasonLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <FieldError error={state.errors?.reason} />
      </div>

      <div>
        <label htmlFor={`report-detail-${targetId}`} className="block text-sm font-semibold text-[#111827]">
          Ek aciklama
        </label>
        <textarea
          id={`report-detail-${targetId}`}
          name="detail"
          rows={4}
          maxLength={500}
          defaultValue={state.values?.detail ?? ""}
          placeholder="Istersen sikayetinle ilgili kisa bir aciklama yazabilirsin."
          className="mt-2 w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 text-base leading-7 outline-none transition focus:border-[#fb923c]"
        />
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">En fazla 500 karakter.</p>
        <FieldError error={state.errors?.detail} />
      </div>

      <button
        type="submit"
        disabled={isPending || state.success}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Gonderiliyor..." : state.success ? "Gonderildi" : "Bildirimi Gonder"}
      </button>
    </form>
  );
}
