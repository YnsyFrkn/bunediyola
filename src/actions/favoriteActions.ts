"use server";

import { PostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type FavoriteState = {
  favorited: boolean;
  message?: string;
};

export type UserFavoritePostRecord = Awaited<ReturnType<typeof getUserFavoritePosts>>[number];

export async function getFavoriteCount(postId: string) {
  return prisma.favorite.count({
    where: {
      postId,
    },
  });
}

export async function isPostFavoritedByUser(postId: string, userId: string) {
  const favorite = await prisma.favorite.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(favorite);
}

export async function getUserFavoritePosts(userId: string) {
  return prisma.favorite.findMany({
    where: {
      userId,
      post: {
        status: PostStatus.PUBLISHED,
        deletedAt: null,
      },
    },
    include: {
      post: {
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function toggleFavorite(
  postId: string,
  prevState: FavoriteState,
  formData: FormData,
): Promise<FavoriteState> {
  void formData;

  const session = await auth();

  if (!session?.user) {
    return {
      favorited: false,
      message: "Kaydetmek icin giris yapmalisin.",
    };
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        slug: true,
        status: true,
        deletedAt: true,
      },
    });

    if (!post || post.deletedAt || post.status !== PostStatus.PUBLISHED) {
      return {
        favorited: false,
        message: "Bu yazi artik kaydedilemez.",
      };
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId: session.user.id,
        },
      },
      select: {
        id: true,
      },
    });

    const favorited = !existingFavorite;

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          postId: post.id,
          userId: session.user.id,
        },
      });
    }

    revalidatePath(`/yazi/${post.slug}`);
    revalidatePath("/profil");
    revalidatePath("/profil/favorites");

    return {
      favorited,
      message: favorited ? "Yazi kaydedildi." : "Yazi kaydedilenlerden cikarildi.",
    };
  } catch {
    return {
      favorited: prevState.favorited,
      message: "Bir sorun olustu. Lutfen tekrar dene.",
    };
  }
}
