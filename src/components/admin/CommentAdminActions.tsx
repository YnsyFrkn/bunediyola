import Link from "next/link";

import { hideComment, restoreComment, type AdminCommentRecord } from "@/actions/commentActions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";

type CommentAdminActionsProps = {
  comment: AdminCommentRecord;
};

export function CommentAdminActions({ comment }: CommentAdminActionsProps) {
  const isHidden = comment.status === "HIDDEN" || Boolean(comment.deletedAt);

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={`/yazi/${comment.post.slug}`}
        className="inline-flex min-h-10 items-center font-semibold text-[#c2410c]"
      >
        Detaya git
      </Link>
      {isHidden ? (
        <AdminActionForm action={restoreComment.bind(null, comment.id)} label="Geri Al" variant="success" />
      ) : (
        <AdminActionForm
          action={hideComment.bind(null, comment.id)}
          label="Gizle"
          variant="danger"
          confirmMessage="Bu yorumu public alandan gizlemek istedigine emin misin?"
        />
      )}
    </div>
  );
}
