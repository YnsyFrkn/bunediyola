import type { ReactNode } from "react";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

type ProfileLayoutProps = {
  children: ReactNode;
};

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProfileSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
