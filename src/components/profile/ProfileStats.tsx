import Link from "next/link";

type ProfileStatsProps = {
  commentCount: number;
  likeCount: number;
  favoriteCount: number;
};

const statItems = [
  {
    key: "commentCount",
    label: "Yorumlarim",
    href: "/profil/comments",
    description: "Yazilara biraktigin yorumlar",
  },
  {
    key: "likeCount",
    label: "Begendiklerim",
    href: "/profil/likes",
    description: "Begendigin icerikler",
  },
  {
    key: "favoriteCount",
    label: "Kaydettiklerim",
    href: "/profil/favorites",
    description: "Sonra okumak icin ayirdiklarin",
  },
] as const;

export function ProfileStats({ commentCount, likeCount, favoriteCount }: ProfileStatsProps) {
  const values = {
    commentCount,
    likeCount,
    favoriteCount,
  };

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {statItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-[28px] border border-[#f1e6dd] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#fb923c]"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c2410c]">
            {item.label}
          </p>
          <p className="mt-3 text-4xl font-bold text-[#111827]">{values[item.key]}</p>
          <p className="mt-2 text-sm leading-6 text-[#6b7280]">{item.description}</p>
        </Link>
      ))}
    </section>
  );
}
