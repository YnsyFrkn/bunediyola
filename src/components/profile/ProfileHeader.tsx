import Image from "next/image";

import { UserRole } from "@prisma/client";

type ProfileHeaderProps = {
  name: string | null;
  email: string;
  role: UserRole;
  avatarImage: string | null;
  city: string | null;
  district: string | null;
  birthYear: number | null;
  gender: string | null;
  bio: string | null;
};

function getRoleLabel(role: UserRole) {
  return role === UserRole.ADMIN ? "Yonetici" : "Kullanici";
}

function getGenderLabel(gender: string | null) {
  const labels: Record<string, string> = {
    FEMALE: "Kadin",
    MALE: "Erkek",
    NON_BINARY: "Non-binary",
    PREFER_NOT_TO_SAY: "Belirtmek istemiyor",
  };

  return gender ? labels[gender] : null;
}

function getAge(birthYear: number | null) {
  if (!birthYear) {
    return null;
  }

  return new Date().getFullYear() - birthYear;
}

export function ProfileHeader({
  name,
  email,
  role,
  avatarImage,
  city,
  district,
  birthYear,
  gender,
  bio,
}: ProfileHeaderProps) {
  const location = [district, city].filter(Boolean).join(", ");
  const age = getAge(birthYear);
  const genderLabel = getGenderLabel(gender);

  return (
    <section className="rounded-[32px] border border-[#f1e6dd] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-[#fed7aa] bg-[#fff7ed]">
            {avatarImage ? (
              <Image src={avatarImage} alt={name ?? "Profil resmi"} fill className="object-cover" sizes="96px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-heading text-4xl text-[#c2410c]">
                {(name || email).slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
              Profil
            </p>
            <h1 className="font-heading text-4xl leading-tight text-[#111827] sm:text-5xl">
              Hos geldin, {name || "Kullanici"}
            </h1>
            <p className="break-words text-base leading-7 text-[#4b5563]">{email}</p>
            {bio ? <p className="max-w-3xl text-base leading-7 text-[#374151]">{bio}</p> : null}
            {location || age || genderLabel ? (
              <div className="flex flex-wrap gap-2 text-sm font-semibold text-[#4b5563]">
                {location ? (
                  <span className="rounded-full bg-[#f3f4f6] px-3 py-1">{location}</span>
                ) : null}
                {age ? (
                  <span className="rounded-full bg-[#f3f4f6] px-3 py-1">{age} yas</span>
                ) : null}
                {genderLabel ? (
                  <span className="rounded-full bg-[#f3f4f6] px-3 py-1">{genderLabel}</span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <span className="rounded-full border border-[#fed7aa] bg-[#fff7ed] px-4 py-2 text-sm font-semibold text-[#9a3412]">
          {getRoleLabel(role)}
        </span>
      </div>
    </section>
  );
}
