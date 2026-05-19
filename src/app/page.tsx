import {
  getMostCommentedPosts,
  getMostLikedPosts,
  getPopularPostsDaily,
  getPopularPostsWeekly,
} from "@/actions/popularActions";
import { getEditorPickPosts } from "@/actions/editorPickActions";
import { getRecommendedPosts } from "@/actions/recommendationActions";
import { CategorySection } from "@/components/home/CategorySection";
import { EditorPicksSection } from "@/components/home/EditorPicksSection";
import { FeaturedPosts } from "@/components/home/FeaturedPosts";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestPosts } from "@/components/home/LatestPosts";
import { PopularSection } from "@/components/home/PopularSection";
import { ReaderPulseSection } from "@/components/home/ReaderPulseSection";
import { RecommendedSection } from "@/components/home/RecommendedSection";
import { TrendingTopics } from "@/components/home/TrendingTopics";
import { Container } from "@/components/layout/Container";
import { getTrendingTags } from "@/actions/tagActions";
import { auth } from "@/lib/auth";
import { getPublicCategories, getPublicPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    session,
    categories,
    publicPosts,
    dailyPopularPosts,
    weeklyPopularPosts,
    recommendedPosts,
    editorPickPosts,
    trendingTags,
    mostCommentedPosts,
    mostLikedPosts,
  ] = await Promise.all([
    auth(),
    getPublicCategories(),
    getPublicPosts(),
    getPopularPostsDaily(10),
    getPopularPostsWeekly(10),
    getRecommendedPosts(10),
    getEditorPickPosts(6),
    getTrendingTags(12),
    getMostCommentedPosts(5),
    getMostLikedPosts(5),
  ]);
  const featuredPosts = publicPosts.filter((post) => post.isFeatured);
  const latestPosts = [...publicPosts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const heroPost = featuredPosts[0] ?? latestPosts[0];
  const homepageFeaturedPosts = featuredPosts.length > 0 ? featuredPosts : latestPosts.slice(0, 3);

  if (!heroPost) {
    return (
      <Container className="space-y-12 py-10 sm:py-14">
        <section className="rounded-[36px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c2410c]">
            bunediyola
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-tight text-[#111827] sm:text-5xl">
            Henuz yayinda icerik yok
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#4b5563]">
            Ilk yazilar yayina alindiginda ana sayfa otomatik olarak dolacak. Kategoriler
            ve yeni icerikler hazirlandikca burada gorunecek.
          </p>
        </section>
        <TrendingTopics tags={trendingTags} />
        <CategorySection categories={categories} />
      </Container>
    );
  }

  const heroSidePosts =
    featuredPosts.length > 1
      ? featuredPosts.slice(1, 3)
      : latestPosts.filter((post) => post.slug !== heroPost.slug).slice(0, 2);

  return (
    <Container className="space-y-16 py-8 sm:space-y-20 sm:py-10">
      <HeroSection featuredPost={heroPost} sidePosts={heroSidePosts} />
      <TrendingTopics tags={trendingTags} />
      <EditorPicksSection posts={editorPickPosts} />
      <CategorySection categories={categories} />
      <FeaturedPosts posts={homepageFeaturedPosts} />
      <ReaderPulseSection
        mostCommentedPosts={mostCommentedPosts}
        mostLikedPosts={mostLikedPosts}
      />
      <RecommendedSection
        posts={recommendedPosts}
        fallbackPosts={weeklyPopularPosts}
        isAuthenticated={Boolean(session?.user)}
      />
      <LatestPosts posts={latestPosts.slice(0, 6)} />
      <PopularSection dailyPosts={dailyPopularPosts} weeklyPosts={weeklyPopularPosts} />
    </Container>
  );
}
