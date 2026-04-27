import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Ad soyad bos birakilamaz."),
    email: z
      .string()
      .trim()
      .min(1, "Email bos birakilamaz.")
      .email("Gecerli bir email adresi yazmalisin."),
    password: z.string().min(8, "Sifre en az 8 karakter olmali."),
    passwordConfirm: z.string().min(1, "Sifre tekrari bos birakilamaz."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Sifreler ayni degil.",
    path: ["passwordConfirm"],
  });

export function parseRegisterInput(formData: FormData) {
  const rawInput = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    passwordConfirm: String(formData.get("passwordConfirm") ?? ""),
  };

  const result = registerSchema.safeParse({
    ...rawInput,
    email: rawInput.email.toLowerCase(),
  });

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
      values: {
        name: rawInput.name,
        email: rawInput.email,
      },
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}
