import { z } from "zod";

const pollSchema = z.object({
  question: z.string().trim().min(5, "Anket sorusu en az 5 karakter olmali.").max(180),
  postId: z.string().trim().min(1, "Bir yazi secmelisin."),
  options: z
    .array(z.string().trim().min(1).max(120))
    .min(2, "En az 2 secenek yazmalisin.")
    .max(6, "En fazla 6 secenek ekleyebilirsin."),
});

export function parsePollInput(formData: FormData) {
  const rawQuestion = String(formData.get("question") ?? "");
  const rawPostId = String(formData.get("postId") ?? "");
  const rawOptions = String(formData.get("options") ?? "");
  const options = rawOptions
    .split(/\r?\n/)
    .map((option) => option.trim())
    .filter(Boolean);
  const result = pollSchema.safeParse({
    question: rawQuestion,
    postId: rawPostId,
    options,
  });

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
      values: {
        question: rawQuestion,
        postId: rawPostId,
        options: rawOptions,
      },
    };
  }

  if (new Set(result.data.options.map((option) => option.toLocaleLowerCase("tr-TR"))).size !== result.data.options.length) {
    return {
      success: false as const,
      errors: {
        options: ["Ayni secenegi birden fazla kez ekleyemezsin."],
      },
      values: {
        question: rawQuestion,
        postId: rawPostId,
        options: rawOptions,
      },
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}

export const pollVoteSchema = z.object({
  optionId: z.string().trim().min(1, "Bir secenek secmelisin."),
});
