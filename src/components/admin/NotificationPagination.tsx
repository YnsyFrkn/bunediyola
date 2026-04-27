import type { NotificationFilter } from "@/actions/notificationActions";
import { AdminPagination } from "@/components/admin/AdminPagination";

type NotificationPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  activeFilter: NotificationFilter;
};

export function NotificationPagination({
  currentPage,
  totalPages,
  totalCount,
  activeFilter,
}: NotificationPaginationProps) {
  return (
    <AdminPagination
      basePath="/admin/notifications"
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      itemLabel="bildirim"
      query={{
        filter: activeFilter === "all" ? undefined : activeFilter,
      }}
      showWhenSinglePage
    />
  );
}
