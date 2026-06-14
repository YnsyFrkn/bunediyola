"use client";

import { useActionState } from "react";

import { initialFormState, type FormState } from "@/actions/formState";

import { FormStatusMessage } from "./FormStatusMessage";

type PollFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  posts: Array<{
    id: string;
    title: string;
  }>;
};

function FieldError({ error }: { error?: string[] }) {
  return error?.length ? <p className="text-sm font-semibold text-[#b91c1c]">{error[0]}</p> : null;
}

export function PollForm({ action, posts }: PollFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="space-y-6 rounded-[32px] border border-[#f1e6dd] bg-white p-6 shadow-sm">
      <FormStatusMessage state={state} />

      <div className="space-y-2">
        <label htmlFor="question" className="block text-sm font-semibold text-[#111827]">
          Anket sorusu
        </label>
        <input
          id="question"
          name="question"
          defaultValue={state.values?.question ?? ""}
          placeholder="Ornek: Bu konuda sen ne dusunuyorsun?"
          className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
        />
        <FieldError error={state.errors?.question} />
      </div>

      <div className="space-y-2">
        <label htmlFor="postId" className="block text-sm font-semibold text-[#111827]">
          Baglanacak yazi
        </label>
        <select
          id="postId"
          name="postId"
          defaultValue={state.values?.postId ?? ""}
          className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
        >
          <option value="">Yazi sec</option>
          {posts.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>
        <FieldError error={state.errors?.postId} />
      </div>

      <div className="space-y-2">
        <label htmlFor="options" className="block text-sm font-semibold text-[#111827]">
          Secenekler
        </label>
        <textarea
          id="options"
          name="options"
          rows={7}
          defaultValue={state.values?.options ?? ""}
          placeholder={"Her satira bir secenek yaz.\nEvet\nHayir\nKararsizim"}
          className="w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 outline-none transition focus:border-[#fb923c]"
        />
        <p className="text-sm leading-6 text-[#6b7280]">En az 2, en fazla 6 secenek ekleyebilirsin.</p>
        <FieldError error={state.errors?.options} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 items-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Anket olusturuluyor..." : "Anket Olustur"}
      </button>
    </form>
  );
}
