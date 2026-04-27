import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { PostGrid } from "@/components/post/PostGrid";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { getPublicPosts } from "@/lib/content";
import { paginateItems, parsePageParam } from "@/utils/pagination";
import { normalizeSearchText } from "@/utils/slugify";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string | string[];
  }>;
};

const SEARCH_PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Arama | bunediyola",
  description: "bunediyola icerikleri icinde arama sonuclari.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", page } = await searchParams;
  const normalizedQuery = normalizeSearchText(q);
  const quickSuggestions = ["gundem", "teknoloji", "mizah", "yapay zeka", "tatil"];
  const posts = await getPublicPosts();

  const filteredPosts = normalizedQuery
    ? posts.filter((post) => {
        const searchableText = normalizeSearchText(
          `${post.title} ${post.summary} ${post.category} ${post.author} ${post.content}`,
        );

        return searchableText.includes(normalizedQuery);
      })
    : [];
  const { items: paginatedPosts, pagination } = paginateItems(
    filteredPosts,
    parsePageParam(page),
    SEARCH_PAGE_SIZE,
  );

  return (
    <Container className="space-y-10 py-10 sm:py-14">
      <section className="rounded-[36px] border border-[#f1e6dd] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.06)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c2410c]">Arama</p>
        <h1 className="mt-4 font-heading text-4xl text-[#111827] sm:text-5xl">Icerik ara</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#4b5563]">
          {q
            ? `"${q}" icin arama sonuclari gosteriliyor.`
            : "Bir kelime yazip Enter tusuna basarak basliklar, ozetler ve kategoriler icinde arama yapabilirsin."}
        </p>
        {q ? (
          <p className="mt-3 text-sm font-semibold text-[#9a3412]">
            Toplam {filteredPosts.length} sonuc bulundu.
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/" variant="secondary">
            Ana Sayfaya Don
          </Button>
          <Link href="/#kategoriler" className="inline-flex items-center text-sm font-semibold text-[#c2410c]">
            Kategorilere Git
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {quickSuggestions.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/arama?q=${encodeURIComponent(suggestion)}`}
              className="rounded-full border border-[#f0b48f] bg-[#fff7ed] px-4 py-2 text-sm font-semibold text-[#9a3412] transition hover:border-[#f97316]"
            >
              {suggestion}
            </Link>
          ))}
        </div>
      </section>

      {q ? (
        filteredPosts.length > 0 ? (
          <div className="space-y-5">
            <PostGrid posts={paginatedPosts} />
            <Pagination
              basePath="/arama"
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              itemLabel="sonuc"
              query={{
                q,
              }}
            />
          </div>
        ) : (
          <section className="rounded-[32px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-8 text-center">
            <h2 className="font-heading text-3xl text-[#111827]">Sonuc bulunamadi</h2>
            <p className="mt-3 text-lg leading-8 text-[#4b5563]">
              <span>&quot;{q}&quot;</span> ile eslesen bir icerik bulamadik. Daha farkli bir
              kelime deneyebilirsin.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {quickSuggestions.map((suggestion) => (
                <Link
                  key={suggestion}
                  href={`/arama?q=${encodeURIComponent(suggestion)}`}
                  className="rounded-full border border-[#f0b48f] bg-white px-4 py-2 text-sm font-semibold text-[#9a3412] transition hover:border-[#f97316]"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </section>
        )
      ) : (
        <section className="rounded-[32px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-8 text-center">
          <h2 className="font-heading text-3xl text-[#111827]">Aramaya hazir</h2>
          <p className="mt-3 text-lg leading-8 text-[#4b5563]">
            Ust kisimdaki arama alanina bir baslik, kategori ya da konu yazman yeterli.
          </p>
        </section>
      )}
    </Container>
  );
}
