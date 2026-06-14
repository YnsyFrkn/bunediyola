import { getCommentsByPostId } from "@/actions/commentActions";
import { auth } from "@/lib/auth";

import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { LoginToComment } from "./LoginToComment";

type CommentSectionProps = {
  postId: string;
  postSlug: string;
};

export async function CommentSection({ postId, postSlug }: CommentSectionProps) {
  const [session, comments] = await Promise.all([auth(), getCommentsByPostId(postId)]);
  const commentCount = comments.reduce((total, comment) => total + 1 + comment.replies.length, 0);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c2410c]">
            Yorumlar
          </p>
          <h2 className="mt-2 font-heading text-3xl text-[#111827]">
            Okurlar ne dusunuyor?
          </h2>
        </div>
        <p className="rounded-full border border-[#f1e6dd] bg-white px-4 py-2 text-sm font-semibold text-[#4b5563]">
          {commentCount} yorum
        </p>
      </div>

      {session?.user ? (
        <CommentForm postId={postId} postSlug={postSlug} />
      ) : (
        <LoginToComment />
      )}

      <CommentList
        comments={comments}
        currentUserId={session?.user?.id ?? null}
        isAuthenticated={Boolean(session?.user)}
        postId={postId}
        postSlug={postSlug}
      />
    </section>
  );
}
