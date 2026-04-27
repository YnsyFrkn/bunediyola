"use server";

import { NotificationType, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { type FormState } from "@/actions/formState";
import { createNotification } from "@/actions/notificationActions";
import { sendWelcomeEmail } from "@/lib/mail";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { parseRegisterInput } from "@/validations/registerSchema";

type CreatedUserForRegister = {
  id: string;
  name: string | null;
  email: string;
};

async function createRegisteredUser(formData: FormData): Promise<FormState & { user?: CreatedUserForRegister }> {
  const parsed = parseRegisterInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Bu email adresi zaten kayitli.",
      errors: {
        email: ["Bu email adresi zaten kayitli."],
      },
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
      },
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: UserRole.USER,
    },
  });

  try {
    await createNotification({
      type: NotificationType.NEW_USER,
      title: "Yeni kullanici kaydoldu",
      message: `${user.email} siteye katildi.`,
      dedupeKey: `user:${user.id}`,
    });
  } catch (error) {
    console.error("Admin kullanici bildirimi olusturulamadi", error);
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    await sendWelcomeEmail({
      to: user.email,
      name: user.name,
      loginUrl: `${appUrl}/giris`,
    });
  } catch (error) {
    console.error("Hos geldin emaili gonderilemedi", error);
  }

  return {
    success: true,
    message: "Hesabin olusturuldu.",
    values: {
      name: user.name ?? "",
      email: user.email,
    },
    user,
  };
}

export async function registerUser(_prevState: FormState, formData: FormData): Promise<FormState> {
  const result = await createRegisteredUser(formData);

  if (!result.success) {
    return result;
  }

  redirect("/giris?registered=1");
}

export async function registerUserInline(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await createRegisteredUser(formData);

  return {
    success: result.success,
    message: result.message,
    errors: result.errors,
    values: result.values,
  };
}
