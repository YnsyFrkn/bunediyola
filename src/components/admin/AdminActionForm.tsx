"use client";

import type { ReactNode } from "react";

type AdminActionFormProps = {
  action: () => void | Promise<void>;
  label: string;
  variant?: "danger" | "ghost" | "success";
  confirmMessage?: string;
  icon?: ReactNode;
};

export function AdminActionForm({
  action,
  label,
  variant = "ghost",
  confirmMessage,
  icon,
}: AdminActionFormProps) {
  const variants = {
    danger:
      "border border-[#fecaca] bg-[#fef2f2] text-[#b91c1c] hover:border-[#f87171] hover:bg-[#fee2e2]",
    ghost: "border border-[#e7e5e4] bg-white text-[#374151] hover:border-[#fdba74] hover:text-[#9a3412]",
    success:
      "border border-[#86efac] bg-[#f0fdf4] text-[#166534] hover:border-[#4ade80] hover:bg-[#dcfce7]",
  };

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${variants[variant]}`}
      >
        {icon}
        {label}
      </button>
    </form>
  );
}
