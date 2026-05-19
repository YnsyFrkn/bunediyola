import Link from "next/link";

import type { ReportStatusFilter, ReportTypeFilter } from "@/actions/reportActions";

const statusFilters: Array<{ label: string; value: ReportStatusFilter }> = [
  { label: "Tumu", value: "all" },
  { label: "Beklemede", value: "pending" },
  { label: "Incelendi", value: "reviewed" },
  { label: "Reddedildi", value: "dismissed" },
  { label: "Islem yapildi", value: "action_taken" },
];

const typeFilters: Array<{ label: string; value: ReportTypeFilter }> = [
  { label: "Tum tipler", value: "all" },
  { label: "Yazilar", value: "post" },
  { label: "Yorumlar", value: "comment" },
];

function getReportsHref(status: ReportStatusFilter, type: ReportTypeFilter) {
  const params = new URLSearchParams();

  if (status !== "all") {
    params.set("status", status);
  }

  if (type !== "all") {
    params.set("type", type);
  }

  const query = params.toString();

  return query ? `/admin/reports?${query}` : "/admin/reports";
}

function FilterLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
        isActive
          ? "bg-[#111827] text-white"
          : "text-[#4b5563] hover:bg-[#fff7ed] hover:text-[#9a3412]"
      }`}
    >
      {label}
    </Link>
  );
}

export function ReportFilters({
  activeStatus,
  activeType,
}: {
  activeStatus: ReportStatusFilter;
  activeType: ReportTypeFilter;
}) {
  return (
    <div className="grid gap-3 rounded-[28px] border border-[#f1e6dd] bg-white p-2 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <FilterLink
            key={filter.value}
            href={getReportsHref(filter.value, activeType)}
            label={filter.label}
            isActive={activeStatus === filter.value}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-[#f3ebe3] pt-2">
        {typeFilters.map((filter) => (
          <FilterLink
            key={filter.value}
            href={getReportsHref(activeStatus, filter.value)}
            label={filter.label}
            isActive={activeType === filter.value}
          />
        ))}
      </div>
    </div>
  );
}
