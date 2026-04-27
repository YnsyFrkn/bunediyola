import { z } from "zod";

import { slugify } from "@/utils/slugify";

export const postSchema = z.object({
  title: z.string().trim().min(1, "Baslik bos birakilamaz."),
  slug: z.string().trim().min(1, "Slug bos birakilamaz."),
  summary: z.string().trim().min(1, "Ozet bos birakilamaz."),
  content: z.string().trim().min(1, "Icerik alani bos birakilamaz."),
  coverImage: z.string().trim().optional(),
  author: z.string().trim().min(1, "Yazar adi bos birakilamaz."),
  categoryId: z.string().trim().min(1, "Kategori secmelisin."),
  status: z
    .string()
    .trim()
    .refine((value) => value === "DRAFT" || value === "PUBLISHED", "Yayin durumu secmelisin."),
});

export function parsePostInput(formData: FormData) {
  const rawInput = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    content: String(formData.get("content") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    author: String(formData.get("author") ?? "bunediyola ekibi"),
    categoryId: String(formData.get("categoryId") ?? ""),
    status: String(formData.get("status") ?? ""),
  };

  const result = postSchema.safeParse({
    ...rawInput,
    slug: slugify(rawInput.slug),
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
