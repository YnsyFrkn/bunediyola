import { auth } from "@/lib/auth";
import { verifyMailConnection } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return Response.json(
      {
        status: "unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const mail = await verifyMailConnection();

  return Response.json({
    status: mail.connected ? "ok" : "error",
    mail,
  });
}
