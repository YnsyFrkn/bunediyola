"use client";

import { useActionState } from "react";

import { toggleLike, type LikeState } from "@/actions/likeActions";
import { AuthRequiredButton } from "@/components/auth/AuthRequiredButton";

type LikeButtonProps = {
  postId: string;
  postSlug: string;
  initialCount: number;
  initialLiked: boolean;
  isAuthenticated: boolean;
};

export function LikeButton({
  postId,
  initialCount,
  initialLiked,
  isAuthenticated,
}: LikeButtonProps) {
  const initialState: LikeState = {
    liked: initialLiked,
    count: initialCount,
  };
  const [state, formAction, isPending] = useActionState(toggleLike.bind(null, postId), initialState);

  if (!isAuthenticated) {
    return (
      <AuthRequiredButton
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#fecaca] bg-white px-5 py-3 text-sm font-semibold text-[#991b1b] transition hover:border-[#f87171] hover:bg-[#fef2f2]"
      >
        Begenmek icin giris yap
      </AuthRequiredButton>
    );
  }

  return (
    <form action={formAction} className="inline-flex items-center gap-3">
      <button
        type="submit"
        disabled={isPending}
        aria-pressed={state.liked}
        className={`inline-flex min-h-12 items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          state.liked
            ? "border-[#dc2626] bg-[#dc2626] text-white hover:bg-[#b91c1c]"
            : "border-[#fecaca] bg-white text-[#991b1b] hover:border-[#f87171] hover:bg-[#fef2f2]"
        }`}
      >
        {isPending ? "Kaydediliyor..." : state.liked ? `Begenildi ${state.count}` : `Begen ${state.count}`}
      </button>
      {state.message ? <p className="text-sm font-medium text-[#6b7280]">{state.message}</p> : null}
    </form>
  );
}
