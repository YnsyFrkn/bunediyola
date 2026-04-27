"use server";

import { AuthError } from "next-auth";

import { type FormState } from "@/actions/formState";
import { signIn, signOut } from "@/lib/auth";
import { parseLoginInput } from "@/validations/loginSchema";

function getSafeRedirectTo(value?: string) {
  if (!value) {
    return "/admin";
  }

  try {
    const url = new URL(value, "http://localhost:3000");
    const relativeUrl = `${url.pathname}${url.search}${url.hash}`;

    if (relativeUrl.startsWith("/admin")) {
      return relativeUrl;
    }
  } catch {
    return "/admin";
  }

  return "/admin";
}

export async function authenticate(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseLoginInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      loginType: "admin",
      redirectTo: getSafeRedirectTo(parsed.data.redirectTo),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Email veya sifre hatali.",
        values: {
          email: parsed.data.email,
        },
      };
    }

    throw error;
  }

  return {
    success: true,
    message: "",
  };
}

export async function logout() {
  await signOut({
    redirectTo: "/login",
  });
}
