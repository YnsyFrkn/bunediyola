import Link from "next/link";

import type { AdminReportRecord } from "@/actions/reportActions";
import { ReportAdminActions } from "@/components/admin/ReportAdminActions";
import { ReportReasonBadge, ReportStatusBadge, ReportTypeBadge } from "@/components/admin/ReportBadges";
import { EmptyState } from "@/components/admin/EmptyState";
import { formatDate } from "@/utils/formatDate";

function getPreview(content: string | null | undefined) {
  if (!content) {
    return "-";
  }

  if (content.length <= 160) {
    return content;
  }

  return `${content.slice(0, 160)}...`;
}

function getTargetUrl(report: AdminReportRecord) {
  if (report.comment?.post.slug) {
    return `/yazi/${report.comment.post.slug}`;
  }

  if (report.post?.slug) {
    return `/yazi/${report.post.slug}`;
  }

  return null;
}

export function ReportList({ reports }: { reports: AdminReportRecord[] }) {
  if (reports.length === 0) {
    return (
      <EmptyState
        title="Henuz sikayet yok"
        description="Kullanicilarin bildirdigi icerikler burada gorunecek."
      />
    );
  }

  return (
    <section className="grid gap-4">
      {reports.map((report) => {
        const targetUrl = getTargetUrl(report);

        return (
          <article key={report.id} className="rounded-[28px] border border-[#f1e6dd] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <ReportTypeBadge type={report.type} />
                  <ReportReasonBadge reason={report.reason} />
                  <ReportStatusBadge status={report.status} />
                  <span className="text-sm text-[#6b7280]">{formatDate(report.createdAt.toISOString())}</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-[#111827]">
                    {report.type === "POST"
                      ? report.post?.title ?? "Yazi bulunamadi"
                      : report.post?.title ?? "Yorumun yazisi bulunamadi"}
                  </h2>
                  {report.type === "COMMENT" ? (
                    <p className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-[#374151]">
                      {getPreview(report.comment?.content)}
                    </p>
                  ) : null}
                  {report.detail ? (
                    <p className="max-w-3xl rounded-2xl bg-[#fff7ed] p-4 text-sm leading-7 text-[#4b5563]">
                      {report.detail}
                    </p>
                  ) : null}
                </div>

                <div className="text-sm leading-7 text-[#6b7280]">
                  <p>
                    Sikayet eden: <span className="font-semibold text-[#374151]">{report.reporter.name ?? "Kullanici"}</span>
                  </p>
                  <p>{report.reporter.email}</p>
                  {report.reviewedAt ? <p>Incelenme: {formatDate(report.reviewedAt.toISOString())}</p> : null}
                </div>
              </div>

              <div className="flex max-w-sm flex-wrap gap-3">
                {targetUrl ? (
                  <Link
                    href={targetUrl}
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition hover:border-[#fdba74] hover:text-[#9a3412]"
                  >
                    Icerigi gor
                  </Link>
                ) : null}
                <ReportAdminActions report={report} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
