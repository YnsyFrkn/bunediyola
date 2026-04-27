import Link from "next/link";

import type { Post } from "@/types/post";

import { SectionTitle } from "../ui/SectionTitle";

type PopularPostsProps = {
  posts: Post[];
};

export function PopularPosts({ posts }: PopularPostsProps) {
  return (
    <section className="space-y-8">
      <SectionTitle
        eyebrow="Populer Icerikler"
        title="Okuyucularin donup tekrar baktigi yazilar"
        description="En cok goruntulenen icerikleri kart yerine daha hizli taranabilecek bir liste duzeniyle gosterdik."
      />

      <div className="grid gap-4">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/yazi/${post.slug}`}
            className="grid gap-4 rounded-[28px] border border-[#f1e6dd] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#fb923c] md:grid-cols-[80px_1fr_auto] md:items-center"
          >
            <div className="font-heading text-4xl text-[#c2410c]">0{index + 1}</div>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a3412]">
                {post.category}
              </p>
              <h3 className="text-xl font-semibold leading-8 text-[#111827]">{post.title}</h3>
              <p className="text-base leading-7 text-[#4b5563]">{post.summary}</p>
            </div>
            <div className="text-sm font-semibold text-[#6b7280]">{post.viewCount} goruntuleme</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
