import Link from "next/link";

import type { ReportStatusFilter, ReportTypeFilter } from "@/actions/reportActions";

const statusFilters: Array<{ label: string; value: ReportStatusFilter; href: string }> = [
  { label: "Tumu", value: "all", href: "/admin/reports" },
  { label: "Beklemede", value: "pending", href: "/admin/reports?status=pending" },
  { label: "Incelendi", value: "reviewed", href: "/admin/reports?status=reviewed" },
  { label: "Reddedildi", value: "dismissed", href: "/admin/reports?status=dismissed" },
  { label: "Islem yapildi", value: "action_taken", href: "/admin/reports?status=action_taken" },
];

const typeFilters: Array<{ label: string; value: ReportTypeFilter; href: string }> = [
  { label: "Tum tipler", value: "all", href: "/admin/reports" },
  { label: "Yazilar", value: "post", href: "/admin/reports?type=post" },
  { label: "Yorumlar", value: "comment", href: "/admin/reports?type=comment" },
];

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
            href={filter.href}
            label={filter.label}
            isActive={activeType === "all" && activeStatus === filter.value}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-[#f3ebe3] pt-2">
        {typeFilters.map((filter) => (
          <FilterLink
            key={filter.value}
            href={filter.href}
            label={filter.label}
            isActive={activeStatus === "all" && activeType === filter.value}
          />
        ))}
      </div>
    </div>
  );
}
