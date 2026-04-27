import type { Metadata } from "next";

import {
  getAdminNotifications,
  markAllNotificationsAsRead,
  type NotificationFilter,
} from "@/actions/notificationActions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { NotificationFilters } from "@/components/admin/NotificationFilters";
import { NotificationList } from "@/components/admin/NotificationList";
import { NotificationPagination } from "@/components/admin/NotificationPagination";

export const metadata: Metadata = {
  title: "Bildirimler | bunediyola Admin",
};

type AdminNotificationsPageProps = {
  searchParams: Promise<{
    filter?: string | string[];
    page?: string | string[];
  }>;
};

function parseFilter(value: string | string[] | undefined): NotificationFilter {
  const filter = Array.isArray(value) ? value[0] : value;

  if (filter === "read" || filter === "unread") {
    return filter;
  }

  return "all";
}

function parsePage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

export default async function AdminNotificationsPage({
  searchParams,
}: AdminNotificationsPageProps) {
  const params = await searchParams;
  const activeFilter = parseFilter(params.filter);
  const page = parsePage(params.page);
  const { notifications, pagination } = await getAdminNotifications(activeFilter, page);
  const hasUnread = notifications.some((notification) => !notification.isRead);

  return (
    <>
      <AdminHeader
        title="Bildirimler"
        description="Yeni yorumlari ve kullanici hareketlerini tek yerden takip edebilirsin."
        actions={
          hasUnread ? (
            <AdminActionForm
              action={markAllNotificationsAsRead}
              label="Tumunu okundu yap"
              variant="success"
            />
          ) : null
        }
      />

      <NotificationFilters activeFilter={activeFilter} />
      <NotificationList notifications={notifications} />
      <NotificationPagination
        activeFilter={activeFilter}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
      />
    </>
  );
}
