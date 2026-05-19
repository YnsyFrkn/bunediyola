"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type AdminActionFormProps = {
  action: () => void | Promise<void>;
  label: string;
  variant?: "danger" | "ghost" | "success";
  confirmMessage?: string;
  icon?: ReactNode;
};

function AdminActionButton({
  label,
  variant,
  icon,
}: {
  label: string;
  variant: "danger" | "ghost" | "success";
  icon?: ReactNode;
}) {
  const { pending } = useFormStatus();
  const variants = {
    danger:
      "border border-[#fecaca] bg-[#fef2f2] text-[#b91c1c] hover:border-[#f87171] hover:bg-[#fee2e2]",
    ghost: "border border-[#e7e5e4] bg-white text-[#374151] hover:border-[#fdba74] hover:text-[#9a3412]",
    success:
      "border border-[#86efac] bg-[#f0fdf4] text-[#166534] hover:border-[#4ade80] hover:bg-[#dcfce7]",
  };

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]}`}
    >
      {icon}
      {pending ? "Isleniyor..." : label}
    </button>
  );
}

export function AdminActionForm({
  action,
  label,
  variant = "ghost",
  confirmMessage,
  icon,
}: AdminActionFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <AdminActionButton label={label} variant={variant} icon={icon} />
    </form>
  );
}
