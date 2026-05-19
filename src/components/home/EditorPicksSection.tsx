import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/types/post";
import { formatDate } from "@/utils/formatDate";
import { formatReadingTime } from "@/utils/readingTime";

import { Badge } from "../ui/Badge";
import { SectionTitle } from "../ui/SectionTitle";

type EditorPicksSectionProps = {
  posts: Post[];
};

export function EditorPicksSection({ posts }: EditorPicksSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  const [leadPost, ...sidePosts] = posts;

  return (
    <section id="editorun-sectikleri" className="space-y-8">
      <SectionTitle
        eyebrow="Editörün Seçtikleri"
        title="Gözden kaçmaması gereken yazılar"
        description="Sadece okunma sayısına göre değil, editoryal değeri yüksek olduğu için öne alınan içerikler."
      />

      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <article className="group overflow-hidden rounded-[28px] border border-[#f1e6dd] bg-white shadow-[0_18px_40px_rgba(17,24,39,0.06)]">
          <Link href={`/yazi/${leadPost.slug}`} className="block">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#f9ede3]">
              <Image
                src={leadPost.image}
                alt={leadPost.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          </Link>

          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge href={`/kategori/${leadPost.categorySlug}`}>{leadPost.category}</Badge>
              <span className="text-sm text-[#6b7280]">{formatDate(leadPost.createdAt)}</span>
              {leadPost.readingTimeMinutes ? (
                <span className="text-sm text-[#6b7280]">
                  {formatReadingTime(leadPost.readingTimeMinutes)}
                </span>
              ) : null}
            </div>
            <Link href={`/yazi/${leadPost.slug}`} className="block">
              <h3 className="font-heading text-3xl leading-tight text-[#111827] transition group-hover:text-[#c2410c]">
                {leadPost.title}
              </h3>
            </Link>
            <p className="text-base leading-7 text-[#4b5563]">{leadPost.summary}</p>
          </div>
        </article>

        <div className="grid gap-3">
          {sidePosts.slice(0, 4).map((post) => (
            <Link
              key={post.id}
              href={`/yazi/${post.slug}`}
              className="grid grid-cols-[96px_1fr] gap-4 rounded-[24px] border border-[#f1e6dd] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[#fb923c]"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f9ede3]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="min-w-0 self-center">
                <p className="text-xs font-semibold text-[#c2410c]">{post.category}</p>
                <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-[#111827]">
                  {post.title}
                </h4>
                {post.readingTimeMinutes ? (
                  <p className="mt-1 text-xs font-semibold text-[#6b7280]">
                    {formatReadingTime(post.readingTimeMinutes)}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
