import type { ReactNode } from "react";

type AdminNoticeProps = {
  title: string;
  description: string;
  tone?: "success" | "warning" | "error";
  action?: ReactNode;
};

export function AdminNotice({
  title,
  description,
  tone = "success",
  action,
}: AdminNoticeProps) {
  const tones = {
    success: "border-[#86efac] bg-[#f0fdf4] text-[#166534]",
    warning: "border-[#fdba74] bg-[#fff7ed] text-[#9a3412]",
    error: "border-[#fca5a5] bg-[#fef2f2] text-[#991b1b]",
  };

  return (
    <section className={`rounded-[28px] border p-5 shadow-sm ${tones[tone]}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">Islem Durumu</p>
          <h2 className="text-2xl font-semibold text-[#111827]">{title}</h2>
          <p className="max-w-3xl text-base leading-7 text-[#4b5563]">{description}</p>
        </div>
        {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
      </div>
    </section>
  );
}
