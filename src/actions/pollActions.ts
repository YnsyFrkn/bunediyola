"use server";

import { PostStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormState } from "@/actions/formState";
import { auth, ensureAdminSession } from "@/lib/auth";
import type { PollVoteState } from "@/lib/polls";
import { prisma } from "@/lib/prisma";
import { parsePollInput, pollVoteSchema } from "@/validations/pollSchema";

function toPollResults(
  options: Array<{ id: string; text: string; _count: { votes: number } }>,
  selectedOptionId: string | null,
): PollVoteState {
  const totalVotes = options.reduce((total, option) => total + option._count.votes, 0);

  return {
    selectedOptionId,
    totalVotes,
    options: options.map((option) => ({
      id: option.id,
      text: option.text,
      voteCount: option._count.votes,
      percentage: totalVotes === 0 ? 0 : Math.round((option._count.votes / totalVotes) * 100),
    })),
  };
}

async function getPollResults(pollId: string, selectedOptionId: string | null) {
  const options = await prisma.pollOption.findMany({
    where: {
      pollId,
    },
    include: {
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return toPollResults(options, selectedOptionId);
}

export async function getActivePollForPost(postId: string, userId?: string) {
  const poll = await prisma.poll.findFirst({
    where: {
      postId,
      isActive: true,
    },
    include: {
      options: {
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      votes: userId
        ? {
            where: {
              userId,
            },
            select: {
              optionId: true,
            },
            take: 1,
          }
        : false,
    },
  });

  if (!poll) {
    return null;
  }

  const selectedOptionId = userId && Array.isArray(poll.votes) ? poll.votes[0]?.optionId ?? null : null;

  return {
    id: poll.id,
    question: poll.question,
    ...toPollResults(poll.options, selectedOptionId),
  };
}

export async function getPollsForAdmin() {
  await ensureAdminSession();

  return prisma.poll.findMany({
    include: {
      post: {
        select: {
          title: true,
          slug: true,
        },
      },
      options: {
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createPoll(_prevState: FormState, formData: FormData): Promise<FormState> {
  await ensureAdminSession();
  const parsed = parsePollInput(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Formu kontrol edip tekrar dene.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: parsed.data.postId,
    },
    select: {
      id: true,
      deletedAt: true,
    },
  });

  if (!post || post.deletedAt) {
    return {
      success: false,
      message: "Secilen yazi bulunamadi.",
      errors: {
        postId: ["Gecerli bir yazi secmelisin."],
      },
      values: parsed.values,
    };
  }

  try {
    await prisma.poll.create({
      data: {
        question: parsed.data.question,
        postId: parsed.data.postId,
        options: {
          create: parsed.data.options.map((text, index) => ({
            text,
            sortOrder: index,
          })),
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false,
        message: "Bu yaziya daha once bir anket eklenmis.",
        errors: {
          postId: ["Her yaziya en fazla bir anket eklenebilir."],
        },
        values: parsed.values,
      };
    }

    throw error;
  }

  revalidatePath("/admin/polls");
  revalidatePath(`/yazi/[slug]`, "page");
  redirect("/admin/polls?message=poll-created");
}

export async function togglePollStatus(id: string) {
  await ensureAdminSession();
  const poll = await prisma.poll.findUnique({
    where: {
      id,
    },
    select: {
      isActive: true,
      post: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!poll) {
    redirect("/admin/polls?message=poll-not-found");
  }

  await prisma.poll.update({
    where: {
      id,
    },
    data: {
      isActive: !poll.isActive,
    },
  });

  revalidatePath("/admin/polls");
  revalidatePath(`/yazi/${poll.post.slug}`);
  redirect("/admin/polls?message=poll-status-updated");
}

export async function deletePoll(id: string) {
  await ensureAdminSession();
  const poll = await prisma.poll.findUnique({
    where: {
      id,
    },
    select: {
      post: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!poll) {
    redirect("/admin/polls?message=poll-not-found");
  }

  await prisma.poll.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/polls");
  revalidatePath(`/yazi/${poll.post.slug}`);
  redirect("/admin/polls?message=poll-deleted");
}

export async function votePoll(
  pollId: string,
  prevState: PollVoteState,
  formData: FormData,
): Promise<PollVoteState> {
  const parsed = pollVoteSchema.safeParse({
    optionId: formData.get("optionId"),
  });

  if (!parsed.success) {
    return {
      ...prevState,
      message: "Oy vermek icin bir secenek secmelisin.",
    };
  }

  const session = await auth();

  if (!session?.user) {
    return {
      ...prevState,
      message: "Oy vermek icin giris yapmalisin.",
    };
  }

  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      post: {
        select: {
          slug: true,
          status: true,
          deletedAt: true,
        },
      },
      options: {
        where: {
          id: parsed.data.optionId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (
    !poll ||
    !poll.isActive ||
    poll.post.deletedAt ||
    poll.post.status !== PostStatus.PUBLISHED ||
    poll.options.length !== 1
  ) {
    return {
      ...prevState,
      message: "Bu ankete su anda oy verilemiyor.",
    };
  }

  try {
    await prisma.pollVote.create({
      data: {
        pollId: poll.id,
        optionId: parsed.data.optionId,
        userId: session.user.id,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existingVote = await prisma.pollVote.findUnique({
        where: {
          pollId_userId: {
            pollId: poll.id,
            userId: session.user.id,
          },
        },
        select: {
          optionId: true,
        },
      });
      const results = await getPollResults(poll.id, existingVote?.optionId ?? null);

      return {
        ...results,
        message: "Bu ankete daha once oy verdin.",
      };
    }

    throw error;
  }

  revalidatePath(`/yazi/${poll.post.slug}`);
  const results = await getPollResults(poll.id, parsed.data.optionId);

  return {
    ...results,
    message: "Oyun kaydedildi.",
  };
}
