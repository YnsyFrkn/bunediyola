import type { PublicCommentRecord } from "@/actions/commentActions";
import { ReportButton } from "@/components/reports/ReportButton";
import { formatDate } from "@/utils/formatDate";

type CommentItemProps = {
  comment: PublicCommentRecord;
  isAuthenticated: boolean;
};

export function CommentItem({ comment, isAuthenticated }: CommentItemProps) {
  return (
    <article className="rounded-[24px] border border-[#f1e6dd] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-[#111827]">{comment.user.name ?? "bunediyola kullanicisi"}</p>
          <p className="text-sm text-[#6b7280]">{formatDate(comment.createdAt.toISOString())}</p>
        </div>
        <ReportButton
          targetType="comment"
          targetId={comment.id}
          isAuthenticated={isAuthenticated}
          label="Bildir"
        />
      </div>
      <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-[#374151]">{comment.content}</p>
    </article>
  );
}
