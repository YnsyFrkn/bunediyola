import Link from "next/link";

import { getAdminDashboardStats } from "@/actions/adminDashboardActions";
import { getCategories } from "@/actions/categoryActions";
import { getUnreadNotificationCount } from "@/actions/notificationActions";
import { getPosts } from "@/actions/postActions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MailHealthCheck } from "@/components/admin/MailHealthCheck";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTable } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";

export default async function AdminDashboardPage() {
  const [posts, categories, unreadNotificationCount, dashboardStats] = await Promise.all([
    getPosts(),
    getCategories(),
    getUnreadNotificationCount(),
    getAdminDashboardStats(),
  ]);
  const publishedPosts = posts.filter((post) => post.status === "PUBLISHED");
  const draftPosts = posts.filter((post) => post.status === "DRAFT");
  const recentPosts = posts.slice(0, 5);

  return (
    <>
      <AdminHeader
        title="Panel"
        description="Icerikleri, kategorileri ve yayin akisinin temel durumunu tek ekranda gorebilirsin."
        actions={
          <>
            <Button href="/admin/posts/create">Yeni Yazi Ekle</Button>
            <Button href="/admin/categories/create" variant="secondary">
              Kategori Ekle
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Toplam Yazi" value={String(posts.length)} note="Panelde gorunen tum yazi sayisi." />
        <AdminStatCard label="Yayindaki Yazi" value={String(publishedPosts.length)} note="Site tarafinda yayinda olan icerikler." />
        <AdminStatCard label="Taslak" value={String(draftPosts.length)} note="Henuz yayina alinmamis icerikler." />
        <AdminStatCard label="Kategori" value={String(categories.length)} note="Yazi eklerken kullanabilecegin kategori sayisi." />
        <AdminStatCard
          label="Toplam Kullanici"
          value={String(dashboardStats.totalUsers)}
          note="Siteye kayitli tum kullanici hesaplari."
        />
        <Link href="/admin/comments" className="block">
          <AdminStatCard
            label="Yeni Yorum"
            value={String(dashboardStats.recentCommentCount)}
            note={`Son ${dashboardStats.recentCommentWindowDays} gunde gelen aktif yorumlar.`}
          />
        </Link>
        <Link href="/admin/notifications?filter=unread" className="block">
          <AdminStatCard
            label="Okunmamis Bildirim"
            value={String(unreadNotificationCount)}
            note="Yeni yorum ve kullanici hareketleri."
          />
        </Link>
        <Link href="/admin/reports?status=pending" className="block">
          <AdminStatCard
            label="Bekleyen Sikayet"
            value={String(dashboardStats.pendingReportCount)}
            note="Inceleme bekleyen kullanici bildirimleri."
          />
        </Link>
      </section>

      <MailHealthCheck />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl text-[#111827]">Son eklenen yazilar</h2>
            <p className="mt-2 text-base leading-7 text-[#4b5563]">
              Son olusturulan ya da mock veriyle gelen yazilar burada listelenir.
            </p>
          </div>
          <Link href="/admin/posts" className="text-sm font-semibold text-[#c2410c]">
            Tum yazilari gor
          </Link>
        </div>

        <AdminTable
          columns={[
            { key: "title", title: "Baslik" },
            { key: "status", title: "Durum" },
            { key: "createdAt", title: "Olusturulma" },
            { key: "action", title: "Islem" },
          ]}
          rows={recentPosts.map((post) => ({
            id: post.id,
            cells: {
              title: post.title,
              status: <AdminStatusBadge status={post.status} />,
              createdAt: formatDate(post.createdAt.toISOString()),
              action: (
                <Link href={`/admin/posts/${post.id}/edit`} className="font-semibold text-[#c2410c]">
                  Duzenle
                </Link>
              ),
            },
          }))}
        />
      </section>
    </>
  );
}
