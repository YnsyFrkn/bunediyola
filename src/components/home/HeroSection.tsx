import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/types/post";
import { formatDate } from "@/utils/formatDate";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

type HeroSectionProps = {
  featuredPost: Post;
  sidePosts: Post[];
};

export function HeroSection({ featuredPost, sidePosts }: HeroSectionProps) {
  return (
    <section className="pt-8 sm:pt-10">
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="overflow-hidden rounded-[36px] bg-[#111827] text-white shadow-[0_30px_80px_rgba(17,24,39,0.24)]">
          <div className="grid h-full gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#fdba74]">
                Bugun ne konusuluyor?
              </p>
              <div className="space-y-4">
                <h1 className="font-heading text-4xl leading-tight sm:text-5xl">
                  Gundemden mizaha, teknolojiden yasama kadar ilgini cekecek icerikler.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[#d1d5db]">
                  Her sey sade, okunakli ve rahat gezilecek sekilde hazirlandi. One
                  cikan yazilarla basla, sonra ilgini ceken kategoriye gec.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href={`/yazi/${featuredPost.slug}`}>One Cikan Yaziyi Oku</Button>
                <Button href="/#kategoriler" variant="secondary">
                  Kategorilere Git
                </Button>
              </div>
            </div>

            <Link
              href={`/yazi/${featuredPost.slug}`}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
            >
              <div className="relative aspect-[16/11] overflow-hidden rounded-[22px]">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{featuredPost.category}</Badge>
                  <span className="text-sm text-[#d1d5db]">{formatDate(featuredPost.createdAt)}</span>
                </div>
                <h2 className="text-2xl font-semibold leading-9">{featuredPost.title}</h2>
                <p className="text-base leading-7 text-[#e5e7eb]">{featuredPost.summary}</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {sidePosts.map((post) => (
            <Link
              key={post.id}
              href={`/yazi/${post.slug}`}
              className="rounded-[28px] border border-[#f1e6dd] bg-white p-5 shadow-[0_16px_40px_rgba(17,24,39,0.06)] transition hover:-translate-y-1 hover:border-[#fdba74]"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{post.category}</Badge>
                <span className="text-sm text-[#6b7280]">{formatDate(post.createdAt)}</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold leading-9 text-[#111827]">{post.title}</h3>
              <p className="mt-3 text-base leading-7 text-[#4b5563]">{post.summary}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-[#c2410c]">
                Yaziyi Oku
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
