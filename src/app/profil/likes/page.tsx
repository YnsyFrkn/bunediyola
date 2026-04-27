import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getUserLikedPosts } from "@/actions/likeActions";
import { PostGrid } from "@/components/post/PostGrid";
import { Pagination } from "@/components/ui/Pagination";
import { auth } from "@/lib/auth";
import type { Post } from "@/types/post";
import { paginateItems, parsePageParam } from "@/utils/pagination";

export const metadata: Metadata = {
  title: "Begendiklerim | bunediyola",
  description: "bunediyola hesabina ait begenilen yazilar.",
};

type ProfileLikesPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

const PROFILE_LIKES_PAGE_SIZE = 9;

export default async function ProfileLikesPage({ searchParams }: ProfileLikesPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/giris?callbackUrl=${encodeURIComponent("/profil/likes")}`);
  }

  const likes = await getUserLikedPosts(session.user.id);
  const likedPosts: Post[] = likes.map((like) => ({
    id: like.post.id,
    title: like.post.title,
    slug: like.post.slug,
    summary: like.post.summary,
    content: like.post.content,
    category: like.post.category.name,
    categorySlug: like.post.category.slug,
    image: like.post.coverImage || "/images/posts/gundem-gunluk.svg",
    author: like.post.author,
    createdAt: like.post.createdAt.toISOString(),
    isFeatured: like.post.status === "PUBLISHED" && like.post.viewCount >= 1000,
    viewCount: like.post.viewCount,
    status: like.post.status,
  }));
  const { items: paginatedLikedPosts, pagination } = paginateItems(
    likedPosts,
    parsePageParam((await searchParams).page),
    PROFILE_LIKES_PAGE_SIZE,
  );

  return (
    <section className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
            Profil
          </p>
          <h1 className="font-heading text-5xl text-[#111827] sm:text-6xl">Begendiklerim</h1>
          <p className="max-w-3xl text-lg leading-8 text-[#4b5563]">
            Begendigin yazilari buradan yeniden bulabilir ve okumaya devam edebilirsin.
          </p>
        </div>

        {likedPosts.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-6 text-center">
            <h2 className="font-heading text-2xl text-[#111827]">Henuz yazi begenmedin</h2>
            <p className="mt-3 text-base leading-7 text-[#4b5563]">
              Yazilardaki begen butonunu kullanarak sevdigin icerikleri burada toplayabilirsin.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
            >
              Yazilara Git
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <PostGrid posts={paginatedLikedPosts} />
            <Pagination
              basePath="/profil/likes"
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              itemLabel="begeni"
            />
          </div>
        )}

        <Link
          href="/profil"
          className="inline-flex min-h-11 items-center rounded-full border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#fb923c] hover:text-[#9a3412]"
        >
          Profile Don
        </Link>
    </section>
  );
}
