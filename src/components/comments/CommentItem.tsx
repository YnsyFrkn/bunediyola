"use client";

import { useActionState, useEffect, useState, useTransition } from "react";

import {
  deleteOwnComment,
  type PublicCommentRecord,
  updateOwnComment,
} from "@/actions/commentActions";
import { initialFormState } from "@/actions/formState";
import { AuthRequiredButton } from "@/components/auth/AuthRequiredButton";
import { ReportButton } from "@/components/reports/ReportButton";
import { formatDate } from "@/utils/formatDate";

import { CommentForm } from "./CommentForm";

type ReplyRecord = PublicCommentRecord["replies"][number];

type CommentItemProps = {
  comment: PublicCommentRecord | ReplyRecord;
  currentUserId: string | null;
  isAuthenticated: boolean;
  postId: string;
  postSlug: string;
  isReply?: boolean;
};

function EditCommentForm({
  commentId,
  content,
  postSlug,
  onCancel,
}: {
  commentId: string;
  content: string;
  postSlug: string;
  onCancel: () => void;
}) {
  const action = updateOwnComment.bind(null, commentId, postSlug);
  const [state, formAction, isPending] = useActionState(action, initialFormState);

  useEffect(() => {
    if (state.success) {
      onCancel();
    }
  }, [onCancel, state.success]);

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <textarea
        name="content"
        rows={4}
        defaultValue={state.values?.content ?? content}
        className="w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 text-base leading-7 outline-none transition focus:border-[#fb923c]"
      />
      {state.errors?.content?.[0] ? (
        <p className="text-sm font-semibold text-[#b91c1c]">{state.errors.content[0]}</p>
      ) : null}
      {state.message && !state.success ? (
        <p className="text-sm font-semibold text-[#b91c1c]">{state.message}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-10 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:opacity-60"
        >
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-10 items-center rounded-full border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-[#374151]"
        >
          Vazgec
        </button>
      </div>
    </form>
  );
}

export function CommentItem({
  comment,
  currentUserId,
  isAuthenticated,
  postId,
  postSlug,
  isReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, startDeleteTransition] = useTransition();
  const isOwner = currentUserId === comment.userId;
  const isDeleted = Boolean(comment.deletedAt);
  const replies = "replies" in comment ? comment.replies : [];

  function handleDelete() {
    if (!window.confirm("Bu yorumu silmek istedigine emin misin?")) {
      return;
    }

    setDeleteError("");
    startDeleteTransition(async () => {
      const result = await deleteOwnComment(comment.id, postSlug);

      if (!result.success) {
        setDeleteError(result.message ?? "Yorum silinemedi.");
      }
    });
  }

  return (
    <div className={isReply ? "ml-5 border-l-2 border-[#fed7aa] pl-4 sm:ml-10" : ""}>
      <article className="rounded-[24px] border border-[#f1e6dd] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-[#111827]">
              {isDeleted ? "Silinmis yorum" : comment.user.name ?? "bunediyola kullanicisi"}
            </p>
            <p className="text-sm text-[#6b7280]">{formatDate(comment.createdAt.toISOString())}</p>
          </div>
          {!isDeleted ? (
            <div className="flex flex-wrap items-center gap-2">
              {isOwner ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing((value) => !value);
                      setIsReplying(false);
                    }}
                    className="text-sm font-semibold text-[#4b5563] transition hover:text-[#c2410c]"
                  >
                    Duzenle
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-sm font-semibold text-[#b91c1c] disabled:opacity-60"
                  >
                    {isDeleting ? "Siliniyor..." : "Sil"}
                  </button>
                </>
              ) : null}
              <ReportButton
                targetType="comment"
                targetId={comment.id}
                isAuthenticated={isAuthenticated}
                label="Bildir"
              />
            </div>
          ) : null}
        </div>

        {isDeleted ? (
          <p className="mt-4 italic text-[#6b7280]">Bu yorum kullanici tarafindan silindi.</p>
        ) : isEditing ? (
          <EditCommentForm
            commentId={comment.id}
            content={comment.content}
            postSlug={postSlug}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-[#374151]">
            {comment.content}
          </p>
        )}

        {deleteError ? <p className="mt-3 text-sm font-semibold text-[#b91c1c]">{deleteError}</p> : null}

        {!isReply && !isDeleted ? (
          <div className="mt-4">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setIsReplying((value) => !value);
                  setIsEditing(false);
                }}
                className="text-sm font-semibold text-[#c2410c] transition hover:text-[#9a3412]"
              >
                {isReplying ? "Cevabi kapat" : "Cevapla"}
              </button>
            ) : (
              <AuthRequiredButton
                className="text-sm font-semibold text-[#c2410c] transition hover:text-[#9a3412]"
              >
                Cevapla
              </AuthRequiredButton>
            )}
          </div>
        ) : null}

        {isReplying ? (
          <div className="mt-4">
            <CommentForm
              postId={postId}
              postSlug={postSlug}
              parentId={comment.id}
              compact
              onSuccess={() => setIsReplying(false)}
            />
          </div>
        ) : null}
      </article>

      {replies.length > 0 ? (
        <div className="mt-3 space-y-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              isAuthenticated={isAuthenticated}
              postId={postId}
              postSlug={postSlug}
              isReply
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
