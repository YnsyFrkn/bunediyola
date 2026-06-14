import { PostReactionType } from "@prisma/client";
import { z } from "zod";

export const postReactionSchema = z.object({
  type: z.nativeEnum(PostReactionType),
});
