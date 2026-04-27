import { ReportReason, ReportStatus, ReportType } from "@prisma/client";
import { z } from "zod";

export const reportReasonLabels: Record<ReportReason, string> = {
  SPAM: "Spam",
  HARASSMENT: "Hakaret / taciz",
  HATE_SPEECH: "Nefret soylemi",
  MISINFORMATION: "Yanlis bilgi",
  INAPPROPRIATE: "Uygunsuz icerik",
  OTHER: "Diger",
};

export const reportStatusLabels: Record<ReportStatus, string> = {
  PENDING: "Beklemede",
  REVIEWED: "Incelendi",
  DISMISSED: "Reddedildi",
  ACTION_TAKEN: "Islem yapildi",
};

export const reportTypeLabels: Record<ReportType, string> = {
  POST: "Yazi",
  COMMENT: "Yorum",
};

export const reportSchema = z.object({
  reason: z.nativeEnum(ReportReason, {
    message: "Lutfen bir sikayet sebebi sec.",
  }),
  detail: z.string().trim().max(500, "Aciklama en fazla 500 karakter olabilir.").optional(),
});

export function parseReportInput(formData: FormData) {
  const rawInput = {
    reason: String(formData.get("reason") ?? ""),
    detail: String(formData.get("detail") ?? ""),
  };

  const result = reportSchema.safeParse(rawInput);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
      values: rawInput,
    };
  }

  return {
    success: true as const,
    data: {
      reason: result.data.reason,
      detail: result.data.detail || null,
    },
  };
}
