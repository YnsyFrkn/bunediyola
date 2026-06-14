"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import type { Category } from "@/types/category";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollToTopButton } from "./ScrollToTopButton";

type AppShellProps = {
  children: ReactNode;
  categories: Category[];
};

export function AppShell({ children, categories }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <AuthModalProvider>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <ScrollToTopButton />
    </AuthModalProvider>
  );
}
