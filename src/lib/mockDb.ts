import type { Category, Post as PrismaPost, PostStatus } from "@prisma/client";

import { categories as mockCategories } from "@/data/categories";
import { posts as mockPosts } from "@/data/posts";

export type CategoryRecord = Category;

export type PostRecord = PrismaPost & {
  isEditorPick?: boolean;
};

const now = new Date("2026-04-24T12:00:00.000Z");

function buildInitialCategories(): CategoryRecord[] {
  return mockCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  }));
}

function buildInitialPosts(): PostRecord[] {
  return mockPosts.map((post) => {
    const category = mockCategories.find((item) => item.slug === post.categorySlug);

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      coverImage: post.image,
      author: post.author,
      status: post.status ?? "PUBLISHED",
      isEditorPick: post.isFeatured,
      viewCount: post.viewCount,
      categoryId: category?.id ?? "1",
      deletedAt: null,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.createdAt),
    };
  });
}

const mockDatabase = globalThis as typeof globalThis & {
  __bunediyolaMockDb?: {
    categories: CategoryRecord[];
    posts: PostRecord[];
  };
};

if (!mockDatabase.__bunediyolaMockDb) {
  mockDatabase.__bunediyolaMockDb = {
    categories: buildInitialCategories(),
    posts: buildInitialPosts(),
  };
}

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getMockCategories(options?: { includeDeleted?: boolean; onlyDeleted?: boolean }) {
  const categories = [...mockDatabase.__bunediyolaMockDb!.categories];

  if (options?.onlyDeleted) {
    return categories.filter((category) => category.deletedAt);
  }

  if (options?.includeDeleted) {
    return categories;
  }

  return categories.filter((category) => !category.deletedAt);
}

export function getMockCategoryById(id: string, options?: { includeDeleted?: boolean }) {
  const category =
    mockDatabase.__bunediyolaMockDb!.categories.find((item) => item.id === id) ?? null;

  if (!options?.includeDeleted && category?.deletedAt) {
    return null;
  }

  return category;
}

export function getMockCategoryBySlug(slug: string, options?: { includeDeleted?: boolean }) {
  const category =
    mockDatabase.__bunediyolaMockDb!.categories.find((item) => item.slug === slug) ?? null;

  if (!options?.includeDeleted && category?.deletedAt) {
    return null;
  }

  return category;
}

export function createMockCategory(input: {
  name: string;
  slug: string;
  description?: string;
}) {
  const category = {
    id: generateId("cat"),
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockDatabase.__bunediyolaMockDb!.categories.unshift(category);
  return category;
}

export function updateMockCategory(
  id: string,
  input: { name: string; slug: string; description?: string },
) {
  const category = getMockCategoryById(id);

  if (!category) {
    return null;
  }

  category.name = input.name;
  category.slug = input.slug;
  category.description = input.description ?? null;
  category.updatedAt = new Date();

  return category;
}

export function softDeleteMockCategory(id: string) {
  const category = getMockCategoryById(id, { includeDeleted: true });

  if (!category) {
    return null;
  }

  category.deletedAt = new Date();
  category.updatedAt = new Date();

  return category;
}

export function restoreMockCategory(id: string) {
  const category = getMockCategoryById(id, { includeDeleted: true });

  if (!category) {
    return null;
  }

  category.deletedAt = null;
  category.updatedAt = new Date();

  return category;
}

export function getMockPosts(options?: { includeDeleted?: boolean; onlyDeleted?: boolean }) {
  const posts = [...mockDatabase.__bunediyolaMockDb!.posts];

  if (options?.onlyDeleted) {
    return posts.filter((post) => post.deletedAt);
  }

  if (options?.includeDeleted) {
    return posts;
  }

  return posts.filter((post) => !post.deletedAt);
}

export function getMockPostById(id: string, options?: { includeDeleted?: boolean }) {
  const post = mockDatabase.__bunediyolaMockDb!.posts.find((item) => item.id === id) ?? null;

  if (!options?.includeDeleted && post?.deletedAt) {
    return null;
  }

  return post;
}

export function getMockPostBySlug(slug: string, options?: { includeDeleted?: boolean }) {
  const post = mockDatabase.__bunediyolaMockDb!.posts.find((item) => item.slug === slug) ?? null;

  if (!options?.includeDeleted && post?.deletedAt) {
    return null;
  }

  return post;
}

export function createMockPost(input: {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  author?: string;
  status: PostStatus;
  isEditorPick?: boolean;
  categoryId: string;
}) {
  const post: PostRecord = {
    id: generateId("post"),
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    content: input.content,
    coverImage: input.coverImage || null,
    author: input.author || "bunediyola ekibi",
    status: input.status,
    isEditorPick: input.isEditorPick ?? false,
    viewCount: 0,
    categoryId: input.categoryId,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockDatabase.__bunediyolaMockDb!.posts.unshift(post);
  return post;
}

export function updateMockPost(
  id: string,
  input: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    coverImage?: string;
    author?: string;
    status: PostStatus;
    isEditorPick?: boolean;
    categoryId: string;
  },
) {
  const post = getMockPostById(id);

  if (!post) {
    return null;
  }

  post.title = input.title;
  post.slug = input.slug;
  post.summary = input.summary;
  post.content = input.content;
  post.coverImage = input.coverImage || null;
  post.author = input.author || "bunediyola ekibi";
  post.status = input.status;
  post.isEditorPick = input.isEditorPick ?? false;
  post.categoryId = input.categoryId;
  post.updatedAt = new Date();

  return post;
}

export function softDeleteMockPost(id: string) {
  const post = getMockPostById(id, { includeDeleted: true });

  if (!post) {
    return null;
  }

  post.deletedAt = new Date();
  post.updatedAt = new Date();

  return post;
}

export function restoreMockPost(id: string) {
  const post = getMockPostById(id, { includeDeleted: true });

  if (!post) {
    return null;
  }

  post.deletedAt = null;
  post.updatedAt = new Date();

  return post;
}
