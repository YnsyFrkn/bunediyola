"use server";

import { CommentStatus, PostStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
const WEEKLY_WINDOW_MS = 7 * DAILY_WINDOW_MS;
const DEFAULT_POPULAR_LIMIT = 10;
const MIN_POPULAR_SCORE = 5;

export type PopularPostRecord = Awaited<ReturnType<typeof getPopularPostsWeekly>>[number];

function calculatePostScoreValue({
  likeCount,
  commentCount,
  favoriteCount,
}: {
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
}) {
  return likeCount + commentCount * 2 + favoriteCount * 3;
}

export async function calculatePostScore(input: {
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
}) {
  return calculatePostScoreValue(input);
}

async function getPopularPostsSince(since: Date, limit = DEFAULT_POPULAR_LIMIT) {
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      deletedAt: null,
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      likes: {
        where: {
          createdAt: {
            gte: since,
          },
        },
        select: {
          id: true,
        },
      },
      comments: {
        where: {
          status: CommentStatus.VISIBLE,
          deletedAt: null,
          createdAt: {
            gte: since,
          },
        },
        select: {
          id: true,
        },
      },
      favorites: {
        where: {
          createdAt: {
            gte: since,
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  return posts
    .map((post) => {
      const likeCount = post.likes.length;
      const commentCount = post.comments.length;
      const favoriteCount = post.favorites.length;
      const score = calculatePostScoreValue({
        likeCount,
        commentCount,
        favoriteCount,
      });

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        image: post.coverImage || "/images/posts/gundem-gunluk.svg",
        category: post.category.name,
        categorySlug: post.category.slug,
        likeCount,
        commentCount,
        favoriteCount,
        score,
        createdAt: post.createdAt,
      };
    })
    .filter((post) => post.score >= MIN_POPULAR_SCORE)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .slice(0, limit);
}

export async function getPopularPostsDaily(limit = DEFAULT_POPULAR_LIMIT) {
  return getPopularPostsSince(new Date(Date.now() - DAILY_WINDOW_MS), limit);
}

export async function getPopularPostsWeekly(limit = DEFAULT_POPULAR_LIMIT) {
  return getPopularPostsSince(new Date(Date.now() - WEEKLY_WINDOW_MS), limit);
}
