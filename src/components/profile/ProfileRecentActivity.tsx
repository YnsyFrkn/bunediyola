import Link from "next/link";

import type { ProfileRecentActivity as ProfileRecentActivityData } from "@/actions/profileActions";
import { formatDate } from "@/utils/formatDate";

type ProfileRecentActivityProps = {
  activity: NonNullable<ProfileRecentActivityData>;
};

type ActivityItem = {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
  detail?: string;
};

function ActivityColumn({
  title,
  emptyText,
  items,
}: {
  title: string;
  emptyText: string;
  items: ActivityItem[];
}) {
  return (
    <section className="rounded-[28px] border border-[#f1e6dd] bg-white p-5 shadow-sm">
      <h2 className="font-heading text-2xl text-[#111827]">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm leading-7 text-[#6b7280]">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <article key={item.id} className="border-t border-[#f1e6dd] pt-4 first:border-t-0 first:pt-0">
              <Link
                href={`/yazi/${item.slug}`}
                className="text-sm font-semibold leading-6 text-[#111827] transition hover:text-[#c2410c]"
              >
                {item.title}
              </Link>
              {item.detail ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4b5563]">{item.detail}</p>
              ) : null}
              <p className="mt-2 text-xs font-medium text-[#6b7280]">
                {formatDate(item.createdAt.toISOString())}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProfileRecentActivity({ activity }: ProfileRecentActivityProps) {
  const recentComments = activity.recentComments.map((comment) => ({
    id: comment.id,
    title: comment.post.title,
    slug: comment.post.slug,
    createdAt: comment.createdAt,
    detail: comment.content,
  }));
  const recentLikes = activity.recentLikes.map((like) => ({
    id: like.id,
    title: like.post.title,
    slug: like.post.slug,
    createdAt: like.createdAt,
  }));
  const recentFavorites = activity.recentFavorites.map((favorite) => ({
    id: favorite.id,
    title: favorite.post.title,
    slug: favorite.post.slug,
    createdAt: favorite.createdAt,
  }));
  const hasAnyActivity =
    recentComments.length > 0 || recentLikes.length > 0 || recentFavorites.length > 0;

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c2410c]">
          Son aktiviteler
        </p>
        <h2 className="mt-2 font-heading text-3xl text-[#111827]">Profil hareketlerin</h2>
      </div>
      {!hasAnyActivity ? (
        <div className="rounded-[28px] border border-dashed border-[#fdba74] bg-[#fff7ed] p-6">
          <h3 className="font-heading text-2xl text-[#111827]">Henuz aktiviten yok</h3>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#4b5563]">
            Ilk yorumunu yaparak, icerikleri begenerek veya kaydederek profilini
            hareketlendirebilirsin.
          </p>
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityColumn
          title="Son yorumlar"
          emptyText="Henuz yorum yapmadin."
          items={recentComments}
        />
        <ActivityColumn
          title="Son begeniler"
          emptyText="Henuz begeni yapmadin."
          items={recentLikes}
        />
        <ActivityColumn
          title="Son kayitlar"
          emptyText="Henuz icerik kaydetmedin."
          items={recentFavorites}
        />
      </div>
    </section>
  );
}
