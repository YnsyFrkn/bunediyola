import { randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/utils/slugify";

export type PublicTag = {
  name: string;
  slug: string;
};

type PostTagRow = {
  postId: string;
  name: string;
  slug: string;
};

type TagIdRow = {
  id: string;
};

export type TrendingTag = PublicTag & {
  postCount: number;
};

type TrendingTagRow = {
  name: string;
  slug: string;
  postCount: bigint | number;
};

export function parseTagNames(value: string) {
  const seenSlugs = new Set<string>();

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      slug: slugify(name),
    }))
    .filter((tag) => {
      if (!tag.slug || seenSlugs.has(tag.slug)) {
        return false;
      }

      seenSlugs.add(tag.slug);
      return true;
    })
    .slice(0, 8);
}

export async function getTagNamesForPost(postId: string) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const rows = await prisma.$queryRaw<PublicTag[]>`
    SELECT t."name", t."slug"
    FROM "PostTag" pt
    INNER JOIN "Tag" t ON t."id" = pt."tagId"
    WHERE pt."postId" = ${postId}
    ORDER BY t."name" ASC
  `;

  return rows;
}

export async function getTagNamesByPostIds(postIds: string[]) {
  const tagMap = new Map<string, PublicTag[]>();

  if (!process.env.DATABASE_URL || postIds.length === 0) {
    return tagMap;
  }

  const rows = await prisma.$queryRaw<PostTagRow[]>`
    SELECT pt."postId", t."name", t."slug"
    FROM "PostTag" pt
    INNER JOIN "Tag" t ON t."id" = pt."tagId"
    WHERE pt."postId" IN (${Prisma.join(postIds)})
    ORDER BY t."name" ASC
  `;

  rows.forEach((row) => {
    const tags = tagMap.get(row.postId) ?? [];
    tags.push({
      name: row.name,
      slug: row.slug,
    });
    tagMap.set(row.postId, tags);
  });

  return tagMap;
}

export async function getTrendingTags(limit = 10): Promise<TrendingTag[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const rows = await prisma.$queryRaw<TrendingTagRow[]>`
    SELECT
      t."name",
      t."slug",
      COUNT(pt."postId") AS "postCount"
    FROM "Tag" t
    INNER JOIN "PostTag" pt ON pt."tagId" = t."id"
    INNER JOIN "Post" p ON p."id" = pt."postId"
    WHERE p."status" = 'PUBLISHED'
      AND p."deletedAt" IS NULL
    GROUP BY t."id", t."name", t."slug"
    ORDER BY COUNT(pt."postId") DESC, MAX(p."createdAt") DESC, t."name" ASC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    name: row.name,
    slug: row.slug,
    postCount: Number(row.postCount),
  }));
}

export async function syncPostTags(postId: string, tagNames: string[]) {
  if (!process.env.DATABASE_URL) {
    return;
  }

  const tags = tagNames
    .map((name) => ({
      name,
      slug: slugify(name),
    }))
    .filter((tag) => tag.slug);

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      DELETE FROM "PostTag"
      WHERE "postId" = ${postId}
    `;

    for (const tag of tags) {
      const [savedTag] = await tx.$queryRaw<TagIdRow[]>`
        INSERT INTO "Tag" ("id", "name", "slug", "updatedAt")
        VALUES (${randomUUID()}, ${tag.name}, ${tag.slug}, NOW())
        ON CONFLICT ("slug") DO UPDATE
        SET "name" = EXCLUDED."name",
            "updatedAt" = NOW()
        RETURNING "id"
      `;

      if (savedTag) {
        await tx.$executeRaw`
          INSERT INTO "PostTag" ("postId", "tagId")
          VALUES (${postId}, ${savedTag.id})
          ON CONFLICT ("postId", "tagId") DO NOTHING
        `;
      }
    }
  });
}
