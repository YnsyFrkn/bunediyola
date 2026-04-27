"use client";

import { useActionState } from "react";

import { toggleFavorite, type FavoriteState } from "@/actions/favoriteActions";
import { AuthRequiredButton } from "@/components/auth/AuthRequiredButton";

type FavoriteButtonProps = {
  postId: string;
  postSlug: string;
  initialFavorited: boolean;
  isAuthenticated: boolean;
  compact?: boolean;
};

export function FavoriteButton({
  postId,
  initialFavorited,
  isAuthenticated,
  compact = false,
}: FavoriteButtonProps) {
  const initialState: FavoriteState = {
    favorited: initialFavorited,
  };
  const [state, formAction, isPending] = useActionState(
    toggleFavorite.bind(null, postId),
    initialState,
  );

  if (!isAuthenticated) {
    return (
      <AuthRequiredButton
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#bfdbfe] bg-white px-5 py-3 text-sm font-semibold text-[#1d4ed8] transition hover:border-[#60a5fa] hover:bg-[#eff6ff]"
      >
        Kaydetmek icin giris yap
      </AuthRequiredButton>
    );
  }

  return (
    <form
      action={formAction}
      className={compact ? "inline-flex flex-col items-start gap-2" : "inline-flex items-center gap-3"}
    >
      <button
        type="submit"
        disabled={isPending}
        aria-pressed={state.favorited}
        aria-label={state.favorited ? "Yaziyi kaydedilenlerden cikar" : "Yaziyi kaydet"}
        className={`inline-flex min-h-12 items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          state.favorited
            ? "border-[#2563eb] bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
            : "border-[#bfdbfe] bg-white text-[#1d4ed8] hover:border-[#60a5fa] hover:bg-[#eff6ff]"
        }`}
      >
        {isPending ? "Kaydediliyor..." : state.favorited ? "Kaydedildi" : "Kaydet"}
      </button>
      {state.message ? (
        <p className={compact ? "max-w-40 text-xs font-medium text-[#6b7280]" : "text-sm font-medium text-[#6b7280]"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
