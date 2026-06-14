"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { PostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import type { FormState } from "@/actions/formState";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseProfileInput } from "@/validations/profileSchema";

const AVATAR_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "avatars");
const AVATAR_PUBLIC_PATH = "/uploads/avatars";
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export type CurrentUserProfile = Awaited<ReturnType<typeof getCurrentUserProfile>>;
export type ProfileStats = Awaited<ReturnType<typeof getProfileStats>>;
export type ProfileRecentActivity = Awaited<ReturnType<typeof getRecentActivity>>;

async function getSessionUserId() {
  const session = await auth();

  return session?.user?.id ?? null;
}

export async function getCurrentUserProfile() {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarImage: true,
      city: true,
      district: true,
      birthYear: true,
      gender: true,
      bio: true,
      createdAt: true,
    },
  });
}

function getAvatarFile(formData: FormData) {
  const value = formData.get("avatar");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function getLocalAvatarPath(avatarImage: string | null | undefined) {
  if (!avatarImage?.startsWith(`${AVATAR_PUBLIC_PATH}/`)) {
    return null;
  }

  const filename = path.basename(avatarImage);

  return path.join(AVATAR_UPLOAD_DIR, filename);
}

async function deleteAvatarFile(avatarImage: string | null | undefined) {
  const avatarPath = getLocalAvatarPath(avatarImage);

  if (!avatarPath) {
    return;
  }

  try {
    await unlink(avatarPath);
  } catch {
    // File may already be gone; profile cleanup should still continue.
  }
}

async function saveAvatarFile(userId: string, avatar: File) {
  const extension = ALLOWED_AVATAR_TYPES.get(avatar.type);

  if (!extension) {
    return {
      success: false as const,
      message: "Profil resmi JPG, PNG veya WEBP formatinda olmali.",
    };
  }

  if (avatar.size > MAX_AVATAR_SIZE) {
    return {
      success: false as const,
      message: "Profil resmi en fazla 2 MB olmali.",
    };
  }

  await mkdir(AVATAR_UPLOAD_DIR, {
    recursive: true,
  });

  const filename = `${userId}-${randomUUID()}.${extension}`;
  const filePath = path.join(AVATAR_UPLOAD_DIR, filename);
  const bytes = await avatar.arrayBuffer();

  await writeFile(filePath, Buffer.from(bytes));

  return {
    success: true as const,
    avatarImage: `${AVATAR_PUBLIC_PATH}/${filename}`,
  };
}

export async function getProfileStats() {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  const [commentCount, likeCount, favoriteCount] = await Promise.all([
    prisma.comment.count({
      where: {
        userId,
      },
    }),
    prisma.like.count({
      where: {
        userId,
        post: {
          status: PostStatus.PUBLISHED,
          deletedAt: null,
        },
      },
    }),
    prisma.favorite.count({
      where: {
        userId,
        post: {
          status: PostStatus.PUBLISHED,
          deletedAt: null,
        },
      },
    }),
  ]);

  return {
    commentCount,
    likeCount,
    favoriteCount,
  };
}

export async function getRecentActivity(limit = 5) {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  const [recentComments, recentLikes, recentFavorites] = await Promise.all([
    prisma.comment.findMany({
      where: {
        userId,
        post: {
          status: PostStatus.PUBLISHED,
          deletedAt: null,
        },
      },
      include: {
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    }),
    prisma.like.findMany({
      where: {
        userId,
        post: {
          status: PostStatus.PUBLISHED,
          deletedAt: null,
        },
      },
      include: {
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    }),
    prisma.favorite.findMany({
      where: {
        userId,
        post: {
          status: PostStatus.PUBLISHED,
          deletedAt: null,
        },
      },
      include: {
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    }),
  ]);

  return {
    recentComments,
    recentLikes,
    recentFavorites,
  };
}

export async function updateUserProfile(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Profilini guncellemek icin giris yapmalisin.",
    };
  }

  const parsed = parseProfileInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        avatarImage: true,
      },
    });
    const avatar = getAvatarFile(formData);
    const avatarResult = avatar ? await saveAvatarFile(session.user.id, avatar) : null;

    if (avatarResult && !avatarResult.success) {
      return {
        success: false,
        message: avatarResult.message,
        values: {
          name: parsed.data.name,
          city: parsed.data.city ?? "",
          district: parsed.data.district ?? "",
          birthYear: parsed.data.birthYear ? String(parsed.data.birthYear) : "",
          gender: parsed.data.gender ?? "",
          bio: parsed.data.bio ?? "",
        },
      };
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: parsed.data.name,
        city: parsed.data.city,
        district: parsed.data.district,
        birthYear: parsed.data.birthYear,
        gender: parsed.data.gender,
        bio: parsed.data.bio,
        ...(avatarResult?.success ? { avatarImage: avatarResult.avatarImage } : {}),
      },
    });

    if (avatarResult?.success) {
      await deleteAvatarFile(currentUser?.avatarImage);
    }

    revalidatePath("/profil");
    revalidatePath("/profil/settings");

    return {
      success: true,
      message: "Profil bilgilerin guncellendi.",
      values: {
        name: parsed.data.name,
        city: parsed.data.city ?? "",
        district: parsed.data.district ?? "",
        birthYear: parsed.data.birthYear ? String(parsed.data.birthYear) : "",
        gender: parsed.data.gender ?? "",
        bio: parsed.data.bio ?? "",
      },
    };
  } catch (error) {
    console.error("Profil guncellenemedi", error);

    return {
      success: false,
      message: "Profil guncellenemedi. Lutfen tekrar dene.",
      values: {
        name: parsed.data.name,
        city: parsed.data.city ?? "",
        district: parsed.data.district ?? "",
        birthYear: parsed.data.birthYear ? String(parsed.data.birthYear) : "",
        gender: parsed.data.gender ?? "",
        bio: parsed.data.bio ?? "",
      },
    };
  }
}

export async function removeProfileAvatar() {
  "use server";

  const session = await auth();

  if (!session?.user) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      avatarImage: true,
    },
  });

  if (!user?.avatarImage) {
    return;
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      avatarImage: null,
    },
  });

  await deleteAvatarFile(user.avatarImage);

  revalidatePath("/profil");
  revalidatePath("/profil/settings");
}
