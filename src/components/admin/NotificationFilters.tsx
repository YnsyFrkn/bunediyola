import Link from "next/link";

import type { NotificationFilter } from "@/actions/notificationActions";

const filters: Array<{ href: string; label: string; value: NotificationFilter }> = [
  { href: "/admin/notifications", label: "Tumu", value: "all" },
  { href: "/admin/notifications?filter=unread", label: "Okunmamis", value: "unread" },
  { href: "/admin/notifications?filter=read", label: "Okunmus", value: "read" },
];

type NotificationFiltersProps = {
  activeFilter: NotificationFilter;
};

export function NotificationFilters({ activeFilter }: NotificationFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[28px] border border-[#f1e6dd] bg-white p-2 shadow-sm">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <Link
            key={filter.value}
            href={filter.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-[#111827] text-white"
                : "text-[#4b5563] hover:bg-[#fff7ed] hover:text-[#9a3412]"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
