"use client";

import { useActionState, useState } from "react";

import { votePoll } from "@/actions/pollActions";
import { AuthRequiredButton } from "@/components/auth/AuthRequiredButton";
import type { PollVoteState } from "@/lib/polls";

type PollCardProps = {
  pollId: string;
  question: string;
  initialState: PollVoteState;
  isAuthenticated: boolean;
};

export function PollCard({
  pollId,
  question,
  initialState,
  isAuthenticated,
}: PollCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState(initialState.selectedOptionId ?? "");
  const [state, formAction, isPending] = useActionState(
    votePoll.bind(null, pollId),
    initialState,
  );
  const hasVoted = Boolean(state.selectedOptionId);

  return (
    <section className="rounded-[28px] border border-[#fed7aa] bg-[#fff7ed] p-5 sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c2410c]">Anket</p>
      <h2 className="mt-3 font-heading text-3xl leading-tight text-[#111827]">{question}</h2>

      {hasVoted ? (
        <div className="mt-5 space-y-3">
          {state.options.map((option) => (
            <div key={option.id} className="rounded-2xl border border-[#f3d3bb] bg-white p-4">
              <div className="flex items-center justify-between gap-4 text-sm font-semibold">
                <span className={state.selectedOptionId === option.id ? "text-[#c2410c]" : "text-[#374151]"}>
                  {option.text}
                  {state.selectedOptionId === option.id ? " - Senin oyun" : ""}
                </span>
                <span className="text-[#6b7280]">%{option.percentage}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ffedd5]">
                <div
                  className="h-full rounded-full bg-[#ea580c] transition-all"
                  style={{ width: `${option.percentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-semibold text-[#6b7280]">{option.voteCount} oy</p>
            </div>
          ))}
          <p className="text-sm font-semibold text-[#6b7280]">Toplam {state.totalVotes} oy</p>
        </div>
      ) : isAuthenticated ? (
        <form action={formAction} className="mt-5 space-y-3">
          {state.options.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 text-sm font-semibold transition ${
                selectedOptionId === option.id
                  ? "border-[#ea580c] text-[#9a3412]"
                  : "border-[#f3d3bb] text-[#374151] hover:border-[#fb923c]"
              }`}
            >
              <input
                type="radio"
                name="optionId"
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => setSelectedOptionId(option.id)}
                className="h-4 w-4 accent-[#ea580c]"
              />
              {option.text}
            </label>
          ))}
          <button
            type="submit"
            disabled={isPending || !selectedOptionId}
            className="inline-flex min-h-12 items-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Oy kaydediliyor..." : "Oy Ver"}
          </button>
        </form>
      ) : (
        <div className="mt-5">
          <AuthRequiredButton className="inline-flex min-h-12 items-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c]">
            Oy vermek icin giris yap
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
