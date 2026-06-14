import { NotificationType, Prisma, UserRole } from "@prisma/client";

import { createNotification } from "@/actions/notificationActions";
import { sendWelcomeEmail } from "@/lib/mail";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export async function createUserAccount({ name, email, password }: RegisterUserInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      success: false as const,
      code: "EMAIL_EXISTS",
      message: "Bu email adresi zaten kayitli.",
    };
  }

  const passwordHash = await hashPassword(password);
  let user: {
    id: string;
    name: string | null;
    email: string;
  };

  try {
    user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: UserRole.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false as const,
        code: "EMAIL_EXISTS",
        message: "Bu email adresi zaten kayitli.",
      };
    }

    throw error;
  }

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
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    await sendWelcomeEmail({
      to: user.email,
      name: user.name,
      loginUrl: `${appUrl}/giris`,
    });
  } catch (error) {
    console.error("Hos geldin emaili gonderilemedi", error);
  }

  return {
    success: true as const,
    user,
  };
}
