"use server";

import { PostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type LikeState = {
  liked: boolean;
  count: number;
  message?: string;
};

export type UserLikedPostRecord = Awaited<ReturnType<typeof getUserLikedPosts>>[number];

export async function getLikeCount(postId: string) {
  return prisma.like.count({
    where: {
      postId,
    },
  });
}

export async function isPostLikedByUser(postId: string, userId: string) {
  const like = await prisma.like.findUnique({
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

  return Boolean(like);
}

export async function getUserLikedPosts(userId: string) {
  return prisma.like.findMany({
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

export async function toggleLike(
  postId: string,
  prevState: LikeState,
  formData: FormData,
): Promise<LikeState> {
  void prevState;
  void formData;

  const session = await auth();

  if (!session?.user) {
    return {
      liked: false,
      count: await getLikeCount(postId),
      message: "Begenmek icin giris yapmalisin.",
    };
  }

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
      liked: false,
      count: 0,
      message: "Begenmek istedigin yazi bulunamadi.",
    };
  }

  const existingLike = await prisma.like.findUnique({
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

  const liked = !existingLike;

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        postId: post.id,
        userId: session.user.id,
      },
    });
  }

  const count = await getLikeCount(post.id);

  revalidatePath(`/yazi/${post.slug}`);
  revalidatePath("/profil");
  revalidatePath("/profil/likes");

  return {
    liked,
    count,
    message: liked ? "Yaziyi begendin." : "Begeni geri alindi.",
  };
}
