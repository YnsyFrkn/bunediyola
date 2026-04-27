import { NotificationType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { ensureAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const NOTIFICATION_PAGE_SIZE = 20;
const NOTIFICATION_MAX_RECORDS = 1000;
const NOTIFICATION_CLEANUP_DAYS = 30;
const NOTIFICATION_DEDUPE_WINDOW_MS = 10 * 60 * 1000;
type NotificationDbClient = Prisma.TransactionClient | typeof prisma;

export type NotificationFilter = "all" | "unread" | "read";
export type AdminNotificationsResult = Awaited<ReturnType<typeof getAdminNotifications>>;
export type AdminNotificationRecord = AdminNotificationsResult["notifications"][number];

type CreateNotificationInput = {
  type: NotificationType;
  title: string;
  message: string;
  targetUrl?: string;
  dedupeKey?: string;
};

function isTransactionConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034";
}

function getNotificationWhere(filter: NotificationFilter) {
  const baseWhere = {
    deletedAt: null,
  };

  if (filter === "all") {
    return baseWhere;
  }

  return {
    ...baseWhere,
    isRead: filter === "read",
  };
}

async function cleanupNotifications(db: NotificationDbClient = prisma) {
  const olderThan = new Date(Date.now() - NOTIFICATION_CLEANUP_DAYS * 24 * 60 * 60 * 1000);

  await db.notification.updateMany({
    where: {
      deletedAt: null,
      createdAt: {
        lt: olderThan,
      },
    },
    data: {
      deletedAt: new Date(),
    },
  });

  const totalCount = await db.notification.count({
    where: {
      deletedAt: null,
    },
  });

  if (totalCount <= NOTIFICATION_MAX_RECORDS) {
    return;
  }

  const oldNotifications = await db.notification.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: totalCount - NOTIFICATION_MAX_RECORDS,
  });

  await db.notification.updateMany({
    where: {
      id: {
        in: oldNotifications.map((notification) => notification.id),
      },
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function createNotification({
  type,
  title,
  message,
  targetUrl,
  dedupeKey,
}: CreateNotificationInput) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          await cleanupNotifications(tx);

          if (dedupeKey) {
            const duplicate = await tx.notification.findFirst({
              where: {
                dedupeKey,
                deletedAt: null,
                createdAt: {
                  gte: new Date(Date.now() - NOTIFICATION_DEDUPE_WINDOW_MS),
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            });

            if (duplicate) {
              return duplicate;
            }
          }

          const notification = await tx.notification.create({
            data: {
              type,
              title,
              message,
              targetUrl,
              dedupeKey,
            },
          });

          await cleanupNotifications(tx);

          return notification;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (attempt === maxAttempts || !isTransactionConflict(error)) {
        throw error;
      }
    }
  }

  throw new Error("Bildirim olusturulamadi.");
}

export async function getAdminNotifications(filter: NotificationFilter = "all", page = 1) {
  await ensureAdminSession();

  const currentPage = Math.max(1, page);
  const where = getNotificationWhere(filter);

  const [notifications, totalCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: NOTIFICATION_PAGE_SIZE,
      skip: (currentPage - 1) * NOTIFICATION_PAGE_SIZE,
    }),
    prisma.notification.count({
      where,
    }),
  ]);

  return {
    notifications,
    pagination: {
      currentPage,
      pageSize: NOTIFICATION_PAGE_SIZE,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / NOTIFICATION_PAGE_SIZE)),
    },
  };
}

export async function getUnreadNotificationCount() {
  await ensureAdminSession();

  return prisma.notification.count({
    where: {
      isRead: false,
      deletedAt: null,
    },
  });
}

export async function markNotificationAsRead(id: string) {
  "use server";

  await ensureAdminSession();

  await prisma.notification.updateMany({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      isRead: true,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
}

export async function markAllNotificationsAsRead() {
  "use server";

  await ensureAdminSession();

  await prisma.notification.updateMany({
    where: {
      isRead: false,
      deletedAt: null,
    },
    data: {
      isRead: true,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
}

export async function deleteNotification(id: string) {
  "use server";

  await ensureAdminSession();

  await prisma.notification.updateMany({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
}
