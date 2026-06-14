"use server";

import crypto from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { FormState } from "@/actions/formState";
import { sendPasswordResetEmail } from "@/lib/mail";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import {
  parseForgotPasswordInput,
  parseResetPasswordInput,
} from "@/validations/passwordResetSchema";

const RESET_TOKEN_EXPIRES_IN_MS = 30 * 60 * 1000;
const RESET_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RESET_MAX_REQUESTS_PER_EMAIL = 3;
const RESET_MAX_REQUESTS_PER_IP = 5;
const RESET_REQUEST_LOG_RETENTION_MS = 24 * 60 * 60 * 1000;

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
}

function createResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function getRequestIp() {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return headersList.get("x-real-ip")?.trim() || "unknown";
}

async function cleanupPasswordResetData() {
  const now = new Date();
  const requestRetentionDate = new Date(Date.now() - RESET_REQUEST_LOG_RETENTION_MS);

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    }),
    prisma.passwordResetRequest.deleteMany({
      where: {
        createdAt: {
          lt: requestRetentionDate,
        },
      },
    }),
  ]);
}

async function isPasswordResetRateLimited(email: string, ipAddress: string) {
  const windowStart = new Date(Date.now() - RESET_RATE_LIMIT_WINDOW_MS);

  const [emailCount, ipCount] = await prisma.$transaction([
    prisma.passwordResetRequest.count({
      where: {
        email,
        createdAt: {
          gte: windowStart,
        },
      },
    }),
    prisma.passwordResetRequest.count({
      where: {
        ipAddress,
        createdAt: {
          gte: windowStart,
        },
      },
    }),
  ]);

  return emailCount >= RESET_MAX_REQUESTS_PER_EMAIL || ipCount >= RESET_MAX_REQUESTS_PER_IP;
}

export async function requestPasswordReset(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseForgotPasswordInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const successResponse = {
    success: true,
    message: "Eger email kayitliysa sifre sifirlama linki gonderildi.",
  };

  await cleanupPasswordResetData();

  const ipAddress = await getRequestIp();
  const isRateLimited = await isPasswordResetRateLimited(parsed.data.email, ipAddress);

  if (isRateLimited) {
    return {
      success: false,
      message: "Cok fazla sifre sifirlama istegi alindi. Lutfen 15 dakika sonra tekrar dene.",
      values: {
        email: parsed.data.email,
      },
    };
  }

  await prisma.passwordResetRequest.create({
    data: {
      email: parsed.data.email,
      ipAddress,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
    select: {
      email: true,
    },
  });

  if (!user) {
    return successResponse;
  }

  const token = createResetToken();
  const tokenHash = hashResetToken(token);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN_MS);

  await prisma.passwordResetToken.updateMany({
    where: {
      email: user.email,
      expiresAt: {
        gt: new Date(),
      },
    },
    data: {
      expiresAt: new Date(),
    },
  });

  await prisma.passwordResetToken.create({
    data: {
      email: user.email,
      tokenHash,
      ipAddress,
      expiresAt,
    },
  });

  const resetUrl = `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`;

  try {
    await sendPasswordResetEmail({
      to: user.email,
      resetUrl,
    });
  } catch (error) {
    console.error("Sifre sifirlama emaili gonderilemedi", error);

    await prisma.passwordResetToken.deleteMany({
      where: {
        tokenHash,
      },
    });

    return {
      success: false,
      message: "Sifre sifirlama emaili gonderilemedi. Lutfen daha sonra tekrar dene.",
      values: {
        email: parsed.data.email,
      },
    };
  }

  return successResponse;
}

export async function resetPassword(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseResetPasswordInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
    };
  }

  await cleanupPasswordResetData();

  const tokenHash = hashResetToken(parsed.data.token);
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    if (resetToken) {
      await prisma.passwordResetToken.delete({
        where: {
          id: resetToken.id,
        },
      });
    }

    return {
      success: false,
      message: "Sifre sifirlama linki gecersiz veya suresi dolmus.",
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.update({
    where: {
      email: resetToken.email,
    },
    data: {
      passwordHash,
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: resetToken.id,
    },
  });

  redirect("/giris?reset=1");
}
