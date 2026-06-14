"use server";

import { PostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import {
  createEmptyReactionCounts,
  type PostReactionState,
  type ReactionCounts,
} from "@/lib/postReactions";
import { prisma } from "@/lib/prisma";
import { postReactionSchema } from "@/validations/postReactionSchema";

export async function getPostReactionCounts(postId: string): Promise<ReactionCounts> {
  const groupedReactions = await prisma.postReaction.groupBy({
    by: ["type"],
    where: {
      postId,
    },
    _count: {
      _all: true,
    },
  });
  const counts = createEmptyReactionCounts();

  groupedReactions.forEach((reaction) => {
    counts[reaction.type] = reaction._count._all;
  });

  return counts;
}

export async function getUserPostReaction(postId: string, userId: string) {
  const reaction = await prisma.postReaction.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
    select: {
      type: true,
    },
  });

  return reaction?.type ?? null;
}

export async function setPostReaction(
  postId: string,
  prevState: PostReactionState,
  formData: FormData,
): Promise<PostReactionState> {
  const parsed = postReactionSchema.safeParse({
    type: formData.get("type"),
  });

  if (!parsed.success) {
    return {
      ...prevState,
      message: "Tepki secimi gecersiz.",
    };
  }

  const session = await auth();

  if (!session?.user) {
    return {
      selectedType: null,
      counts: await getPostReactionCounts(postId),
      message: "Tepki vermek icin giris yapmalisin.",
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
      selectedType: null,
      counts: createEmptyReactionCounts(),
      message: "Tepki vermek istedigin yazi bulunamadi.",
    };
  }

  const existingReaction = await prisma.postReaction.findUnique({
    where: {
      postId_userId: {
        postId: post.id,
        userId: session.user.id,
      },
    },
    select: {
      id: true,
      type: true,
    },
  });
  const isRemoving = existingReaction?.type === parsed.data.type;

  if (isRemoving && existingReaction) {
    await prisma.postReaction.delete({
      where: {
        id: existingReaction.id,
      },
    });
  } else {
    await prisma.postReaction.upsert({
      where: {
        postId_userId: {
          postId: post.id,
          userId: session.user.id,
        },
      },
      create: {
        postId: post.id,
        userId: session.user.id,
        type: parsed.data.type,
      },
      update: {
        type: parsed.data.type,
      },
    });
  }

  revalidatePath(`/yazi/${post.slug}`);

  return {
    selectedType: isRemoving ? null : parsed.data.type,
    counts: await getPostReactionCounts(post.id),
    message: isRemoving ? "Tepkin geri alindi." : "Tepkin kaydedildi.",
  };
}
