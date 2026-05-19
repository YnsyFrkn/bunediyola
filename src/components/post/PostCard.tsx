import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/types/post";
import { formatDate } from "@/utils/formatDate";
import { formatReadingTime } from "@/utils/readingTime";

import { Badge } from "../ui/Badge";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const readingTime = post.readingTimeMinutes;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#f1e6dd] bg-white shadow-[0_18px_40px_rgba(17,24,39,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,24,39,0.10)]">
      <Link href={`/yazi/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f9ede3]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge href={`/kategori/${post.categorySlug}`}>{post.category}</Badge>
          <span className="text-sm text-[#6b7280]">{formatDate(post.createdAt)}</span>
          {readingTime ? (
            <span className="text-sm text-[#6b7280]">
              {formatReadingTime(readingTime)}
            </span>
          ) : null}
        </div>

        <div className="space-y-3">
          <Link href={`/yazi/${post.slug}`} className="block">
            <h3 className="text-xl font-semibold leading-8 text-[#111827] transition group-hover:text-[#c2410c]">
              {post.title}
            </h3>
          </Link>
          <p className="text-base leading-7 text-[#4b5563]">{post.summary}</p>
        </div>

        {post.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.slug}
                href={`/arama?q=${encodeURIComponent(tag.name)}`}
                className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-semibold text-[#4b5563] transition hover:bg-[#fff7ed] hover:text-[#9a3412]"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        ) : null}

        <Link
          href={`/yazi/${post.slug}`}
          className="inline-flex items-center text-sm font-semibold text-[#c2410c] transition hover:text-[#9a3412]"
        >
          Yaziyi Oku
        </Link>
      </div>
    </article>
  );
}
