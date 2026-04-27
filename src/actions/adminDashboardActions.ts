"use server";

import { CommentStatus, ReportStatus } from "@prisma/client";

import { ensureAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const RECENT_COMMENT_WINDOW_DAYS = 7;

export async function getAdminDashboardStats() {
  await ensureAdminSession();

  const recentCommentStart = new Date(
    Date.now() - RECENT_COMMENT_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );

  const [totalUsers, recentCommentCount, pendingReportCount] = await Promise.all([
    prisma.user.count(),
    prisma.comment.count({
      where: {
        status: CommentStatus.VISIBLE,
        deletedAt: null,
        createdAt: {
          gte: recentCommentStart,
        },
      },
    }),
    prisma.report.count({
      where: {
        status: ReportStatus.PENDING,
      },
    }),
  ]);

  return {
    totalUsers,
    recentCommentCount,
    pendingReportCount,
    recentCommentWindowDays: RECENT_COMMENT_WINDOW_DAYS,
  };
}
