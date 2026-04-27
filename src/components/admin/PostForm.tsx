"use client";

import { useActionState } from "react";

import { initialFormState, type FormState } from "@/actions/formState";

import { FormStatusMessage } from "./FormStatusMessage";

type CategoryOption = {
  id: string;
  name: string;
};

type PostFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  categories: CategoryOption[];
  initialValues?: {
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    coverImage?: string | null;
    author?: string;
    categoryId?: string;
    status?: "DRAFT" | "PUBLISHED";
  };
  submitLabel: string;
  secondaryLabel?: string;
};

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="text-sm font-semibold text-[#b91c1c]">{error[0]}</p>;
}

export function PostForm({
  action,
  categories,
  initialValues,
  submitLabel,
  secondaryLabel,
}: PostFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="space-y-6 rounded-[32px] border border-[#f1e6dd] bg-white p-6 shadow-sm">
      <FormStatusMessage state={state} />

      <section className="rounded-[24px] border border-[#f3ebe3] bg-[#fffaf5] p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c2410c]">Form Rehberi</p>
        <p className="mt-2 text-sm leading-7 text-[#4b5563]">
          Baslik, slug, ozet, icerik, kategori ve yayin durumu alanlari bu formun ana
          bolumleridir. Slug kisa ve okunur olursa yazinin adresi de daha temiz gorunur.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-[#111827]">
            Baslik
          </label>
          <input
            id="title"
            name="title"
            defaultValue={state.values?.title ?? initialValues?.title ?? ""}
            placeholder="Ornek: Bugun Sosyal Medyada En Cok Konusulan 10 Sey"
            className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
          />
          <p className="text-sm leading-6 text-[#6b7280]">
            Okuyucu bu basligi ilk gordugunde yazinin ne anlattigini hemen anlamali.
          </p>
          <FieldError error={state.errors?.title} />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-semibold text-[#111827]">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={state.values?.slug ?? initialValues?.slug ?? ""}
            placeholder="Ornek: bugun-sosyal-medyada-en-cok-konusulan-10-sey"
            className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
          />
          <p className="text-sm leading-6 text-[#6b7280]">
            Yazi adresinde bu deger kullanilir. Kisa, temiz ve benzersiz olmasi iyi olur.
          </p>
          <FieldError error={state.errors?.slug} />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="summary" className="block text-sm font-semibold text-[#111827]">
          Ozet
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={4}
          defaultValue={state.values?.summary ?? initialValues?.summary ?? ""}
          placeholder="Yazinin kisa ozetini gir."
          className="w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 outline-none transition focus:border-[#fb923c]"
        />
        <p className="text-sm leading-6 text-[#6b7280]">
          Ana sayfa ve kart alanlarinda bu ozet gosterilir. Kisa ama bilgilendirici yaz.
        </p>
        <FieldError error={state.errors?.summary} />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-semibold text-[#111827]">
          Icerik
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          defaultValue={state.values?.content ?? initialValues?.content ?? ""}
          placeholder="Yazinin tum icerigini buraya yaz."
          className="w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 outline-none transition focus:border-[#fb923c]"
        />
        <p className="text-sm leading-6 text-[#6b7280]">
          Icerigi paragraflar halinde yazman, sonradan duzenlerken de okumayi kolaylastirir.
        </p>
        <FieldError error={state.errors?.content} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="coverImage" className="block text-sm font-semibold text-[#111827]">
            Kapak gorseli URL
          </label>
          <input
            id="coverImage"
            name="coverImage"
            defaultValue={state.values?.coverImage ?? initialValues?.coverImage ?? ""}
            placeholder="/images/posts/ornek.svg"
            className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
          />
          <p className="text-sm leading-6 text-[#6b7280]">
            Yerel gorsel icin `public/images/posts` altindaki yolu yaz. Ornek:
            `/images/posts/gundem-gunluk.svg`
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="author" className="block text-sm font-semibold text-[#111827]">
            Yazar
          </label>
          <input
            id="author"
            name="author"
            defaultValue={state.values?.author ?? initialValues?.author ?? "bunediyola ekibi"}
            placeholder="Ornek: bunediyola ekibi"
            className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
          />
          <p className="text-sm leading-6 text-[#6b7280]">
            Yazinin kim tarafindan hazirlandigini burada gosterebilirsin.
          </p>
          <FieldError error={state.errors?.author} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="categoryId" className="block text-sm font-semibold text-[#111827]">
            Kategori
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={state.values?.categoryId ?? initialValues?.categoryId ?? ""}
            className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
          >
            <option value="">Kategori sec</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <p className="text-sm leading-6 text-[#6b7280]">
            Yazi hangi kategori altinda listelenecekse onu sec.
          </p>
          <FieldError error={state.errors?.categoryId} />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-semibold text-[#111827]">
            Yayin durumu
          </label>
          <select
            id="status"
            name="status"
            defaultValue={state.values?.status ?? initialValues?.status ?? "DRAFT"}
            className="h-12 w-full rounded-2xl border border-[#e7e5e4] px-4 outline-none transition focus:border-[#fb923c]"
          >
            <option value="DRAFT">Taslak</option>
            <option value="PUBLISHED">Yayinda</option>
          </select>
          <p className="text-sm leading-6 text-[#6b7280]">
            Taslak secersen yazi sadece panelde kalir. Yayinda secersen site tarafinda da gorunur.
          </p>
          <FieldError error={state.errors?.status} />
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Kaydediliyor..." : submitLabel}
        </button>
        {secondaryLabel ? (
          <div className="rounded-[20px] border border-[#f3ebe3] bg-[#fffaf5] px-4 py-3 text-sm leading-7 text-[#4b5563]">
            <span className="font-semibold text-[#111827]">Ipuclari:</span> {secondaryLabel}
          </div>
        ) : null}
      </div>
    </form>
  );
}
