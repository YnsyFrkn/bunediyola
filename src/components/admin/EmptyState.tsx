import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-8 text-center">
      <h2 className="font-heading text-3xl text-[#111827]">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-[#4b5563]">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
