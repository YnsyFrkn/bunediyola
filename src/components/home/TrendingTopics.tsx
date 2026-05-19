import Link from "next/link";

import type { TrendingTag } from "@/actions/tagActions";

type TrendingTopicsProps = {
  tags: TrendingTag[];
};

export function TrendingTopics({ tags }: TrendingTopicsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="trending-topics-title"
      className="rounded-[28px] border border-[#f1e6dd] bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="shrink-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
            Guncel Konular
          </p>
          <h2 id="trending-topics-title" className="mt-1 text-lg font-semibold text-[#111827]">
            Su an one cikanlar
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/arama?q=${encodeURIComponent(tag.name)}`}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-[#fed7aa] bg-[#fff7ed] px-4 py-2 text-sm font-semibold text-[#9a3412] transition hover:border-[#fb923c] hover:bg-[#ffedd5] hover:text-[#7c2d12]"
            >
              <span>#{tag.name}</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#6b7280]">
                {tag.postCount}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
