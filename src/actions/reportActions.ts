"use server";

import {
  CommentStatus,
  NotificationType,
  PostStatus,
  ReportStatus,
  ReportType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import type { FormState } from "@/actions/formState";
import { createNotification } from "@/actions/notificationActions";
import { auth, ensureAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  parseReportInput,
  reportReasonLabels,
  type reportStatusLabels,
} from "@/validations/reportSchema";

const ADMIN_REPORTS_PAGE_SIZE = 20;
const ACTIVE_DUPLICATE_STATUSES: ReportStatus[] = [ReportStatus.PENDING, ReportStatus.REVIEWED];

export type ReportStatusFilter = "all" | Lowercase<keyof typeof reportStatusLabels>;
export type ReportTypeFilter = "all" | "post" | "comment";
export type AdminReportsResult = Awaited<ReturnType<typeof getReportsForAdmin>>;
export type AdminReportRecord = AdminReportsResult["reports"][number];

function getReportTargetLabel(type: ReportType) {
  return type === ReportType.POST ? "yazi" : "yorum";
}

function getReportWhere(status: ReportStatusFilter, type: ReportTypeFilter) {
  return {
    ...(status === "all" ? {} : { status: status.toUpperCase() as ReportStatus }),
    ...(type === "all" ? {} : { type: type.toUpperCase() as ReportType }),
  };
}

async function createReportNotification({
  type,
  reason,
  postId,
  commentId,
}: {
  type: ReportType;
  reason: keyof typeof reportReasonLabels;
  postId?: string | null;
  commentId?: string | null;
}) {
  try {
    await createNotification({
      type: NotificationType.REPORT_CREATED,
      title: "Yeni sikayet geldi",
      message: `Bir ${getReportTargetLabel(type)} "${reportReasonLabels[reason]}" sebebiyle bildirildi.`,
      targetUrl: "/admin/reports?status=pending",
      dedupeKey: type === ReportType.POST ? `report:post:${postId}` : `report:comment:${commentId}`,
    });
  } catch (error) {
    console.error("Admin sikayet bildirimi olusturulamadi", error);
  }
}

export async function createPostReport(
  postId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Sikayet gondermek icin giris yapmalisin.",
    };
  }

  const parsed = parseReportInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
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
      status: true,
      deletedAt: true,
    },
  });

  if (!post || post.deletedAt || post.status !== PostStatus.PUBLISHED) {
    return {
      success: false,
      message: "Bu icerik artik bildirilemez.",
    };
  }

  const duplicate = await prisma.report.findFirst({
    where: {
      type: ReportType.POST,
      reporterId: session.user.id,
      postId: post.id,
      status: {
        in: ACTIVE_DUPLICATE_STATUSES,
      },
    },
  });

  if (duplicate) {
    return {
      success: false,
      message: "Bu icerigi daha once bildirdin.",
      values: {
        reason: parsed.data.reason,
        detail: parsed.data.detail ?? "",
      },
    };
  }

  await prisma.report.create({
    data: {
      type: ReportType.POST,
      reason: parsed.data.reason,
      detail: parsed.data.detail,
      reporterId: session.user.id,
      postId: post.id,
    },
  });

  await createReportNotification({
    type: ReportType.POST,
    reason: parsed.data.reason,
    postId: post.id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/notifications");

  return {
    success: true,
    message: "Bildirimin alindi. Inceleme icin tesekkur ederiz.",
  };
}

export async function createCommentReport(
  commentId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Sikayet gondermek icin giris yapmalisin.",
    };
  }

  const parsed = parseReportInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          status: true,
          deletedAt: true,
        },
      },
    },
  });

  if (
    !comment ||
    comment.deletedAt ||
    comment.status !== CommentStatus.VISIBLE ||
    comment.post.deletedAt ||
    comment.post.status !== PostStatus.PUBLISHED
  ) {
    return {
      success: false,
      message: "Bu icerik artik bildirilemez.",
    };
  }

  const duplicate = await prisma.report.findFirst({
    where: {
      type: ReportType.COMMENT,
      reporterId: session.user.id,
      commentId: comment.id,
      status: {
        in: ACTIVE_DUPLICATE_STATUSES,
      },
    },
  });

  if (duplicate) {
    return {
      success: false,
      message: "Bu icerigi daha once bildirdin.",
      values: {
        reason: parsed.data.reason,
        detail: parsed.data.detail ?? "",
      },
    };
  }

  await prisma.report.create({
    data: {
      type: ReportType.COMMENT,
      reason: parsed.data.reason,
      detail: parsed.data.detail,
      reporterId: session.user.id,
      commentId: comment.id,
      postId: comment.post.id,
    },
  });

  await createReportNotification({
    type: ReportType.COMMENT,
    reason: parsed.data.reason,
    commentId: comment.id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/notifications");

  return {
    success: true,
    message: "Bildirimin alindi. Inceleme icin tesekkur ederiz.",
  };
}

export async function getReportsForAdmin({
  status = "all",
  type = "all",
  page = 1,
}: {
  status?: ReportStatusFilter;
  type?: ReportTypeFilter;
  page?: number;
}) {
  await ensureAdminSession();

  const currentPage = Math.max(1, page);
  const where = getReportWhere(status, type);

  const [reports, totalCount] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        reporter: {
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
        comment: {
          select: {
            id: true,
            content: true,
            post: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ADMIN_REPORTS_PAGE_SIZE,
      skip: (currentPage - 1) * ADMIN_REPORTS_PAGE_SIZE,
    }),
    prisma.report.count({
      where,
    }),
  ]);

  return {
    reports,
    pagination: {
      currentPage,
      pageSize: ADMIN_REPORTS_PAGE_SIZE,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / ADMIN_REPORTS_PAGE_SIZE)),
    },
  };
}

export async function getPendingReportCount() {
  await ensureAdminSession();

  return prisma.report.count({
    where: {
      status: ReportStatus.PENDING,
    },
  });
}

export async function updateReportStatus(id: string, status: ReportStatus) {
  "use server";

  await ensureAdminSession();

  await prisma.report.update({
    where: {
      id,
    },
    data: {
      status,
      reviewedAt: status === ReportStatus.PENDING ? null : new Date(),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/reports");
}
