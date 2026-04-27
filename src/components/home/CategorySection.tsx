import Link from "next/link";

import type { Category } from "@/types/category";

import { SectionTitle } from "../ui/SectionTitle";

type CategorySectionProps = {
  categories: Category[];
};

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section id="kategoriler" className="space-y-8">
      <SectionTitle
        eyebrow="Kategoriler"
        title="Ilginizi ceken konuya tek tikla gecin"
        description="Kategoriler net isimlerle ve kisa aciklamalarla sunuldu. Boylece siteye ilk kez gelen biri bile rahatca yolunu bulabilir."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/kategori/${category.slug}`}
            className="rounded-[28px] border border-[#f1e6dd] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#fb923c] hover:shadow-[0_16px_35px_rgba(17,24,39,0.08)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
              Kategori
            </p>
            <h3 className="mt-4 font-heading text-3xl text-[#111827]">{category.name}</h3>
            <p className="mt-3 text-base leading-7 text-[#4b5563]">{category.description}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-[#c2410c]">
              Kategoriye Git
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
