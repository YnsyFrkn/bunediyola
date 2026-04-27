"use server";

import { CommentStatus, PostStatus } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_RECOMMENDATION_LIMIT = 10;
const RECOMMENDATION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const MIN_RECOMMENDATION_SCORE = 5;
const MAX_RECOMMENDATIONS_PER_CATEGORY = 3;

type RecommendationScoreInput = {
  categoryWeight: number;
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
};

export type RecommendedPostRecord = Awaited<ReturnType<typeof getRecommendedPosts>>[number];

function calculateRecommendationScoreValue({
  categoryWeight,
  likeCount,
  commentCount,
  favoriteCount,
}: RecommendationScoreInput) {
  const categoryMatchScore = categoryWeight > 0 ? 5 + categoryWeight : 0;
  const popularityBonus = (likeCount + commentCount + favoriteCount) / 10;

  return Number((categoryMatchScore + popularityBonus).toFixed(2));
}

export async function calculateRecommendationScore(input: RecommendationScoreInput) {
  return calculateRecommendationScoreValue(input);
}

export async function getUserInterestProfile() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const [likes, comments, favorites] = await Promise.all([
    prisma.like.findMany({
      where: {
        userId: session.user.id,
        post: {
          status: PostStatus.PUBLISHED,
          deletedAt: null,
        },
      },
      include: {
        post: {
          select: {
            id: true,
            categoryId: true,
          },
        },
      },
    }),
    prisma.comment.findMany({
      where: {
        userId: session.user.id,
        status: CommentStatus.VISIBLE,
        deletedAt: null,
        post: {
          status: PostStatus.PUBLISHED,
          deletedAt: null,
        },
      },
      include: {
        post: {
          select: {
            id: true,
            categoryId: true,
          },
        },
      },
    }),
    prisma.favorite.findMany({
      where: {
        userId: session.user.id,
        post: {
          status: PostStatus.PUBLISHED,
          deletedAt: null,
        },
      },
      include: {
        post: {
          select: {
            id: true,
            categoryId: true,
          },
        },
      },
    }),
  ]);

  const categoryWeights = new Map<string, number>();
  const interactedPostIds = new Set<string>();

  for (const like of likes) {
    interactedPostIds.add(like.post.id);
    categoryWeights.set(like.post.categoryId, (categoryWeights.get(like.post.categoryId) ?? 0) + 1);
  }

  for (const comment of comments) {
    interactedPostIds.add(comment.post.id);
    categoryWeights.set(
      comment.post.categoryId,
      (categoryWeights.get(comment.post.categoryId) ?? 0) + 2,
    );
  }

  for (const favorite of favorites) {
    interactedPostIds.add(favorite.post.id);
    categoryWeights.set(
      favorite.post.categoryId,
      (categoryWeights.get(favorite.post.categoryId) ?? 0) + 3,
    );
  }

  return {
    categoryWeights: Object.fromEntries(categoryWeights),
    interactedPostIds: Array.from(interactedPostIds),
  };
}

export async function getRecommendedPosts(limit = DEFAULT_RECOMMENDATION_LIMIT) {
  const interestProfile = await getUserInterestProfile();

  if (!interestProfile || Object.keys(interestProfile.categoryWeights).length === 0) {
    return [];
  }

  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      deletedAt: null,
      createdAt: {
        gte: new Date(Date.now() - RECOMMENDATION_WINDOW_MS),
      },
      id: {
        notIn: interestProfile.interactedPostIds,
      },
      categoryId: {
        in: Object.keys(interestProfile.categoryWeights),
      },
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      likes: {
        select: {
          id: true,
        },
      },
      comments: {
        where: {
          status: CommentStatus.VISIBLE,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      },
      favorites: {
        select: {
          id: true,
        },
      },
    },
  });
  const postsByCategory = new Map<string, number>();

  return posts
    .map((post) => {
      const likeCount = post.likes.length;
      const commentCount = post.comments.length;
      const favoriteCount = post.favorites.length;
      const categoryWeight = interestProfile.categoryWeights[post.categoryId] ?? 0;
      const score = calculateRecommendationScoreValue({
        categoryWeight,
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
        categoryId: post.categoryId,
        createdAt: post.createdAt,
        score,
      };
    })
    .filter((post) => post.score >= MIN_RECOMMENDATION_SCORE)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .filter((post) => {
      const categoryCount = postsByCategory.get(post.categoryId) ?? 0;

      if (categoryCount >= MAX_RECOMMENDATIONS_PER_CATEGORY) {
        return false;
      }

      postsByCategory.set(post.categoryId, categoryCount + 1);
      return true;
    })
    .slice(0, limit)
    .map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      image: post.image,
      category: post.category,
      categorySlug: post.categorySlug,
      score: post.score,
    }));
}
