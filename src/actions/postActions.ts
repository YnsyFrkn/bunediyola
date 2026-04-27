"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ensureAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createMockPost,
  getMockPostById,
  getMockPostBySlug,
  getMockPosts,
  restoreMockPost,
  softDeleteMockPost,
  type PostRecord,
  updateMockPost,
} from "@/lib/mockDb";
import { parsePostInput } from "@/validations/postSchema";
import type { FormState } from "@/actions/formState";

type GetPostsOptions = {
  includeDeleted?: boolean;
  onlyDeleted?: boolean;
};

type GetPostOptions = {
  includeDeleted?: boolean;
};

function getDeletedWhere(options?: GetPostsOptions) {
  if (options?.onlyDeleted) {
    return { not: null };
  }

  if (options?.includeDeleted) {
    return undefined;
  }

  return null;
}

export async function getPosts(options?: GetPostsOptions): Promise<PostRecord[]> {
  if (!process.env.DATABASE_URL) {
    return getMockPosts(options);
  }

  return prisma.post.findMany({
    where: {
      deletedAt: getDeletedWhere(options),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getPostById(id: string, options?: GetPostOptions): Promise<PostRecord | null> {
  if (!process.env.DATABASE_URL) {
    return getMockPostById(id, options);
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!options?.includeDeleted && post?.deletedAt) {
    return null;
  }

  return post;
}

export async function getPostBySlug(
  slug: string,
  options?: GetPostOptions,
): Promise<PostRecord | null> {
  if (!process.env.DATABASE_URL) {
    return getMockPostBySlug(slug, options);
  }

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!options?.includeDeleted && post?.deletedAt) {
    return null;
  }

  return post;
}

export async function getPublishedPosts(): Promise<PostRecord[]> {
  const posts = await getPosts();

  return posts.filter((post: PostRecord) => post.status === "PUBLISHED");
}

export async function createPost(_prevState: FormState, formData: FormData): Promise<FormState> {
  await ensureAdminSession();

  const parsed = parsePostInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const existingPost = await getPostBySlug(parsed.data.slug, { includeDeleted: true });

  if (existingPost) {
    return {
      success: false,
      message: "Bu slug zaten kullaniliyor.",
      errors: {
        slug: ["Bu slug zaten kullaniliyor."],
      },
    };
  }

  let createdPostId: string;

  if (!process.env.DATABASE_URL) {
    createdPostId = createMockPost(parsed.data).id;
  } else {
    const createdPost = await prisma.post.create({
      data: parsed.data,
    });

    createdPostId = createdPost.id;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/arama");
  revalidatePath("/kategori/[slug]", "page");
  revalidatePath("/yazi/[slug]", "page");

  redirect(`/admin/posts/${createdPostId}/edit?saved=${parsed.data.status.toLowerCase()}`);
}

export async function updatePost(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await ensureAdminSession();

  const currentPost = await getPostById(id, { includeDeleted: true });
  const parsed = parsePostInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const existingPost = await getPostBySlug(parsed.data.slug, { includeDeleted: true });

  if (existingPost && existingPost.id !== id) {
    return {
      success: false,
      message: "Bu slug zaten kullaniliyor.",
      errors: {
        slug: ["Bu slug zaten kullaniliyor."],
      },
    };
  }

  if (!process.env.DATABASE_URL) {
    updateMockPost(id, parsed.data);
  } else {
    await prisma.post.update({
      where: { id },
      data: parsed.data,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}/edit`);
  revalidatePath("/");
  revalidatePath("/arama");
  revalidatePath("/kategori/[slug]", "page");
  revalidatePath("/yazi/[slug]", "page");

  if (currentPost) {
    revalidatePath(`/yazi/${currentPost.slug}`);
  }

  revalidatePath(`/yazi/${parsed.data.slug}`);

  return {
    success: true,
    message: "Yazi bilgileri guncellendi.",
  };
}

export async function deletePost(id: string) {
  await ensureAdminSession();

  const post = await getPostById(id, { includeDeleted: true });

  if (!post) {
    redirect("/admin/posts?message=post-not-found");
  }

  if (!process.env.DATABASE_URL) {
    softDeleteMockPost(id);
  } else {
    await prisma.post.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath(`/yazi/${post.slug}`);
  revalidatePath("/arama");
  revalidatePath("/kategori/[slug]", "page");
  revalidatePath("/yazi/[slug]", "page");

  redirect(`/admin/posts?message=post-deleted&undo=${id}`);
}

export async function restorePost(id: string) {
  await ensureAdminSession();

  const post = await getPostById(id, { includeDeleted: true });

  if (!post) {
    redirect("/admin/posts?view=deleted&message=post-not-found");
  }

  if (!process.env.DATABASE_URL) {
    restoreMockPost(id);
  } else {
    await prisma.post.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath(`/yazi/${post.slug}`);
  revalidatePath("/arama");
  revalidatePath("/kategori/[slug]", "page");
  revalidatePath("/yazi/[slug]", "page");

  redirect("/admin/posts?message=post-restored");
}
