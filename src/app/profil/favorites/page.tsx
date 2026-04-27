import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getUserFavoritePosts } from "@/actions/favoriteActions";
import { FavoriteButton } from "@/components/favorite/FavoriteButton";
import { Pagination } from "@/components/ui/Pagination";
import { auth } from "@/lib/auth";
import { formatDate } from "@/utils/formatDate";
import { paginateItems, parsePageParam } from "@/utils/pagination";

export const metadata: Metadata = {
  title: "Kaydettiklerim | bunediyola",
  description: "bunediyola hesabina ait kaydedilen yazilar.",
};

type ProfileFavoritesPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

const PROFILE_FAVORITES_PAGE_SIZE = 6;

export default async function ProfileFavoritesPage({ searchParams }: ProfileFavoritesPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/giris?callbackUrl=${encodeURIComponent("/profil/favorites")}`);
  }

  const favorites = await getUserFavoritePosts(session.user.id);
  const { items: paginatedFavorites, pagination } = paginateItems(
    favorites,
    parsePageParam((await searchParams).page),
    PROFILE_FAVORITES_PAGE_SIZE,
  );

  return (
    <section className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
            Profil
          </p>
          <h1 className="font-heading text-5xl text-[#111827] sm:text-6xl">Kaydettiklerim</h1>
          <p className="max-w-3xl text-lg leading-8 text-[#4b5563]">
            Daha sonra okumak icin kaydettigin yazilari buradan kolayca bulabilirsin.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#93c5fd] bg-[#eff6ff] p-6 text-center">
            <h2 className="font-heading text-2xl text-[#111827]">
              Henuz kaydettigin bir yazi yok
            </h2>
            <p className="mt-3 text-base leading-7 text-[#4b5563]">
              Ilgini ceken yazilari kaydederek buradan kolayca tekrar ulasabilirsin.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
            >
              Icerikleri Kesfet
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {paginatedFavorites.map((favorite) => (
                <article
                  key={favorite.id}
                  className="rounded-[28px] border border-[#f1e6dd] bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/kategori/${favorite.post.category.slug}`}
                        className="text-sm font-semibold text-[#c2410c] transition hover:text-[#9a3412]"
                      >
                        {favorite.post.category.name}
                      </Link>
                      <p className="mt-2 text-sm text-[#6b7280]">
                        Kaydedilme tarihi: {formatDate(favorite.createdAt.toISOString())}
                      </p>
                    </div>
                    <FavoriteButton
                      postId={favorite.post.id}
                      postSlug={favorite.post.slug}
                      initialFavorited
                      isAuthenticated
                      compact
                    />
                  </div>

                  <Link href={`/yazi/${favorite.post.slug}`} className="mt-5 block">
                    <h2 className="text-2xl font-semibold leading-9 text-[#111827] transition hover:text-[#c2410c]">
                      {favorite.post.title}
                    </h2>
                  </Link>
                  <p className="mt-3 text-base leading-7 text-[#4b5563]">{favorite.post.summary}</p>
                  <Link
                    href={`/yazi/${favorite.post.slug}`}
                    className="mt-5 inline-flex min-h-11 items-center rounded-full border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#fb923c] hover:text-[#9a3412]"
                  >
                    Yaziya Git
                  </Link>
                </article>
              ))}
            </div>
            <Pagination
              basePath="/profil/favorites"
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              itemLabel="kayit"
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
