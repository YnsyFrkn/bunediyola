"use client";

import { useFormStatus } from "react-dom";

import { logout } from "@/actions/authActions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#fb923c] hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Cikis yapiliyor..." : "Cikis Yap"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <SubmitButton />
    </form>
  );
}
