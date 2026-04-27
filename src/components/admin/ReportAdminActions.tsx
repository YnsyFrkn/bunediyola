import { ReportStatus } from "@prisma/client";

import { updateReportStatus, type AdminReportRecord } from "@/actions/reportActions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";

type ReportAdminActionsProps = {
  report: AdminReportRecord;
};

export function ReportAdminActions({ report }: ReportAdminActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {report.status !== ReportStatus.REVIEWED ? (
        <AdminActionForm
          action={updateReportStatus.bind(null, report.id, ReportStatus.REVIEWED)}
          label="Incelendi"
          variant="ghost"
        />
      ) : null}
      {report.status !== ReportStatus.DISMISSED ? (
        <AdminActionForm
          action={updateReportStatus.bind(null, report.id, ReportStatus.DISMISSED)}
          label="Reddet"
          variant="danger"
        />
      ) : null}
      {report.status !== ReportStatus.ACTION_TAKEN ? (
        <AdminActionForm
          action={updateReportStatus.bind(null, report.id, ReportStatus.ACTION_TAKEN)}
          label="Islem Yapildi"
          variant="success"
        />
      ) : null}
    </div>
  );
}
