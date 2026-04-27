"use client";

import Image from "next/image";
import { useActionState } from "react";

import { initialFormState } from "@/actions/formState";
import { removeProfileAvatar, updateUserProfile } from "@/actions/profileActions";

type ProfileFormProps = {
  name: string | null;
  email: string;
  avatarImage: string | null;
  city: string | null;
  district: string | null;
  birthYear: number | null;
  gender: string | null;
  bio: string | null;
};

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="mt-2 text-sm font-semibold text-[#b91c1c]">{error[0]}</p>;
}

const genderOptions = [
  { value: "", label: "Secim yap" },
  { value: "FEMALE", label: "Kadin" },
  { value: "MALE", label: "Erkek" },
  { value: "NON_BINARY", label: "Non-binary" },
  { value: "PREFER_NOT_TO_SAY", label: "Belirtmek istemiyorum" },
];

export function ProfileForm({
  name,
  email,
  avatarImage,
  city,
  district,
  birthYear,
  gender,
  bio,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateUserProfile, initialFormState);
  const defaultName = state.success ? state.values?.name ?? name ?? "" : state.values?.name ?? name ?? "";
  const defaultCity = state.values?.city ?? city ?? "";
  const defaultDistrict = state.values?.district ?? district ?? "";
  const defaultBirthYear = state.values?.birthYear ?? (birthYear ? String(birthYear) : "");
  const defaultGender = state.values?.gender ?? gender ?? "";
  const defaultBio = state.values?.bio ?? bio ?? "";

  return (
    <form action={formAction} className="space-y-6 rounded-[32px] border border-[#f1e6dd] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 rounded-[28px] border border-[#f1e6dd] bg-[#fffaf5] p-5 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[#fed7aa] bg-white">
          {avatarImage ? (
            <Image src={avatarImage} alt={name ?? "Profil resmi"} fill className="object-cover" sizes="96px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-heading text-4xl text-[#c2410c]">
              {(name || email).slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <label htmlFor="avatar" className="block text-sm font-semibold text-[#111827]">
              Profil Resmi
            </label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-2 block w-full text-sm text-[#4b5563] file:mr-4 file:rounded-full file:border-0 file:bg-[#111827] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#ea580c]"
            />
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              JPG, PNG veya WEBP yukleyebilirsin. En fazla 2 MB.
            </p>
          </div>
          {avatarImage ? (
            <button
              type="submit"
              formAction={removeProfileAvatar}
              className="inline-flex min-h-10 items-center rounded-full border border-[#fecaca] bg-white px-4 py-2 text-sm font-semibold text-[#991b1b] transition hover:border-[#f87171] hover:bg-[#fef2f2]"
            >
              Profil Resmini Sil
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-[#111827]">
          Ad Soyad
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={50}
          defaultValue={defaultName}
          className="mt-2 w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 text-base outline-none transition focus:border-[#fb923c]"
        />
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Ad soyad 2 ile 50 karakter arasinda olmali.
        </p>
        <FieldError error={state.errors?.name} />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#111827]">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          readOnly
          className="mt-2 w-full rounded-2xl border border-[#e7e5e4] bg-[#f9fafb] px-4 py-3 text-base text-[#4b5563] outline-none"
        />
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Email degisikligi bu surumde kapali.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-[#111827]">
            Sehir
          </label>
          <input
            id="city"
            name="city"
            type="text"
            maxLength={50}
            defaultValue={defaultCity}
            placeholder="Istanbul"
            className="mt-2 w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 text-base outline-none transition focus:border-[#fb923c]"
          />
          <FieldError error={state.errors?.city} />
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-semibold text-[#111827]">
            Ilce
          </label>
          <input
            id="district"
            name="district"
            type="text"
            maxLength={50}
            defaultValue={defaultDistrict}
            placeholder="Kadikoy"
            className="mt-2 w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 text-base outline-none transition focus:border-[#fb923c]"
          />
          <FieldError error={state.errors?.district} />
        </div>

        <div>
          <label htmlFor="birthYear" className="block text-sm font-semibold text-[#111827]">
            Dogum Yili
          </label>
          <input
            id="birthYear"
            name="birthYear"
            type="number"
            min={1900}
            max={new Date().getFullYear()}
            defaultValue={defaultBirthYear}
            placeholder="1998"
            className="mt-2 w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 text-base outline-none transition focus:border-[#fb923c]"
          />
          <FieldError error={state.errors?.birthYear} />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-semibold text-[#111827]">
            Cinsiyet
          </label>
          <select
            id="gender"
            name="gender"
            defaultValue={defaultGender}
            className="mt-2 w-full rounded-2xl border border-[#e7e5e4] bg-white px-4 py-3 text-base outline-none transition focus:border-[#fb923c]"
          >
            {genderOptions.map((option) => (
              <option key={`${option.value}-${option.label}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError error={state.errors?.gender} />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-semibold text-[#111827]">
          Hakkinda
        </label>
        <textarea
          id="bio"
          name="bio"
          maxLength={240}
          rows={4}
          defaultValue={defaultBio}
          placeholder="Kendinden, ilgi alanlarindan veya okumayi sevdigin konulardan kisaca bahsedebilirsin."
          className="mt-2 w-full rounded-2xl border border-[#e7e5e4] px-4 py-3 text-base leading-7 outline-none transition focus:border-[#fb923c]"
        />
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">En fazla 240 karakter.</p>
        <FieldError error={state.errors?.bio} />
      </div>

      {state.message ? (
        <div
          className={`rounded-[20px] border px-4 py-3 text-sm leading-7 ${
            state.success
              ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
              : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Guncelleniyor..." : "Bilgilerimi Guncelle"}
      </button>
    </form>
  );
}
