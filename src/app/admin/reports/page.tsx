import type { Metadata } from "next";

import {
  getReportsForAdmin,
  type ReportStatusFilter,
  type ReportTypeFilter,
} from "@/actions/reportActions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { ReportFilters } from "@/components/admin/ReportFilters";
import { ReportList } from "@/components/admin/ReportList";
import { parsePageParam } from "@/utils/pagination";

export const metadata: Metadata = {
  title: "Sikayetler | bunediyola Admin",
};

type AdminReportsPageProps = {
  searchParams: Promise<{
    status?: string | string[];
    type?: string | string[];
    page?: string | string[];
  }>;
};

function parseStatusFilter(value: string | string[] | undefined): ReportStatusFilter {
  const status = Array.isArray(value) ? value[0] : value;

  if (
    status === "pending" ||
    status === "reviewed" ||
    status === "dismissed" ||
    status === "action_taken"
  ) {
    return status;
  }

  return "all";
}

function parseTypeFilter(value: string | string[] | undefined): ReportTypeFilter {
  const type = Array.isArray(value) ? value[0] : value;

  if (type === "post" || type === "comment") {
    return type;
  }

  return "all";
}

export default async function AdminReportsPage({ searchParams }: AdminReportsPageProps) {
  const params = await searchParams;
  const activeStatus = parseStatusFilter(params.status);
  const activeType = parseTypeFilter(params.type);
  const { reports, pagination } = await getReportsForAdmin({
    status: activeStatus,
    type: activeType,
    page: parsePageParam(params.page),
  });

  return (
    <>
      <AdminHeader
        title="Sikayetler"
        description="Kullanicilarin bildirdigi yazi ve yorumlari inceleyip durumlarini yonet."
      />

      <ReportFilters activeStatus={activeStatus} activeType={activeType} />
      <ReportList reports={reports} />
      <AdminPagination
        basePath="/admin/reports"
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
        itemLabel="sikayet"
        query={{
          status: activeStatus === "all" ? undefined : activeStatus,
          type: activeType === "all" ? undefined : activeType,
        }}
        showWhenSinglePage
      />
    </>
  );
}
