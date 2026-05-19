"use server";

import type { Post } from "@/types/post";
import { getMockCategories, getMockPostById, getMockPosts } from "@/lib/mockDb";
import { prisma } from "@/lib/prisma";
import { getReadingTimeMinutes } from "@/utils/readingTime";

export async function getPostEditorPick(postId: string) {
  if (!process.env.DATABASE_URL) {
    return getMockPostById(postId, { includeDeleted: true })?.isEditorPick ?? false;
  }

  const rows = await prisma.$queryRaw<Array<{ isEditorPick: boolean }>>`
    SELECT "isEditorPick"
    FROM "Post" p
    WHERE "id" = ${postId}
    LIMIT 1
  `;

  return rows[0]?.isEditorPick ?? false;
}

export async function setPostEditorPick(postId: string, isEditorPick: boolean) {
  if (!process.env.DATABASE_URL) {
    return;
  }

  await prisma.$executeRaw`
    UPDATE "Post"
    SET "isEditorPick" = ${isEditorPick}, "updatedAt" = NOW()
    WHERE "id" = ${postId}
  `;
}

export async function getEditorPickPosts(limit = 6) {
  if (!process.env.DATABASE_URL) {
    const categories = getMockCategories();

    return getMockPosts()
      .filter((post) => post.status === "PUBLISHED" && post.isEditorPick)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
      .map((post): Post => {
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
          isFeatured: post.viewCount >= 1000,
          isEditorPick: post.isEditorPick ?? false,
          viewCount: post.viewCount,
          readingTimeMinutes: getReadingTimeMinutes(post.content),
          status: post.status,
        };
      });
  }

  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      title: string;
      slug: string;
      summary: string;
      content: string;
      image: string | null;
      author: string;
      createdAt: Date;
      viewCount: number;
      category: string | null;
      categorySlug: string | null;
    }>
  >`
    SELECT
      p."id",
      p."title",
      p."slug",
      p."summary",
      p."content",
      p."coverImage" AS "image",
      p."author",
      p."createdAt",
      p."viewCount",
      c."name" AS "category",
      c."slug" AS "categorySlug"
    FROM "Post" p
    LEFT JOIN "Category" c ON c."id" = p."categoryId"
    WHERE p."isEditorPick" = true
      AND p."status" = 'PUBLISHED'
      AND p."deletedAt" IS NULL
    ORDER BY p."updatedAt" DESC, p."createdAt" DESC
    LIMIT ${limit}
  `;

  return rows.map((post): Post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    content: post.content,
    category: post.category ?? "Genel",
    categorySlug: post.categorySlug ?? "genel",
    image: post.image || "/images/posts/gundem-gunluk.svg",
    author: post.author,
    createdAt: post.createdAt.toISOString(),
    isFeatured: post.viewCount >= 1000,
    isEditorPick: true,
    viewCount: post.viewCount,
    readingTimeMinutes: getReadingTimeMinutes(post.content),
    status: "PUBLISHED",
  }));
}
