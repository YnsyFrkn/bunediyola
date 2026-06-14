"use client";

import { useActionState, useEffect, useRef } from "react";

import { createComment } from "@/actions/commentActions";
import { initialFormState } from "@/actions/formState";

type CommentFormProps = {
  postId: string;
  postSlug: string;
  parentId?: string | null;
  compact?: boolean;
  onSuccess?: () => void;
};

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="text-sm font-semibold text-[#b91c1c]">{error[0]}</p>;
}

export function CommentForm({
  postId,
  postSlug,
  parentId = null,
  compact = false,
  onSuccess,
}: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = createComment.bind(null, postId, postSlug, parentId);
  const [state, formAction, isPending] = useActionState(action, initialFormState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [onSuccess, state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-[28px] border border-[#f1e6dd] bg-white p-5 shadow-sm">
      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-[#111827]">
          {parentId ? "Cevabin" : "Yorumun"}
        </label>
        <textarea
          id="content"
          name="content"
          rows={compact ? 3 : 5}
          defaultValue={state.success ? "" : state.values?.content ?? ""}
          placeholder={parentId ? "Bu yoruma cevabini yaz." : "Bu yazi hakkinda ne dusunuyorsun?"}
          className="mt-2 w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 text-base leading-7 outline-none transition focus:border-[#fb923c]"
        />
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Yorumun 3 ile 1000 karakter arasinda olmali.
        </p>
        <FieldError error={state.errors?.content} />
      </div>

      {state.message ? (
        <div
          className={`rounded-[20px] border px-4 py-3 text-sm leading-7 ${
            state.success
              ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
              : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Gonderiliyor..." : parentId ? "Cevabi Gonder" : "Yorumu Gonder"}
      </button>
    </form>
  );
}
