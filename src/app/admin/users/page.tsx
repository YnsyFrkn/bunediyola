import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/utils/formatDate";

export const metadata: Metadata = {
  title: "Kullanicilar | bunediyola Admin",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <>
      <AdminHeader
        title="Kullanicilar"
        description="Kayitli hesaplarin ad, email, rol ve kayit tarihini guvenli sekilde gor."
      />

      {users.length === 0 ? (
        <EmptyState
          title="Henuz kullanici yok"
          description="Yeni hesaplar kaydoldukca bu alanda listelenecek."
        />
      ) : (
        <AdminTable
          columns={[
            { key: "name", title: "Kullanici" },
            { key: "email", title: "Email" },
            { key: "role", title: "Rol" },
            { key: "password", title: "Sifre" },
            { key: "createdAt", title: "Kayit Tarihi" },
          ]}
          rows={users.map((user) => ({
            id: user.id,
            cells: {
              name: user.name ?? "Isimsiz kullanici",
              email: user.email,
              role: user.role === "ADMIN" ? "Admin" : "Kullanici",
              password: "Guvenli olarak hashlenmis",
              createdAt: formatDate(user.createdAt.toISOString()),
            },
          }))}
        />
      )}
    </>
  );
}
