"use client";

import { AuthRequiredButton } from "@/components/auth/AuthRequiredButton";

export function LoginToComment() {
  return (
    <div className="rounded-[28px] border border-[#f1e6dd] bg-[#fffaf5] p-6">
      <h3 className="font-heading text-2xl text-[#111827]">Yorum yapmak icin giris yapmalisin</h3>
      <p className="mt-3 text-base leading-7 text-[#4b5563]">
        Hesabin varsa hemen giris yapabilir, yoksa kisa bir kayitla yorum yazmaya baslayabilirsin.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <AuthRequiredButton
          className="inline-flex min-h-11 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
        >
          Giris Yap
        </AuthRequiredButton>
        <AuthRequiredButton
          mode="register"
          className="inline-flex min-h-11 items-center rounded-full border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#fb923c] hover:text-[#9a3412]"
        >
          Kayit Ol
        </AuthRequiredButton>
      </div>
    </div>
  );
}
