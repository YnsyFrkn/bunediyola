import type { ReactNode } from "react";

import { NotificationBadge } from "@/components/admin/NotificationBadge";

type AdminHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[32px] border border-[#f1e6dd] bg-white p-6 shadow-[0_18px_50px_rgba(17,24,39,0.06)] sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c2410c]">Yonetim Paneli</p>
        <h1 className="font-heading text-4xl text-[#111827] sm:text-5xl">{title}</h1>
        <p className="text-lg leading-8 text-[#4b5563]">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <NotificationBadge />
        {actions}
      </div>
    </div>
  );
}
