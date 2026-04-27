import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getCurrentUserProfile } from "@/actions/profileActions";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata: Metadata = {
  title: "Profil Ayarlari | bunediyola",
  description: "bunediyola profil bilgilerini duzenleme sayfasi.",
};

export default async function ProfileSettingsPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect(`/giris?callbackUrl=${encodeURIComponent("/profil/settings")}`);
  }

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
          Profil
        </p>
        <h1 className="font-heading text-5xl text-[#111827] sm:text-6xl">Ayarlar</h1>
        <p className="max-w-3xl text-lg leading-8 text-[#4b5563]">
          Profil bilgilerini buradan guncelleyebilirsin. Email degisikligi bu surumde kapali.
        </p>
      </div>
      <ProfileForm
        name={profile.name}
        email={profile.email}
        avatarImage={profile.avatarImage}
        city={profile.city}
        district={profile.district}
        birthYear={profile.birthYear}
        gender={profile.gender}
        bio={profile.bio}
      />
    </section>
  );
}
