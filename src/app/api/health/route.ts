import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [userCount, categoryCount, postCount] = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.post.count(),
    ]);

    return Response.json({
      status: "ok",
      database: "connected",
      records: {
        users: userCount,
        categories: categoryCount,
        posts: postCount,
      },
    });
  } catch {
    return Response.json(
      {
        status: "error",
        database: "unavailable",
      },
      {
        status: 503,
      },
    );
  }
}
