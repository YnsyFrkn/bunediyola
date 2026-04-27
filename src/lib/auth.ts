import { UserRole } from "@prisma/client";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

import authConfig from "@/lib/auth.config";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/validations/loginSchema";

const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_LOGIN_ATTEMPTS = 5;

class LoginRateLimitedError extends CredentialsSignin {
  code = "login_rate_limited";
}

function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return request.headers.get("x-real-ip");
}

async function recordLoginAttempt({
  email,
  success,
  reason,
  request,
}: {
  email: string;
  success: boolean;
  reason: string;
  request: Request;
}) {
  await prisma.loginAttempt.create({
    data: {
      email,
      success,
      reason,
      ipAddress: getRequestIp(request),
      userAgent: request.headers.get("user-agent"),
    },
  });
}

async function hasTooManyFailedAttempts(email: string) {
  const windowStart = new Date(Date.now() - LOGIN_ATTEMPT_WINDOW_MS);
  const failedAttemptCount = await prisma.loginAttempt.count({
    where: {
      email,
      success: false,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  return failedAttemptCount >= MAX_FAILED_LOGIN_ATTEMPTS;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Sifre", type: "password" },
      },
      async authorize(credentials, request) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const loginType = parsedCredentials.data.loginType;

        if (await hasTooManyFailedAttempts(email)) {
          await recordLoginAttempt({
            email,
            success: false,
            reason: "RATE_LIMITED",
            request,
          });
          throw new LoginRateLimitedError();
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        const isAllowedForLoginType =
          user && (loginType === "user" || user.role === UserRole.ADMIN);

        if (!user || !isAllowedForLoginType) {
          await recordLoginAttempt({
            email,
            success: false,
            reason: user ? "NOT_ALLOWED_FOR_LOGIN_TYPE" : "UNKNOWN_EMAIL",
            request,
          });
          return null;
        }

        const passwordsMatch = await verifyPassword(password, user.passwordHash);

        if (!passwordsMatch) {
          await recordLoginAttempt({
            email,
            success: false,
            reason: "INVALID_PASSWORD",
            request,
          });
          return null;
        }

        await recordLoginAttempt({
          email,
          success: true,
          reason: "SUCCESS",
          request,
        });

        return {
          id: user.id,
          name: user.name ?? "Admin",
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.role = (token.role as UserRole | undefined) ?? UserRole.USER;
      }

      return session;
    },
  },
});

export async function ensureAdminSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/");
  }

  return session;
}
