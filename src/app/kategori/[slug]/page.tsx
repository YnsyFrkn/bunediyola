import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PostGrid } from "@/components/post/PostGrid";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { getPublicCategories, getPublicPosts } from "@/lib/content";
import { getAbsoluteUrl, siteName } from "@/lib/site";
import { paginateItems, parsePageParam } from "@/utils/pagination";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    page?: string | string[];
  }>;
};

const CATEGORY_PAGE_SIZE = 9;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getPublicCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return {
      title: "Kategori bulunamadi",
    };
  }

  const categoryUrl = getAbsoluteUrl(`/kategori/${category.slug}`);

  return {
    title: category.name,
    description: category.description,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      type: "website",
      url: categoryUrl,
      siteName,
      title: `${category.name} icerikleri`,
      description: category.description,
    },
  };
}

export function generateStaticParams() {
  return [];
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, posts] = await Promise.all([getPublicCategories(), getPublicPosts()]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryPosts = posts.filter((post) => post.categorySlug === category.slug);
  const { items: paginatedPosts, pagination } = paginateItems(
    categoryPosts,
    parsePageParam((await searchParams)?.page),
    CATEGORY_PAGE_SIZE,
  );

  return (
    <Container className="space-y-10 py-10 sm:py-14">
      <section className="rounded-[36px] border border-[#f1e6dd] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.06)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c2410c]">Kategori</p>
        <h1 className="mt-4 font-heading text-4xl text-[#111827] sm:text-5xl">{category.name}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#4b5563]">{category.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/" variant="secondary">
            Ana Sayfaya Don
          </Button>
          <Link href="/#kategoriler" className="inline-flex items-center text-sm font-semibold text-[#c2410c]">
            Diger Kategorileri Gor
          </Link>
        </div>
      </section>

      {categoryPosts.length > 0 ? (
        <div className="space-y-5">
          <PostGrid posts={paginatedPosts} />
          <Pagination
            basePath={`/kategori/${category.slug}`}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            itemLabel="yazi"
          />
        </div>
      ) : (
        <section className="rounded-[32px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-8 text-center">
          <h2 className="font-heading text-3xl text-[#111827]">Henuz icerik yok</h2>
          <p className="mt-3 text-lg leading-8 text-[#4b5563]">
            Bu kategoride henuz icerik yok. Bu arada ana sayfadaki guncel yazilari
            kesfedebilirsin.
          </p>
          <Link
            href="/#son-eklenenler"
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
          >
            Guncel Icerikleri Kesfet
          </Link>
        </section>
      )}
    </Container>
  );
}
