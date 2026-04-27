import Link from "next/link";

import { deleteCategory, getCategories, restoreCategory } from "@/actions/categoryActions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTable } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/Button";

type AdminCategoriesPageProps = {
  searchParams: Promise<{
    view?: string;
    message?: string;
    undo?: string;
    page?: string | string[];
  }>;
};

const ADMIN_CATEGORIES_PAGE_SIZE = 10;

function CategoriesNotice({
  message,
  undo,
}: {
  message?: string;
  undo?: string;
}) {
  if (message === "category-deleted" && undo) {
    return (
      <AdminNotice
        tone="warning"
        title="Kategori silindi"
        description="Kategori aktif listeden kaldirildi. Dilersen hemen geri alarak tekrar kullanabilirsin."
        action={<AdminActionForm action={restoreCategory.bind(null, undo)} label="Geri Al" variant="success" />}
      />
    );
  }

  if (message === "category-restored") {
    return (
      <AdminNotice
        tone="success"
        title="Kategori geri alindi"
        description="Silinen kategori tekrar aktif listeye tasindi ve yazilarda yeniden secilebilir hale geldi."
      />
    );
  }

  if (message === "category-has-posts") {
    return (
      <AdminNotice
        tone="error"
        title="Kategori silinemedi"
        description="Bu kategoriye bagli aktif yazilar oldugu icin once o yazilari tasimali ya da silmelisin."
      />
    );
  }

  if (message === "category-not-found") {
    return (
      <AdminNotice
        tone="error"
        title="Kategori bulunamadi"
        description="Secilen kategoriye ulasilamadi. Listeyi yenileyip tekrar deneyebilirsin."
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

export default async function AdminCategoriesPage({ searchParams }: AdminCategoriesPageProps) {
  const { view, message, undo, page: pageParam } = await searchParams;
  const categories = await getCategories({ includeDeleted: true });
  const activeCategories = categories.filter((category) => !category.deletedAt);
  const deletedCategories = categories.filter((category) => category.deletedAt);
  const isDeletedView = view === "deleted";
  const visibleCategories = isDeletedView ? deletedCategories : activeCategories;
  const totalPages = Math.max(1, Math.ceil(visibleCategories.length / ADMIN_CATEGORIES_PAGE_SIZE));
  const currentPage = Math.min(parsePage(pageParam), totalPages);
  const paginatedCategories = visibleCategories.slice(
    (currentPage - 1) * ADMIN_CATEGORIES_PAGE_SIZE,
    currentPage * ADMIN_CATEGORIES_PAGE_SIZE,
  );

  if (visibleCategories.length === 0) {
    return (
      <>
        <AdminHeader
          title="Kategoriler"
          description="Yazi yayin akisini duzenlemek icin kategorileri tek yerden yonet."
          actions={<Button href="/admin/categories/create">Kategori Ekle</Button>}
        />
        <CategoriesNotice message={message} undo={undo} />
        <EmptyState
          title={isDeletedView ? "Silinmis kategori yok" : "Henuz hic kategori yok"}
          description={
            isDeletedView
              ? "Silinen kategoriler burada listelenir. Geri almak istediklerini bu alandan tekrar aktif hale getirebilirsin."
              : "Ilk kategorini ekleyerek yazi yonetim altyapisini olusturabilirsin."
          }
          action={<Button href={isDeletedView ? "/admin/categories" : "/admin/categories/create"}>{isDeletedView ? "Aktif Kategorilere Don" : "Kategori Ekle"}</Button>}
        />
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="Kategoriler"
        description="Kategori adini, slug bilgisini ve aciklamasini sade bir tabloda gorup duzenleyebilirsin."
        actions={<Button href="/admin/categories/create">Kategori Ekle</Button>}
      />
      <CategoriesNotice message={message} undo={undo} />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/categories"
          className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
            !isDeletedView
              ? "bg-[#111827] text-white"
              : "border border-[#e7e5e4] bg-white text-[#374151] hover:border-[#fdba74]"
          }`}
        >
          Aktif Kategoriler ({activeCategories.length})
        </Link>
        <Link
          href="/admin/categories?view=deleted"
          className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
            isDeletedView
              ? "bg-[#111827] text-white"
              : "border border-[#e7e5e4] bg-white text-[#374151] hover:border-[#fdba74]"
          }`}
        >
          Silinenler ({deletedCategories.length})
        </Link>
      </div>

      <section className="space-y-4">
        <AdminTable
          columns={[
            { key: "name", title: "Kategori" },
            { key: "slug", title: "Slug" },
            { key: "description", title: "Aciklama" },
            { key: "actions", title: "Islem" },
          ]}
          rows={paginatedCategories.map((category) => ({
            id: category.id,
            cells: {
              name: <span className="font-semibold text-[#111827]">{category.name}</span>,
              slug: category.slug,
              description: category.description ?? "-",
              actions: isDeletedView ? (
                <AdminActionForm action={restoreCategory.bind(null, category.id)} label="Geri Al" variant="success" />
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Link href={`/admin/categories/${category.id}/edit`} className="inline-flex min-h-10 items-center font-semibold text-[#c2410c]">
                    Duzenle
                  </Link>
                  <AdminActionForm
                    action={deleteCategory.bind(null, category.id)}
                    label="Sil"
                    variant="danger"
                    confirmMessage="Bu kategoriyi silmek istedigine emin misin? Uygunsa daha sonra geri alabilirsin."
                  />
                </div>
              ),
            },
          }))}
        />

        <AdminPagination
          basePath="/admin/categories"
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={visibleCategories.length}
          itemLabel={isDeletedView ? "silinmis kategori" : "kategori"}
          query={{
            view: isDeletedView ? "deleted" : undefined,
          }}
        />
      </section>
    </>
  );
}
