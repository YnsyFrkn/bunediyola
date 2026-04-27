import "dotenv/config";

import { PrismaClient } from "@prisma/client";

import { hashPassword } from "../src/lib/password";
import { categories } from "../src/data/categories";
import { posts } from "../src/data/posts";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL ve ADMIN_PASSWORD alanlari .env icinde tanimli olmali.");
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
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

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        summary: post.summary,
        content: post.content,
        coverImage: post.image,
        author: post.author,
        status: post.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
        viewCount: post.viewCount,
        categoryId: category.id,
        createdAt: new Date(post.createdAt),
      },
      create: {
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

  const passwordHash = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
