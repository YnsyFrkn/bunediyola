import { z } from "zod";

import { slugify } from "@/utils/slugify";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Kategori adi bos birakilamaz."),
  slug: z.string().trim().min(1, "Slug bos birakilamaz."),
  description: z.string().trim().optional(),
});

export function parseCategoryInput(formData: FormData) {
  const rawInput = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
  };

  const result = categorySchema.safeParse({
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
