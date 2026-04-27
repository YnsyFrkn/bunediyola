"use client";

import type { ReactNode } from "react";

import { type PendingAuthAction, useAuthModal } from "@/components/auth/AuthModalProvider";

type AuthRequiredButtonProps = {
  children: ReactNode;
  className: string;
  mode?: "login" | "register";
  intent?: PendingAuthAction;
};

export function AuthRequiredButton({
  children,
  className,
  mode = "login",
  intent = null,
}: AuthRequiredButtonProps) {
  const { openAuthModal } = useAuthModal();

  return (
    <button type="button" onClick={() => openAuthModal(mode, intent)} className={className}>
      {children}
    </button>
  );
}
