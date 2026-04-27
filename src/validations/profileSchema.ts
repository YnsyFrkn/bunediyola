import { z } from "zod";

const currentYear = new Date().getFullYear();

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ad soyad en az 2 karakter olmali.")
    .max(50, "Ad soyad en fazla 50 karakter olmali."),
  city: z.string().trim().max(50, "Sehir en fazla 50 karakter olmali.").optional(),
  district: z.string().trim().max(50, "Ilce en fazla 50 karakter olmali.").optional(),
  birthYear: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^\d{4}$/.test(value), "Dogum yili 4 haneli olmali.")
    .refine((value) => {
      if (!value) {
        return true;
      }

      const year = Number(value);

      return year >= 1900 && year <= currentYear;
    }, "Dogum yili gecersiz gorunuyor."),
  gender: z.enum(["", "FEMALE", "MALE", "NON_BINARY", "PREFER_NOT_TO_SAY"]),
  bio: z.string().trim().max(240, "Hakkinda alani en fazla 240 karakter olmali.").optional(),
});

export function parseProfileInput(formData: FormData) {
  const rawInput = {
    name: String(formData.get("name") ?? ""),
    city: String(formData.get("city") ?? ""),
    district: String(formData.get("district") ?? ""),
    birthYear: String(formData.get("birthYear") ?? ""),
    gender: String(formData.get("gender") ?? ""),
    bio: String(formData.get("bio") ?? ""),
  };

  const result = profileSchema.safeParse(rawInput);

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
      name: result.data.name,
      city: result.data.city || null,
      district: result.data.district || null,
      birthYear: result.data.birthYear ? Number(result.data.birthYear) : null,
      gender: result.data.gender || null,
      bio: result.data.bio || null,
    },
  };
}
