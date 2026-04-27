import Link from "next/link";

import { getCategories } from "@/actions/categoryActions";
import { deletePost, getPosts, restorePost } from "@/actions/postActions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTable } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";

type AdminPostsPageProps = {
  searchParams: Promise<{
    view?: string;
    message?: string;
    undo?: string;
    page?: string | string[];
  }>;
};

const ADMIN_POSTS_PAGE_SIZE = 10;

function PostsNotice({
  message,
  undo,
}: {
  message?: string;
  undo?: string;
}) {
  if (message === "post-deleted" && undo) {
    const restoreAction = restorePost.bind(null, undo);

    return (
      <AdminNotice
        tone="warning"
        title="Yazi silindi"
        description="Yazi listeden kaldirildi. Dilersen hemen geri alarak tekrar aktif hale getirebilirsin."
        action={<AdminActionForm action={restoreAction} label="Geri Al" variant="success" />}
      />
    );
  }

  if (message === "post-restored") {
    return (
      <AdminNotice
        tone="success"
        title="Yazi geri alindi"
        description="Silinen yazi tekrar aktif listeye tasindi ve panelde yeniden duzenlenebilir hale geldi."
      />
    );
  }

  if (message === "post-not-found") {
    return (
      <AdminNotice
        tone="error"
        title="Yazi bulunamadi"
        description="Secilen yaziya ulasilamadi. Listeyi yenileyip tekrar deneyebilirsin."
      />
    );
  }

  return null;
}

function parsePage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

export default async function AdminPostsPage({ searchParams }: AdminPostsPageProps) {
  const { view, message, undo, page: pageParam } = await searchParams;
  const [posts, categories] = await Promise.all([getPosts({ includeDeleted: true }), getCategories()]);
  const activePosts = posts.filter((post) => !post.deletedAt);
  const deletedPosts = posts.filter((post) => post.deletedAt);
  const isDeletedView = view === "deleted";
  const visiblePosts = isDeletedView ? deletedPosts : activePosts;
  const totalPages = Math.max(1, Math.ceil(visiblePosts.length / ADMIN_POSTS_PAGE_SIZE));
  const currentPage = Math.min(parsePage(pageParam), totalPages);
  const paginatedPosts = visiblePosts.slice(
    (currentPage - 1) * ADMIN_POSTS_PAGE_SIZE,
    currentPage * ADMIN_POSTS_PAGE_SIZE,
  );
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));

  if (visiblePosts.length === 0) {
    return (
      <>
        <AdminHeader
          title="Yazilar"
          description="Tum icerikleri listeler, duzenler ve yayin akisini kontrol etmeni saglar."
          actions={<Button href="/admin/posts/create">Yeni Yazi Ekle</Button>}
        />
        <PostsNotice message={message} undo={undo} />
        <EmptyState
          title={isDeletedView ? "Silinmis yazi yok" : "Henuz hic yazi eklenmemis."}
          description={
            isDeletedView
              ? "Silinen yazilar burada listelenecek. Aktif listeye geri almak icin once bir yazi silinmis olmali."
              : "Ilk yazini ekleyerek icerik yonetimine baslayabilirsin."
          }
          action={<Button href={isDeletedView ? "/admin/posts" : "/admin/posts/create"}>{isDeletedView ? "Aktif Yazilara Don" : "Yeni Yazi Ekle"}</Button>}
        />
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="Yazilar"
        description="Baslik, kategori ve yayin durumu bilgileriyle tum icerikleri sade bir tabloda yonet."
        actions={<Button href="/admin/posts/create">Yeni Yazi Ekle</Button>}
      />
      <PostsNotice message={message} undo={undo} />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/posts"
          className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
            !isDeletedView
              ? "bg-[#111827] text-white"
              : "border border-[#e7e5e4] bg-white text-[#374151] hover:border-[#fdba74]"
          }`}
        >
          Aktif Yazilar ({activePosts.length})
        </Link>
        <Link
          href="/admin/posts?view=deleted"
          className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
            isDeletedView
              ? "bg-[#111827] text-white"
              : "border border-[#e7e5e4] bg-white text-[#374151] hover:border-[#fdba74]"
          }`}
        >
          Silinenler ({deletedPosts.length})
        </Link>
      </div>

      <section className="space-y-4">
        <AdminTable
          columns={[
            { key: "title", title: "Baslik" },
            { key: "category", title: "Kategori" },
            { key: "status", title: "Durum" },
            { key: "createdAt", title: isDeletedView ? "Silinme" : "Olusturulma" },
            { key: "actions", title: "Islem" },
          ]}
          rows={paginatedPosts.map((post) => ({
            id: post.id,
            cells: {
              title: (
                <div>
                  <p className="font-semibold text-[#111827]">{post.title}</p>
                  <p className="text-xs text-[#6b7280]">{post.slug}</p>
                </div>
              ),
              category: categoryMap.get(post.categoryId) ?? "Kategori yok",
              status: <AdminStatusBadge status={post.status} />,
              createdAt: formatDate((post.deletedAt ?? post.createdAt).toISOString()),
              actions: isDeletedView ? (
                <AdminActionForm action={restorePost.bind(null, post.id)} label="Geri Al" variant="success" />
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Link href={`/admin/posts/${post.id}/edit`} className="inline-flex min-h-10 items-center font-semibold text-[#c2410c]">
                    Duzenle
                  </Link>
                  <AdminActionForm
                    action={deletePost.bind(null, post.id)}
                    label="Sil"
                    variant="danger"
                    confirmMessage="Bu yaziyi silmek istedigine emin misin? Daha sonra geri alabilirsin."
                  />
                </div>
              ),
            },
          }))}
        />

        <AdminPagination
          basePath="/admin/posts"
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={visiblePosts.length}
          itemLabel={isDeletedView ? "silinmis yazi" : "yazi"}
          query={{
            view: isDeletedView ? "deleted" : undefined,
          }}
        />
      </section>
    </>
  );
}
