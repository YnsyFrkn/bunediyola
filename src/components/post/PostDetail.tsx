import Image from "next/image";
import Link from "next/link";

import { isPostFavoritedByUser } from "@/actions/favoriteActions";
import { getLikeCount, isPostLikedByUser } from "@/actions/likeActions";
import {
  getPostReactionCounts,
  getUserPostReaction,
} from "@/actions/postReactionActions";
import { CommentSection } from "@/components/comments/CommentSection";
import { FavoriteButton } from "@/components/favorite/FavoriteButton";
import { LikeButton } from "@/components/like/LikeButton";
import { ShareButtons } from "@/components/post/ShareButtons";
import { ReportButton } from "@/components/reports/ReportButton";
import { PostReactionPanel } from "@/components/reaction/PostReactionPanel";
import { auth } from "@/lib/auth";
import { getAbsoluteUrl } from "@/lib/site";
import type { Post } from "@/types/post";
import { formatDate } from "@/utils/formatDate";
import { formatReadingTime } from "@/utils/readingTime";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { PostViewCount } from "./PostViewCount";

type PostDetailProps = {
  post: Post;
  relatedPosts: Post[];
};

export async function PostDetail({ post, relatedPosts }: PostDetailProps) {
  const session = await auth();
  const readingTime = post.readingTimeMinutes;
  const [likeCount, initialLiked, initialFavorited, reactionCounts, selectedReaction] =
    await Promise.all([
    getLikeCount(post.id),
    session?.user ? isPostLikedByUser(post.id, session.user.id) : Promise.resolve(false),
    session?.user ? isPostFavoritedByUser(post.id, session.user.id) : Promise.resolve(false),
    getPostReactionCounts(post.id),
    session?.user ? getUserPostReaction(post.id, session.user.id) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-12">
      <article className="overflow-hidden rounded-[36px] border border-[#f1e6dd] bg-white shadow-[0_22px_70px_rgba(17,24,39,0.07)]">
        <div className="relative aspect-[16/9] bg-[#f9ede3]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        <div className="space-y-8 p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge href={`/kategori/${post.categorySlug}`}>{post.category}</Badge>
            <span className="text-sm text-[#6b7280]">{formatDate(post.createdAt)}</span>
            {readingTime ? (
              <span className="text-sm text-[#6b7280]">
                {formatReadingTime(readingTime)}
              </span>
            ) : null}
            <span className="text-sm text-[#6b7280]">Yazar: {post.author}</span>
            <PostViewCount postId={post.id} initialCount={post.viewCount} />
          </div>

          <div className="space-y-4">
            <h1 className="font-heading text-4xl leading-tight text-[#111827] sm:text-5xl">
              {post.title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[#4b5563]">{post.summary}</p>
            <div className="flex flex-wrap items-center gap-3">
              <LikeButton
                postId={post.id}
                postSlug={post.slug}
                initialCount={likeCount}
                initialLiked={initialLiked}
                isAuthenticated={Boolean(session?.user)}
              />
              <FavoriteButton
                postId={post.id}
                postSlug={post.slug}
                initialFavorited={initialFavorited}
                isAuthenticated={Boolean(session?.user)}
              />
            </div>
          </div>

          <div className="space-y-5 text-lg leading-8 text-[#1f2937]">
            {post.content.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <PostReactionPanel
            postId={post.id}
            initialCounts={reactionCounts}
            initialSelectedType={selectedReaction}
            isAuthenticated={Boolean(session?.user)}
          />

          <ShareButtons
            title={post.title}
            summary={post.summary}
            url={getAbsoluteUrl(`/yazi/${post.slug}`)}
          />

          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 border-t border-[#f1e6dd] pt-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/arama?q=${encodeURIComponent(tag.name)}`}
                  className="rounded-full bg-[#fff7ed] px-3 py-1 text-sm font-semibold text-[#9a3412] transition hover:bg-[#ffedd5] hover:text-[#7c2d12]"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button href="/" variant="secondary">
              Ana Sayfaya Don
            </Button>
            <Button href={`/kategori/${post.categorySlug}`}>Kategoriye Git</Button>
            <ReportButton
              targetType="post"
              targetId={post.id}
              isAuthenticated={Boolean(session?.user)}
              label="Bu icerigi bildir"
            />
          </div>
        </div>
      </article>

      <CommentSection postId={post.id} postSlug={post.slug} />

      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c2410c]">
              Benzer Icerikler
            </p>
            <h2 className="mt-2 font-heading text-3xl text-[#111827]">Okumaya devam edin</h2>
          </div>
          <Link href={`/kategori/${post.categorySlug}`} className="text-sm font-semibold text-[#c2410c]">
            Daha Fazla Icerik Gor
          </Link>
        </div>

        {relatedPosts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/yazi/${relatedPost.slug}`}
                className="rounded-[28px] border border-[#f1e6dd] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#fb923c]"
              >
                <p className="text-sm font-semibold text-[#c2410c]">{relatedPost.category}</p>
                <h3 className="mt-3 text-xl font-semibold leading-8 text-[#111827]">
                  {relatedPost.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#4b5563]">{relatedPost.summary}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-6 text-center">
            <h3 className="font-heading text-2xl text-[#111827]">Bu kategoride baska yazi yok</h3>
            <p className="mt-3 text-base leading-7 text-[#4b5563]">
              Dilersen ana sayfaya donup baska kategorilerde yeni icerikler kesfedebilirsin.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
