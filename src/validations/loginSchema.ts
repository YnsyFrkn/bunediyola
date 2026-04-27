import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email bos birakilamaz.")
    .email("Gecerli bir email girmelisin."),
  password: z.string().min(1, "Sifre bos birakilamaz."),
  loginType: z.enum(["admin", "user"]).default("admin"),
  redirectTo: z.string().trim().optional(),
});

export function parseLoginInput(formData: FormData) {
  const rawInput = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    loginType: String(formData.get("loginType") ?? "admin"),
    redirectTo: String(formData.get("redirectTo") ?? ""),
  };

  const result = loginSchema.safeParse({
    ...rawInput,
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
