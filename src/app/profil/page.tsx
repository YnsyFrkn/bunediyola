import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import {
  getCurrentUserProfile,
  getProfileStats,
  getRecentActivity,
} from "@/actions/profileActions";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileRecentActivity } from "@/components/profile/ProfileRecentActivity";
import { ProfileStats } from "@/components/profile/ProfileStats";

export const metadata: Metadata = {
  title: "Profilim | bunediyola",
  description: "bunediyola kullanici profil dashboard sayfasi.",
};

export default async function ProfilePage() {
  const [profile, stats, activity] = await Promise.all([
    getCurrentUserProfile(),
    getProfileStats(),
    getRecentActivity(),
  ]);

  if (!profile || !stats || !activity) {
    redirect(`/giris?callbackUrl=${encodeURIComponent("/profil")}`);
  }

  return (
    <section className="space-y-8">
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        role={profile.role}
        avatarImage={profile.avatarImage}
        city={profile.city}
        district={profile.district}
        birthYear={profile.birthYear}
        gender={profile.gender}
        bio={profile.bio}
      />
      <ProfileStats
        commentCount={stats.commentCount}
        likeCount={stats.likeCount}
        favoriteCount={stats.favoriteCount}
      />
      <ProfileRecentActivity activity={activity} />
      <section className="rounded-[32px] border border-[#f1e6dd] bg-[#fffaf5] p-6">
        <h2 className="font-heading text-3xl text-[#111827]">Hizli baglantilar</h2>
        <p className="mt-3 text-base leading-7 text-[#4b5563]">
          Profilindeki ana alanlara buradan hizlica ulasabilirsin.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/profil/comments"
            className="inline-flex min-h-11 items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
          >
            Yorumlarim
          </Link>
          <Link
            href="/profil/likes"
            className="inline-flex min-h-11 items-center rounded-full border border-[#fecaca] bg-white px-4 py-2 text-sm font-semibold text-[#991b1b] transition hover:border-[#f87171] hover:bg-[#fef2f2]"
          >
            Begendiklerim
          </Link>
          <Link
            href="/profil/favorites"
            className="inline-flex min-h-11 items-center rounded-full border border-[#bfdbfe] bg-white px-4 py-2 text-sm font-semibold text-[#1d4ed8] transition hover:border-[#60a5fa] hover:bg-[#eff6ff]"
          >
            Kaydettiklerim
          </Link>
          <Link
            href="/profil/settings"
            className="inline-flex min-h-11 items-center rounded-full border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#fb923c] hover:text-[#9a3412]"
          >
            Ayarlar
          </Link>
        </div>
      </section>
    </section>
  );
}
