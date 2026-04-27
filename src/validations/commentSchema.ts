import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Yorum bos birakilamaz.")
    .min(3, "Yorum en az 3 karakter olmali.")
    .max(1000, "Yorum en fazla 1000 karakter olabilir."),
});

export function parseCommentInput(formData: FormData) {
  const rawInput = {
    content: String(formData.get("content") ?? ""),
  };

  const result = commentSchema.safeParse(rawInput);

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
