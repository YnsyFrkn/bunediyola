import type { PublicCommentRecord } from "@/actions/commentActions";

import { CommentItem } from "./CommentItem";

type CommentListProps = {
  comments: PublicCommentRecord[];
  isAuthenticated: boolean;
  currentUserId: string | null;
  postId: string;
  postSlug: string;
};

export function CommentList({
  comments,
  isAuthenticated,
  currentUserId,
  postId,
  postSlug,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-6 text-center">
        <h3 className="font-heading text-2xl text-[#111827]">Henuz yorum yapilmamis</h3>
        <p className="mt-3 text-base leading-7 text-[#4b5563]">
          Ilk yorumu sen yazabilir, bu yazinin altinda sohbeti baslatabilirsin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          isAuthenticated={isAuthenticated}
          postId={postId}
          postSlug={postSlug}
        />
      ))}
    </div>
  );
}
