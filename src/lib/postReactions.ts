import { PostReactionType } from "@prisma/client";

export const reactionTypes = [
  PostReactionType.BUNE_YA,
  PostReactionType.HARBI_MI,
  PostReactionType.YOK_ARTIK,
  PostReactionType.IYIYMIS,
  PostReactionType.BOS_YAPMIS,
  PostReactionType.KATILIYORUM,
] as const;

export type ReactionCounts = Record<PostReactionType, number>;

export type PostReactionState = {
  selectedType: PostReactionType | null;
  counts: ReactionCounts;
  message?: string;
};

export function createEmptyReactionCounts(): ReactionCounts {
  return {
    BUNE_YA: 0,
    HARBI_MI: 0,
    YOK_ARTIK: 0,
    IYIYMIS: 0,
    BOS_YAPMIS: 0,
    KATILIYORUM: 0,
  };
}
