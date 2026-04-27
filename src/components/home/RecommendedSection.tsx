import Image from "next/image";
import Link from "next/link";

import type { PopularPostRecord } from "@/actions/popularActions";
import type { RecommendedPostRecord } from "@/actions/recommendationActions";

import { SectionTitle } from "../ui/SectionTitle";

type RecommendedSectionProps = {
  posts: RecommendedPostRecord[];
  fallbackPosts: PopularPostRecord[];
  isAuthenticated: boolean;
};

type RecommendedCard = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  category: string;
  score?: number;
};

function RecommendationCard({ post }: { post: RecommendedCard }) {
  return (
    <Link
      href={`/yazi/${post.slug}`}
      className="group overflow-hidden rounded-[28px] border border-[#f1e6dd] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#fb923c]"
    >
      <div className="relative aspect-[16/10] bg-[#f9ede3]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-semibold text-[#9a3412]">
            {post.category}
          </span>
          {post.score ? (
            <span className="text-xs font-semibold text-[#6b7280]">Uyum {post.score}</span>
          ) : null}
        </div>
        <h3 className="text-xl font-semibold leading-8 text-[#111827] transition group-hover:text-[#c2410c]">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-6 text-[#4b5563]">{post.summary}</p>
      </div>
    </Link>
  );
}

export function RecommendedSection({
  posts,
  fallbackPosts,
  isAuthenticated,
}: RecommendedSectionProps) {
  const visiblePosts: RecommendedCard[] =
    posts.length > 0
      ? posts
      : fallbackPosts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          image: post.image,
          category: post.category,
        }));

  return (
    <section className="space-y-8">
      <SectionTitle
        eyebrow="Senin Icin"
        title={isAuthenticated ? "Ilgi alanlarina yakin yazilar" : "Baslamak icin populer secimler"}
        description={
          isAuthenticated
            ? "Begendigin, yorum yaptigin ve kaydettigin iceriklerden yola cikarak hazirlanan oneriler."
            : "Giris yaptiginda begeni ve kayitlarina gore daha kisisel oneriler gorebilirsin."
        }
      />

      {visiblePosts.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-6 text-center">
          <h3 className="font-heading text-2xl text-[#111827]">Senin icin oneri yok</h3>
          <p className="mt-3 text-base leading-7 text-[#4b5563]">
            Icerikleri begenerek ve kaydederek onerileri gelistirebilirsin.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
          >
            Icerikleri Kesfet
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {visiblePosts.slice(0, 6).map((post) => (
            <RecommendationCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
