import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 p-4 lg:grid-cols-[280px_1fr] lg:p-6">
        <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <AdminSidebar
            user={{
              name: session.user.name,
              email: session.user.email,
            }}
          />
        </div>
        <section className="min-w-0 space-y-6">{children}</section>
      </div>
    </div>
  );
}
