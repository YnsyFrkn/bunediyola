type AdminStatCardProps = {
  label: string;
  value: string;
  note: string;
};

export function AdminStatCard({ label, value, note }: AdminStatCardProps) {
  return (
    <article className="rounded-[28px] border border-[#f1e6dd] bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c2410c]">{label}</p>
      <p className="mt-4 font-heading text-5xl text-[#111827]">{value}</p>
      <p className="mt-3 text-sm leading-7 text-[#6b7280]">{note}</p>
    </article>
  );
}
