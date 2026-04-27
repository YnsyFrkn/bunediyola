import { getPopularPostsDaily, getPopularPostsWeekly } from "@/actions/popularActions";
import { getRecommendedPosts } from "@/actions/recommendationActions";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedPosts } from "@/components/home/FeaturedPosts";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestPosts } from "@/components/home/LatestPosts";
import { PopularSection } from "@/components/home/PopularSection";
import { RecommendedSection } from "@/components/home/RecommendedSection";
import { Container } from "@/components/layout/Container";
import { auth } from "@/lib/auth";
import { getPublicCategories, getPublicPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [session, categories, publicPosts, dailyPopularPosts, weeklyPopularPosts, recommendedPosts] = await Promise.all([
    auth(),
    getPublicCategories(),
    getPublicPosts(),
    getPopularPostsDaily(10),
    getPopularPostsWeekly(10),
    getRecommendedPosts(10),
  ]);
  const featuredPosts = publicPosts.filter((post) => post.isFeatured);
  const latestPosts = [...publicPosts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const heroPost = featuredPosts[0] ?? latestPosts[0];
  const heroSidePosts =
    featuredPosts.length > 1
      ? featuredPosts.slice(1, 3)
      : latestPosts.filter((post) => post.slug !== heroPost.slug).slice(0, 2);
  const homepageFeaturedPosts = featuredPosts.length > 0 ? featuredPosts : latestPosts.slice(0, 3);

  return (
    <Container className="space-y-16 py-8 sm:space-y-20 sm:py-10">
      <HeroSection featuredPost={heroPost} sidePosts={heroSidePosts} />
      <CategorySection categories={categories} />
      <FeaturedPosts posts={homepageFeaturedPosts} />
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
