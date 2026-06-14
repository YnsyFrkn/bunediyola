"use server";

import { revalidatePath } from "next/cache";

import { ensureAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createMockCategory,
  getMockCategories,
  getMockCategoryById,
  getMockCategoryBySlug,
  getMockPosts,
  restoreMockCategory,
  softDeleteMockCategory,
  type CategoryRecord,
  updateMockCategory,
} from "@/lib/mockDb";
import { parseCategoryInput } from "@/validations/categorySchema";
import type { FormState } from "@/actions/formState";
import { redirect } from "next/navigation";

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

type GetCategoriesOptions = {
  includeDeleted?: boolean;
  onlyDeleted?: boolean;
};

type GetCategoryOptions = {
  includeDeleted?: boolean;
};

function getDeletedWhere(options?: GetCategoriesOptions) {
  if (options?.onlyDeleted) {
    return { not: null };
  }

  if (options?.includeDeleted) {
    return undefined;
  }

  return null;
}

export async function getCategories(options?: GetCategoriesOptions): Promise<CategoryRecord[]> {
  if (!hasDatabaseUrl()) {
    return getMockCategories(options);
  }

  return prisma.category.findMany({
    where: {
      deletedAt: getDeletedWhere(options),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCategoryById(
  id: string,
  options?: GetCategoryOptions,
): Promise<CategoryRecord | null> {
  if (!hasDatabaseUrl()) {
    return getMockCategoryById(id, options);
  }

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!options?.includeDeleted && category?.deletedAt) {
    return null;
  }

  return category;
}

export async function getCategoryBySlug(
  slug: string,
  options?: GetCategoryOptions,
): Promise<CategoryRecord | null> {
  if (!hasDatabaseUrl()) {
    return getMockCategoryBySlug(slug, options);
  }

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!options?.includeDeleted && category?.deletedAt) {
    return null;
  }

  return category;
}

export async function createCategory(_prevState: FormState, formData: FormData): Promise<FormState> {
  await ensureAdminSession();

  const parsed = parseCategoryInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const existingCategory = await getCategoryBySlug(parsed.data.slug, { includeDeleted: true });

  if (existingCategory) {
    return {
      success: false,
      message: "Bu slug zaten kullaniliyor.",
      errors: {
        slug: ["Bu slug zaten kullaniliyor."],
      },
    };
  }

  if (!hasDatabaseUrl()) {
    createMockCategory(parsed.data);
  } else {
    await prisma.category.create({
      data: parsed.data,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  revalidatePath("/kategori/[slug]", "page");
  revalidatePath("/yazi/[slug]", "page");

  return {
    success: true,
    message: "Kategori basariyla eklendi.",
  };
}

export async function updateCategory(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await ensureAdminSession();

  const currentCategory = await getCategoryById(id, { includeDeleted: true });
  const parsed = parseCategoryInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const existingCategory = await getCategoryBySlug(parsed.data.slug, { includeDeleted: true });

  if (existingCategory && existingCategory.id !== id) {
    return {
      success: false,
      message: "Bu slug zaten kullaniliyor.",
      errors: {
        slug: ["Bu slug zaten kullaniliyor."],
      },
    };
  }

  if (!hasDatabaseUrl()) {
    updateMockCategory(id, parsed.data);
  } else {
    await prisma.category.update({
      where: { id },
      data: parsed.data,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${id}/edit`);
  revalidatePath("/", "layout");
  revalidatePath("/kategori/[slug]", "page");
  revalidatePath("/yazi/[slug]", "page");

  if (currentCategory) {
    revalidatePath(`/kategori/${currentCategory.slug}`);
  }

  revalidatePath(`/kategori/${parsed.data.slug}`);

  return {
    success: true,
    message: "Kategori bilgileri guncellendi.",
  };
}

export async function deleteCategory(id: string) {
  await ensureAdminSession();

  const category = await getCategoryById(id, { includeDeleted: true });

  if (!category) {
    redirect("/admin/categories?message=category-not-found");
  }

  const linkedActivePostCount = process.env.DATABASE_URL
    ? await prisma.post.count({
        where: {
          categoryId: id,
          deletedAt: null,
        },
      })
    : getMockPosts().filter((post) => post.categoryId === id).length;

  if (linkedActivePostCount > 0) {
    redirect("/admin/categories?message=category-has-posts");
  }

  if (!hasDatabaseUrl()) {
    softDeleteMockCategory(id);
  } else {
    await prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  revalidatePath("/kategori/[slug]", "page");
  revalidatePath("/yazi/[slug]", "page");

  redirect(`/admin/categories?message=category-deleted&undo=${id}`);
}

export async function restoreCategory(id: string) {
  await ensureAdminSession();

  const category = await getCategoryById(id, { includeDeleted: true });

  if (!category) {
    redirect("/admin/categories?view=deleted&message=category-not-found");
  }

  if (!hasDatabaseUrl()) {
    restoreMockCategory(id);
  } else {
    await prisma.category.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  revalidatePath("/kategori/[slug]", "page");
  revalidatePath("/yazi/[slug]", "page");

  redirect("/admin/categories?message=category-restored");
}
