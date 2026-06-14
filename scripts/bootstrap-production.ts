import { PrismaClient } from "@prisma/client";

import { categories } from "../src/data/categories";
import { posts } from "../src/data/posts";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function seedContentIfEmpty() {
  const [categoryCount, postCount] = await Promise.all([
    prisma.category.count(),
    prisma.post.count(),
  ]);

  if (categoryCount > 0 || postCount > 0) {
    return;
  }

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });
  }

  const dbCategories = await prisma.category.findMany();
  const categoryBySlug = new Map(dbCategories.map((category) => [category.slug, category]));

  for (const post of posts) {
    const category = categoryBySlug.get(post.categorySlug);

    if (!category) {
      continue;
    }

    await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        coverImage: post.image,
        author: post.author,
        status: post.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
        viewCount: post.viewCount,
        categoryId: category.id,
        createdAt: new Date(post.createdAt),
      },
    });
  }
}

async function seedAdminIfConfigured() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    return;
  }

  const passwordHash = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
  });
}

async function main() {
  await seedContentIfEmpty();
  await seedAdminIfConfigured();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
