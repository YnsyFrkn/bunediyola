import { auth } from "@/lib/auth";
import { sendMailHealthTestEmail, verifyMailConnection } from "@/lib/mail";

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

export async function POST() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN" || !session.user.email) {
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

  if (!mail.connected) {
    return Response.json(
      {
        status: "error",
        mail,
      },
      {
        status: 503,
      },
    );
  }

  const delivery = await sendMailHealthTestEmail(session.user.email);

  return Response.json(
    {
      status: delivery.sent ? "ok" : "error",
      mail,
      delivery,
    },
    {
      status: delivery.sent ? 200 : 503,
    },
  );
}
