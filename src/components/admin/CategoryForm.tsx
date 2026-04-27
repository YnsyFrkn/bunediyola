"use client";

import { useActionState } from "react";

import { initialFormState, type FormState } from "@/actions/formState";

import { FormStatusMessage } from "./FormStatusMessage";

type CategoryFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues?: {
    name?: string;
    slug?: string;
    description?: string | null;
  };
  submitLabel: string;
};

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="text-sm font-semibold text-[#b91c1c]">{error[0]}</p>;
}

export function CategoryForm({ action, initialValues, submitLabel }: CategoryFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="space-y-6 rounded-[32px] border border-[#f1e6dd] bg-white p-6 shadow-sm">
      <FormStatusMessage state={state} />

      <section className="rounded-[24px] border border-[#f3ebe3] bg-[#fffaf5] p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c2410c]">Form Rehberi</p>
        <p className="mt-2 text-sm leading-7 text-[#4b5563]">
          Kategori adi ve slug alani zorunludur. Slug, kategori adresinde kullanildigi icin
          kisa ve anlasilir yazilmasi iyi olur.
        </p>
      </section>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-[#111827]">
          Kategori adi
        </label>
        <input
          id="name"
          name="name"
          defaultValue={state.values?.name ?? initialValues?.name ?? ""}
          placeholder="Ornek: Teknoloji"
          className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
        />
        <p className="text-sm leading-6 text-[#6b7280]">
          Kategori adini okuyucu site uzerinde de gorecek. Acik ve tanidik bir isim sec.
        </p>
        <FieldError error={state.errors?.name} />
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="block text-sm font-semibold text-[#111827]">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={state.values?.slug ?? initialValues?.slug ?? ""}
          placeholder="Ornek: teknoloji"
          className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
        />
        <p className="text-sm leading-6 text-[#6b7280]">
          Bu alan kategori adresini belirler. Ornek adres: `/kategori/teknoloji`
        </p>
        <FieldError error={state.errors?.slug} />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-semibold text-[#111827]">
          Aciklama
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={state.values?.description ?? initialValues?.description ?? ""}
          placeholder="Bu kategoride yer alacak icerikleri kisaca anlat."
          className="w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 outline-none transition focus:border-[#fb923c]"
        />
        <p className="text-sm leading-6 text-[#6b7280]">
          Bu aciklama kategori sayfasinin ust kisiminda gorunur. Kisa ve bilgilendirici yaz.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Kaydediliyor..." : submitLabel}
      </button>
    </form>
  );
}
