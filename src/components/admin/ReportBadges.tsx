import type { ReportReason, ReportStatus, ReportType } from "@prisma/client";

import {
  reportReasonLabels,
  reportStatusLabels,
  reportTypeLabels,
} from "@/validations/reportSchema";

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const variants: Record<ReportStatus, string> = {
    PENDING: "border-[#fed7aa] bg-[#fff7ed] text-[#9a3412]",
    REVIEWED: "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]",
    DISMISSED: "border-[#e5e7eb] bg-[#f9fafb] text-[#4b5563]",
    ACTION_TAKEN: "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${variants[status]}`}>
      {reportStatusLabels[status]}
    </span>
  );
}

export function ReportReasonBadge({ reason }: { reason: ReportReason }) {
  return (
    <span className="rounded-full border border-[#f1e6dd] bg-white px-3 py-1 text-xs font-semibold text-[#4b5563]">
      {reportReasonLabels[reason]}
    </span>
  );
}

export function ReportTypeBadge({ type }: { type: ReportType }) {
  return (
    <span className="rounded-full bg-[#111827] px-3 py-1 text-xs font-semibold text-white">
      {reportTypeLabels[type]}
    </span>
  );
}
