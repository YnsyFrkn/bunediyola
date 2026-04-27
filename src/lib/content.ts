import type { PostStatus } from "@prisma/client";

import type { Category } from "@/types/category";
import type { Post } from "@/types/post";

import { getCategories } from "@/actions/categoryActions";
import { getPublishedPosts } from "@/actions/postActions";

function mapStatusToFeatured(status: PostStatus, viewCount: number) {
  return status === "PUBLISHED" && viewCount >= 1000;
}

export async function getPublicCategories(): Promise<Category[]> {
  const categories = await getCategories();

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
  }));
}

export async function getPublicPosts(): Promise<Post[]> {
  const posts = await getPublishedPosts();
  const categories = await getCategories();

  return posts.map((post) => {
    const category = categories.find((item) => item.id === post.categoryId);

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      category: category?.name ?? "Genel",
      categorySlug: category?.slug ?? "genel",
      image: post.coverImage || "/images/posts/gundem-gunluk.svg",
      author: post.author,
      createdAt: post.createdAt.toISOString(),
      isFeatured: mapStatusToFeatured(post.status, post.viewCount),
      viewCount: post.viewCount,
      status: post.status,
    };
  });
}
