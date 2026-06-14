"use client";

import type { PostReactionType } from "@prisma/client";
import { useActionState } from "react";

import { setPostReaction } from "@/actions/postReactionActions";
import { AuthRequiredButton } from "@/components/auth/AuthRequiredButton";
import {
  reactionTypes,
  type PostReactionState,
  type ReactionCounts,
} from "@/lib/postReactions";

const reactionLabels: Record<PostReactionType, string> = {
  BUNE_YA: "Bune Ya",
  HARBI_MI: "Harbi mi?",
  YOK_ARTIK: "Yok Artik",
  IYIYMIS: "Iyiymis",
  BOS_YAPMIS: "Bos Yapmis",
  KATILIYORUM: "Katiliyorum",
};

type PostReactionPanelProps = {
  postId: string;
  initialCounts: ReactionCounts;
  initialSelectedType: PostReactionType | null;
  isAuthenticated: boolean;
};

export function PostReactionPanel({
  postId,
  initialCounts,
  initialSelectedType,
  isAuthenticated,
}: PostReactionPanelProps) {
  const initialState: PostReactionState = {
    selectedType: initialSelectedType,
    counts: initialCounts,
  };
  const [state, formAction, isPending] = useActionState(
    setPostReaction.bind(null, postId),
    initialState,
  );

  return (
    <section className="rounded-[28px] border border-[#f1e6dd] bg-[#fffaf5] p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
          Bunediyola Tepkileri
        </p>
        <h2 className="font-heading text-3xl text-[#111827]">Sen ne diyorsun?</h2>
        <p className="text-sm leading-7 text-[#6b7280]">
          Bir tepki sec. Tepkini degistirebilir, ayni secenege tekrar basarak geri alabilirsin.
        </p>
      </div>

      {isAuthenticated ? (
        <form action={formAction} className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
          {reactionTypes.map((type) => {
            const isSelected = state.selectedType === type;

            return (
              <button
                key={type}
                type="submit"
                name="type"
                value={type}
                disabled={isPending}
                aria-pressed={isSelected}
                className={`flex min-h-16 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isSelected
                    ? "border-[#ea580c] bg-[#ea580c] text-white shadow-[0_12px_24px_rgba(234,88,12,0.2)]"
                    : "border-[#fed7aa] bg-white text-[#374151] hover:border-[#ea580c] hover:bg-[#fff7ed] hover:text-[#9a3412]"
                }`}
              >
                <span>{reactionLabels[type]}</span>
                <span
                  className={`inline-flex min-w-7 justify-center rounded-full px-2 py-1 text-xs ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#fff7ed] text-[#9a3412]"
                  }`}
                >
                  {state.counts[type]}
                </span>
              </button>
            );
          })}
        </form>
      ) : (
        <div className="mt-5">
          <AuthRequiredButton className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c]">
            Tepki vermek icin giris yap
          </AuthRequiredButton>
        </div>
      )}

      {state.message ? (
        <p className="mt-4 text-sm font-semibold text-[#6b7280]" aria-live="polite">
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
