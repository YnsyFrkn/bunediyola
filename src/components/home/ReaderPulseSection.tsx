import Image from "next/image";
import Link from "next/link";

import type { EngagementPostRecord } from "@/actions/popularActions";

import { SectionTitle } from "../ui/SectionTitle";

type ReaderPulseSectionProps = {
  mostCommentedPosts: EngagementPostRecord[];
  mostLikedPosts: EngagementPostRecord[];
};

function PulseList({
  title,
  emptyTitle,
  posts,
  metric,
}: {
  title: string;
  emptyTitle: string;
  posts: EngagementPostRecord[];
  metric: "comment" | "like";
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-[#111827]">{title}</h3>
      {posts.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-5">
          <p className="font-semibold text-[#111827]">{emptyTitle}</p>
          <p className="mt-2 text-sm leading-6 text-[#4b5563]">
            Okuyucu hareketleri arttikca bu liste otomatik dolacak.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {posts.map((post, index) => {
            const metricValue = metric === "comment" ? post.commentCount : post.likeCount;
            const metricLabel = metric === "comment" ? "yorum" : "begeni";

            return (
              <Link
                key={post.id}
                href={`/yazi/${post.slug}`}
                className="grid grid-cols-[44px_72px_1fr] gap-3 rounded-[24px] border border-[#f1e6dd] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[#fb923c]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111827] font-heading text-lg text-white">
                  {index + 1}
                </div>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f9ede3]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#c2410c]">{post.category}</p>
                  <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-[#111827]">
                    {post.title}
                  </h4>
                  <p className="mt-1 text-xs font-semibold text-[#6b7280]">
                    {metricValue} {metricLabel}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function ReaderPulseSection({
  mostCommentedPosts,
  mostLikedPosts,
}: ReaderPulseSectionProps) {
  if (mostCommentedPosts.length === 0 && mostLikedPosts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      <SectionTitle
        eyebrow="Okuyucu Hareketleri"
        title="Yorumlanan ve begenilen yazilar"
        description="Okuyucularin en cok tepki verdigi icerikleri tek yerde takip et."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <PulseList
          title="En Cok Yorumlananlar"
          emptyTitle="Henuz yorumlanan yazi yok"
          posts={mostCommentedPosts}
          metric="comment"
        />
        <PulseList
          title="En Cok Begenilenler"
          emptyTitle="Henuz begenilen yazi yok"
          posts={mostLikedPosts}
          metric="like"
        />
      </div>
    </section>
  );
}
