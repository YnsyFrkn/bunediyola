import type { AdminNotificationRecord } from "@/actions/notificationActions";
import { EmptyState } from "@/components/admin/EmptyState";
import { NotificationItem } from "@/components/admin/NotificationItem";

type NotificationListProps = {
  notifications: AdminNotificationRecord[];
};

export function NotificationList({ notifications }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <EmptyState
        title="Henuz bildirim yok"
        description="Yeni yorumlar ve kullanici hareketleri burada gorunecek."
      />
    );
  }

  return (
    <section className="grid gap-4">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </section>
  );
}
