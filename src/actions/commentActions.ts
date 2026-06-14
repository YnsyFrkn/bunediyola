"use server";

import { CommentStatus, NotificationType, PostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import type { FormState } from "@/actions/formState";
import { createNotification } from "@/actions/notificationActions";
import { ensureAdminSession, auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCommentInput } from "@/validations/commentSchema";

export type PublicCommentRecord = Awaited<ReturnType<typeof getCommentsByPostId>>[number];
export type AdminCommentRecord = Awaited<ReturnType<typeof getAllCommentsForAdmin>>[number];
export type AdminCommentsPageResult = Awaited<ReturnType<typeof getAdminCommentsPage>>;
export type UserCommentRecord = Awaited<ReturnType<typeof getCommentsByUserId>>[number];

const ADMIN_COMMENTS_PAGE_SIZE = 10;

export async function getCommentsByPostId(postId: string) {
  return prisma.comment.findMany({
    where: {
      postId,
      parentId: null,
      status: CommentStatus.VISIBLE,
      OR: [
        {
          deletedAt: null,
        },
        {
          replies: {
            some: {
              status: CommentStatus.VISIBLE,
              deletedAt: null,
            },
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      replies: {
        where: {
          status: CommentStatus.VISIBLE,
          deletedAt: null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCommentsByPostSlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    return [];
  }

  return getCommentsByPostId(post.id);
}

export async function getCommentsByUserId(userId: string) {
  return prisma.comment.findMany({
    where: {
      userId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllCommentsForAdmin() {
  await ensureAdminSession();

  return prisma.comment.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      post: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdminCommentsPage(page = 1) {
  await ensureAdminSession();

  const currentPage = Math.max(1, page);

  const [comments, totalCount] = await Promise.all([
    prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ADMIN_COMMENTS_PAGE_SIZE,
      skip: (currentPage - 1) * ADMIN_COMMENTS_PAGE_SIZE,
    }),
    prisma.comment.count(),
  ]);

  return {
    comments,
    pagination: {
      currentPage,
      pageSize: ADMIN_COMMENTS_PAGE_SIZE,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / ADMIN_COMMENTS_PAGE_SIZE)),
    },
  };
}

export async function createComment(
  postId: string,
  postSlug: string,
  parentId: string | null,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Yorum yapmak icin giris yapmalisin.",
    };
  }

  const parsed = parseCommentInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Yorumunu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      deletedAt: true,
    },
  });

  if (!post || post.deletedAt) {
    return {
      success: false,
      message: "Yorum yapmak istedigin yazi bulunamadi.",
    };
  }

  if (post.status !== PostStatus.PUBLISHED) {
    return {
      success: false,
      message: "Bu yazi henuz yayinda olmadigi icin yorum yapilamaz.",
    };
  }

  if (parentId) {
    const parentComment = await prisma.comment.findFirst({
      where: {
        id: parentId,
        postId: post.id,
        parentId: null,
        status: CommentStatus.VISIBLE,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!parentComment) {
      return {
        success: false,
        message: "Cevaplamak istedigin yorum artik kullanilabilir degil.",
      };
    }
  }

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      postId: post.id,
      userId: session.user.id,
      parentId,
      status: CommentStatus.VISIBLE,
    },
  });

  try {
    const commenterName = session.user.name ?? session.user.email ?? "Bir kullanici";

    await createNotification({
      type: NotificationType.NEW_COMMENT,
      title: "Yeni yorum geldi",
      message: `${commenterName}, "${post.title}" yazisina ${parentId ? "cevap" : "yorum"} yazdi.`,
      targetUrl: `/yazi/${post.slug}`,
      dedupeKey: `comment:${session.user.id}:${post.id}`,
    });
  } catch (error) {
    console.error("Admin yorum bildirimi olusturulamadi", error);
  }

  revalidatePath(`/yazi/${post.slug}`);
  revalidatePath(`/yazi/${postSlug}`);
  revalidatePath("/profil");
  revalidatePath("/profil/comments");
  revalidatePath("/admin/comments");
  revalidatePath("/admin");
  revalidatePath("/admin/notifications");

  return {
    success: true,
    message: parentId ? "Cevabin yayinlandi." : "Yorumun yayinlandi.",
  };
}

export async function updateOwnComment(
  commentId: string,
  postSlug: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Yorumunu duzenlemek icin giris yapmalisin.",
    };
  }

  const parsed = parseCommentInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Yorumunu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const result = await prisma.comment.updateMany({
    where: {
      id: commentId,
      userId: session.user.id,
      status: CommentStatus.VISIBLE,
      deletedAt: null,
    },
    data: {
      content: parsed.data.content,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Bu yorum bulunamadi veya duzenleme yetkin yok.",
    };
  }

  revalidatePath(`/yazi/${postSlug}`);
  revalidatePath("/profil");
  revalidatePath("/profil/comments");
  revalidatePath("/admin/comments");

  return {
    success: true,
    message: "Yorumun guncellendi.",
  };
}

export async function deleteOwnComment(commentId: string, postSlug: string) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Yorumunu silmek icin giris yapmalisin.",
    };
  }

  const result = await prisma.comment.updateMany({
    where: {
      id: commentId,
      userId: session.user.id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Bu yorum bulunamadi veya silme yetkin yok.",
    };
  }

  revalidatePath(`/yazi/${postSlug}`);
  revalidatePath("/profil");
  revalidatePath("/profil/comments");
  revalidatePath("/admin/comments");
  revalidatePath("/admin");

  return {
    success: true,
  };
}

export async function hideComment(id: string) {
  await ensureAdminSession();

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!comment) {
    return;
  }

  await prisma.comment.update({
    where: {
      id,
    },
    data: {
      status: CommentStatus.HIDDEN,
      deletedAt: new Date(),
    },
  });

  revalidatePath("/admin/comments");
  revalidatePath(`/yazi/${comment.post.slug}`);
  revalidatePath("/profil");
  revalidatePath("/profil/comments");
}

export async function restoreComment(id: string) {
  await ensureAdminSession();

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!comment) {
    return;
  }

  await prisma.comment.update({
    where: {
      id,
    },
    data: {
      status: CommentStatus.VISIBLE,
      deletedAt: null,
    },
  });

  revalidatePath("/admin/comments");
  revalidatePath(`/yazi/${comment.post.slug}`);
  revalidatePath("/profil");
  revalidatePath("/profil/comments");
}
