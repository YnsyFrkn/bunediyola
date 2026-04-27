"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { PopularPostRecord } from "@/actions/popularActions";

import { SectionTitle } from "../ui/SectionTitle";

type PopularSectionProps = {
  dailyPosts: PopularPostRecord[];
  weeklyPosts: PopularPostRecord[];
};

type PopularMode = "daily" | "weekly";

function PopularList({ posts }: { posts: PopularPostRecord[] }) {
  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-6">
          <h4 className="font-heading text-2xl text-[#111827]">Henuz populer icerik yok</h4>
          <p className="mt-3 text-base leading-7 text-[#4b5563]">
            Begeni, yorum ve kaydetme hareketleri arttikca trend yazilar burada gorunecek.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
          >
            Icerikleri Kesfet
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/yazi/${post.slug}`}
              className="grid gap-4 rounded-[28px] border border-[#f1e6dd] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#fb923c] md:grid-cols-[72px_140px_1fr_auto] md:items-center"
            >
              <div className="font-heading text-4xl text-[#c2410c]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#f9ede3]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-semibold text-[#9a3412]">
                    {post.category}
                  </span>
                  <span className="text-xs font-semibold text-[#6b7280]">Skor {post.score}</span>
                </div>
                <div>
                  <h4 className="line-clamp-2 text-xl font-semibold leading-8 text-[#111827]">
                    {post.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#4b5563]">
                    {post.summary}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#6b7280]">
                  <span>{post.likeCount} begeni</span>
                  <span>{post.commentCount} yorum</span>
                  <span>{post.favoriteCount} kayit</span>
                </div>
              </div>
              <div className="hidden min-w-20 text-right md:block">
                <span className="rounded-full bg-[#111827] px-3 py-2 text-xs font-semibold text-white">
                  Skor {post.score}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function PopularSection({ dailyPosts, weeklyPosts }: PopularSectionProps) {
  const [activeMode, setActiveMode] = useState<PopularMode>("daily");
  const activePosts = useMemo(
    () => (activeMode === "daily" ? dailyPosts : weeklyPosts),
    [activeMode, dailyPosts, weeklyPosts],
  );

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          eyebrow="Populer Icerikler"
          title="Okuyucularin en cok hareketlendirdigi yazilar"
          description="Begeni, yorum ve kaydetme hareketlerine gore guncellenen trend icerikler."
        />
        <div className="inline-flex w-full rounded-full border border-[#f1e6dd] bg-white p-1 shadow-sm sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveMode("daily")}
            className={`min-h-11 flex-1 rounded-full px-5 py-2 text-sm font-semibold transition sm:flex-none ${
              activeMode === "daily"
                ? "bg-[#111827] text-white"
                : "text-[#4b5563] hover:bg-[#fff7ed] hover:text-[#9a3412]"
            }`}
          >
            Bugun
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("weekly")}
            className={`min-h-11 flex-1 rounded-full px-5 py-2 text-sm font-semibold transition sm:flex-none ${
              activeMode === "weekly"
                ? "bg-[#111827] text-white"
                : "text-[#4b5563] hover:bg-[#fff7ed] hover:text-[#9a3412]"
            }`}
          >
            Bu Hafta
          </button>
        </div>
      </div>

      <PopularList posts={activePosts} />
    </section>
  );
}
