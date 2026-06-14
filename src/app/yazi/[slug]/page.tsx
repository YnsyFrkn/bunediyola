import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PostDetail } from "@/components/post/PostDetail";
import { getPublicPosts } from "@/lib/content";
import { getAbsoluteImageUrl, getAbsoluteUrl, siteName } from "@/lib/site";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPublicPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Yazi bulunamadi",
    };
  }

  const postUrl = getAbsoluteUrl(`/yazi/${post.slug}`);
  const imageUrl = getAbsoluteImageUrl(post.image);

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      siteName,
      title: post.title,
      description: post.summary,
      publishedTime: post.createdAt,
      authors: [post.author],
      section: post.category,
      tags: post.tags?.map((tag) => tag.name),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [imageUrl],
    },
  };
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
  const postUrl = getAbsoluteUrl(`/yazi/${post.slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    image: getAbsoluteImageUrl(post.image),
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: getAbsoluteUrl("/"),
    },
    mainEntityOfPage: postUrl,
  };

  return (
    <Container className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />
      <PostDetail post={post} relatedPosts={relatedPosts} />
    </Container>
  );
}
