type AdminStatusBadgeProps = {
  status: "DRAFT" | "PUBLISHED";
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const isPublished = status === "PUBLISHED";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        isPublished
          ? "border-[#86efac] bg-[#f0fdf4] text-[#166534]"
          : "border-[#fdba74] bg-[#fff7ed] text-[#9a3412]"
      }`}
    >
      {isPublished ? "Yayinda" : "Taslak"}
    </span>
  );
}
