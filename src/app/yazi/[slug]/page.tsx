import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PostDetail } from "@/components/post/PostDetail";
import { getPublicPosts } from "@/lib/content";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPublicPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Yazi bulunamadi | bunediyola",
    };
  }

  return {
    title: `${post.title} | bunediyola`,
    description: post.summary,
  };
}

export function generateStaticParams() {
  return [];
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const posts = await getPublicPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts
    .filter((item) => item.categorySlug === post.categorySlug && item.slug !== post.slug)
    .slice(0, 3);

  return (
    <Container className="py-10 sm:py-14">
      <PostDetail post={post} relatedPosts={relatedPosts} />
    </Container>
  );
}
