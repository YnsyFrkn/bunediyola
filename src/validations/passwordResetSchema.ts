import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email bos birakilamaz.")
    .email("Gecerli bir email adresi yazmalisin."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, "Sifre sifirlama linki gecersiz."),
    password: z.string().min(8, "Sifre en az 8 karakter olmali."),
    passwordConfirm: z.string().min(1, "Sifre tekrari bos birakilamaz."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Sifreler ayni degil.",
    path: ["passwordConfirm"],
  });

export function parseForgotPasswordInput(formData: FormData) {
  const rawInput = {
    email: String(formData.get("email") ?? ""),
  };

  const result = forgotPasswordSchema.safeParse({
    email: rawInput.email.toLowerCase(),
  });

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
      values: rawInput,
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}

export function parseResetPasswordInput(formData: FormData) {
  const rawInput = {
    token: String(formData.get("token") ?? ""),
    password: String(formData.get("password") ?? ""),
    passwordConfirm: String(formData.get("passwordConfirm") ?? ""),
  };

  const result = resetPasswordSchema.safeParse(rawInput);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}
