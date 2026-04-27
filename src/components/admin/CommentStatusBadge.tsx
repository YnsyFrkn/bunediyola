import type { CommentStatus } from "@prisma/client";

type CommentStatusBadgeProps = {
  status: CommentStatus;
  deletedAt?: Date | null;
};

export function CommentStatusBadge({ status, deletedAt }: CommentStatusBadgeProps) {
  const isHidden = status === "HIDDEN" || Boolean(deletedAt);

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
        isHidden
          ? "bg-[#fef2f2] text-[#b91c1c]"
          : "bg-[#f0fdf4] text-[#166534]"
      }`}
    >
      {isHidden ? "Gizli" : "Gorunur"}
    </span>
  );
}
