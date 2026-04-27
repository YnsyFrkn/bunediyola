"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AuthModalProvider } from "@/components/auth/AuthModalProvider";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollToTopButton } from "./ScrollToTopButton";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <AuthModalProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTopButton />
    </AuthModalProvider>
  );
}
