import Link from "next/link";

import {
  deleteNotification,
  markNotificationAsRead,
  type AdminNotificationRecord,
} from "@/actions/notificationActions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { formatDate } from "@/utils/formatDate";
import { formatRelativeDate } from "@/utils/formatRelativeDate";

type NotificationItemProps = {
  notification: AdminNotificationRecord;
};

function getTypeLabel(type: AdminNotificationRecord["type"]) {
  const labels = {
    NEW_COMMENT: "Yorum",
    NEW_USER: "Kullanici",
    SYSTEM: "Sistem",
    REPORT_CREATED: "Sikayet",
    SYSTEM_ALERT: "Sistem Uyarisi",
    ERROR: "Hata",
  };

  return labels[type];
}

function getTargetLabel(type: AdminNotificationRecord["type"]) {
  const labels = {
    NEW_COMMENT: "Yazida gor",
    NEW_USER: "Detaya git",
    SYSTEM: "Detaya git",
    REPORT_CREATED: "Sikayeti incele",
    SYSTEM_ALERT: "Uyariyi incele",
    ERROR: "Hatayi incele",
  };

  return labels[type];
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <article
      className={`rounded-[28px] border p-5 shadow-sm ${
        notification.isRead
          ? "border-[#f1e6dd] bg-white"
          : "border-[#fdba74] bg-[#fff7ed]"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#111827] px-3 py-1 text-xs font-semibold text-white">
              {getTypeLabel(notification.type)}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                notification.isRead
                  ? "bg-[#f3f4f6] text-[#4b5563]"
                  : "bg-[#ffedd5] text-[#9a3412]"
              }`}
            >
              {notification.isRead ? "Okundu" : "Okunmamis"}
            </span>
            <span className="text-sm text-[#6b7280]">
              {formatRelativeDate(notification.createdAt)} - {formatDate(notification.createdAt.toISOString())}
            </span>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-[#111827]">{notification.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[#4b5563]">
              {notification.message}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {notification.targetUrl ? (
            <Link
              href={notification.targetUrl}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition hover:border-[#fdba74] hover:text-[#9a3412]"
            >
              {getTargetLabel(notification.type)}
            </Link>
          ) : null}
          {notification.type === "NEW_COMMENT" ? (
            <Link
              href="/admin/comments"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition hover:border-[#fdba74] hover:text-[#9a3412]"
            >
              Yorumlari yonet
            </Link>
          ) : null}
          {!notification.isRead ? (
            <AdminActionForm
              action={markNotificationAsRead.bind(null, notification.id)}
              label="Okundu yap"
              variant="success"
            />
          ) : null}
          <AdminActionForm
            action={deleteNotification.bind(null, notification.id)}
            label="Sil"
            variant="danger"
            confirmMessage="Bu bildirimi gizlemek istedigine emin misin?"
          />
        </div>
      </div>
    </article>
  );
}
