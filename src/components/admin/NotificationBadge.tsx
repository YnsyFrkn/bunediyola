import Link from "next/link";

import { getUnreadNotificationCount } from "@/actions/notificationActions";

export async function NotificationBadge() {
  const count = await getUnreadNotificationCount();

  return (
    <Link
      href="/admin/notifications"
      className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#fdba74] bg-[#fff7ed] px-5 py-3 text-sm font-semibold text-[#9a3412] transition hover:border-[#fb923c] hover:bg-white"
    >
      Bildirimler{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
