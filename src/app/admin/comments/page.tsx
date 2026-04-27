import type { Metadata } from "next";

import { getAdminCommentsPage } from "@/actions/commentActions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTable } from "@/components/admin/AdminTable";
import { CommentAdminActions } from "@/components/admin/CommentAdminActions";
import { CommentStatusBadge } from "@/components/admin/CommentStatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { formatDate } from "@/utils/formatDate";

export const metadata: Metadata = {
  title: "Yorumlar | bunediyola Admin",
};

type AdminCommentsPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

function getPreview(content: string) {
  if (content.length <= 140) {
    return content;
  }

  return `${content.slice(0, 140)}...`;
}

function parsePage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

export default async function AdminCommentsPage({ searchParams }: AdminCommentsPageProps) {
  const page = parsePage((await searchParams).page);
  const { comments, pagination } = await getAdminCommentsPage(page);

  return (
    <>
      <AdminHeader
        title="Yorumlar"
        description="Okur yorumlarini gor, public alandan gizle veya tekrar gorunur hale getir."
      />

      {comments.length === 0 ? (
        <EmptyState
          title="Henuz yorum bulunmuyor"
          description="Yazilara yorum geldikce bu alanda listelenecek."
        />
      ) : (
        <section className="space-y-4">
          <AdminTable
            columns={[
              { key: "content", title: "Yorum" },
              { key: "user", title: "Kullanici" },
              { key: "post", title: "Yazi" },
              { key: "status", title: "Durum" },
              { key: "createdAt", title: "Tarih" },
              { key: "actions", title: "Islem" },
            ]}
            rows={comments.map((comment) => ({
              id: comment.id,
              cells: {
                content: (
                  <p className="max-w-xl whitespace-pre-wrap text-sm leading-7 text-[#374151]">
                    {getPreview(comment.content)}
                  </p>
                ),
                user: (
                  <div>
                    <p className="font-semibold text-[#111827]">
                      {comment.user.name ?? "Kullanici"}
                    </p>
                    <p className="text-xs text-[#6b7280]">{comment.user.email}</p>
                  </div>
                ),
                post: comment.post.title,
                status: <CommentStatusBadge status={comment.status} deletedAt={comment.deletedAt} />,
                createdAt: formatDate(comment.createdAt.toISOString()),
                actions: <CommentAdminActions comment={comment} />,
              },
            }))}
          />

          <AdminPagination
            basePath="/admin/comments"
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            itemLabel="yorum"
          />
        </section>
      )}
    </>
  );
}
