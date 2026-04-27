import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getCommentsByUserId } from "@/actions/commentActions";
import { CommentStatusBadge } from "@/components/admin/CommentStatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { auth } from "@/lib/auth";
import { formatDate } from "@/utils/formatDate";
import { paginateItems, parsePageParam } from "@/utils/pagination";

export const metadata: Metadata = {
  title: "Yorumlarim | bunediyola",
  description: "bunediyola hesabina ait yorumlar.",
};

type ProfileCommentsPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

const PROFILE_COMMENTS_PAGE_SIZE = 10;

export default async function ProfileCommentsPage({ searchParams }: ProfileCommentsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/giris?callbackUrl=${encodeURIComponent("/profil/comments")}`);
  }

  const comments = await getCommentsByUserId(session.user.id);
  const { items: paginatedComments, pagination } = paginateItems(
    comments,
    parsePageParam((await searchParams).page),
    PROFILE_COMMENTS_PAGE_SIZE,
  );

  return (
    <section className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
            Profil
          </p>
          <h1 className="font-heading text-5xl text-[#111827] sm:text-6xl">Yorumlarim</h1>
          <p className="max-w-3xl text-lg leading-8 text-[#4b5563]">
            Yazilara yaptigin yorumlari ve durumlarini buradan takip edebilirsin.
          </p>
        </div>

        {comments.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-6 text-center">
            <h2 className="font-heading text-2xl text-[#111827]">Henuz yorum yapmadin</h2>
            <p className="mt-3 text-base leading-7 text-[#4b5563]">
              Begendigin bir yazinin altina ilk yorumunu birakabilirsin.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
            >
              Yazilara Git
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedComments.map((comment) => (
              <article key={comment.id} className="rounded-[28px] border border-[#f1e6dd] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/yazi/${comment.post.slug}`}
                      className="text-sm font-semibold text-[#c2410c] transition hover:text-[#9a3412]"
                    >
                      {comment.post.title}
                    </Link>
                    <p className="mt-2 text-sm text-[#6b7280]">
                      {formatDate(comment.createdAt.toISOString())}
                    </p>
                  </div>
                  <CommentStatusBadge status={comment.status} deletedAt={comment.deletedAt} />
                </div>
                <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-[#374151]">
                  {comment.content}
                </p>
              </article>
            ))}
            <Pagination
              basePath="/profil/comments"
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              itemLabel="yorum"
            />
          </div>
        )}

        <Link
          href="/profil"
          className="inline-flex min-h-11 items-center rounded-full border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#fb923c] hover:text-[#9a3412]"
        >
          Profile Don
        </Link>
    </section>
  );
}
