import Link from "next/link";

import { deletePoll, getPollsForAdmin, togglePollStatus } from "@/actions/pollActions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminTable } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/Button";

type AdminPollsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

function PollNotice({ message }: { message?: string }) {
  if (message === "poll-created") {
    return <AdminNotice tone="success" title="Anket olusturuldu" description="Anket secilen yaziya eklendi." />;
  }

  if (message === "poll-status-updated") {
    return <AdminNotice tone="success" title="Anket durumu guncellendi" description="Anketin gorunurlugu degistirildi." />;
  }

  if (message === "poll-deleted") {
    return <AdminNotice tone="warning" title="Anket silindi" description="Anket ve tum oy kayitlari kaldirildi." />;
  }

  if (message === "poll-not-found") {
    return <AdminNotice tone="error" title="Anket bulunamadi" description="Secilen ankete ulasilamadi." />;
  }

  return null;
}

export default async function AdminPollsPage({ searchParams }: AdminPollsPageProps) {
  const { message } = await searchParams;
  const polls = await getPollsForAdmin();

  return (
    <>
      <AdminHeader
        title="Anketler"
        description="Yazilara bagli anketleri, oy sayilarini ve gorunurluklerini yonet."
        actions={<Button href="/admin/polls/create">Anket Olustur</Button>}
      />
      <PollNotice message={message} />

      {polls.length === 0 ? (
        <EmptyState
          title="Henuz anket yok"
          description="Ilk anketini olusturup bir yaziya baglayabilirsin."
          action={<Button href="/admin/polls/create">Anket Olustur</Button>}
        />
      ) : (
        <AdminTable
          columns={[
            { key: "question", title: "Anket" },
            { key: "post", title: "Yazi" },
            { key: "results", title: "Sonuclar" },
            { key: "status", title: "Durum" },
            { key: "actions", title: "Islem" },
          ]}
          rows={polls.map((poll) => ({
            id: poll.id,
            cells: {
              question: <span className="font-semibold text-[#111827]">{poll.question}</span>,
              post: (
                <Link href={`/yazi/${poll.post.slug}`} className="font-semibold text-[#c2410c]">
                  {poll.post.title}
                </Link>
              ),
              results: (
                <div className="space-y-1">
                  {poll.options.map((option) => (
                    <p key={option.id} className="text-xs text-[#6b7280]">
                      {option.text}: {option._count.votes}
                    </p>
                  ))}
                  <p className="font-semibold text-[#111827]">Toplam: {poll._count.votes}</p>
                </div>
              ),
              status: (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    poll.isActive
                      ? "bg-[#f0fdf4] text-[#166534]"
                      : "bg-[#fff7ed] text-[#9a3412]"
                  }`}
                >
                  {poll.isActive ? "Aktif" : "Pasif"}
                </span>
              ),
              actions: (
                <div className="flex flex-wrap gap-2">
                  <AdminActionForm
                    action={togglePollStatus.bind(null, poll.id)}
                    label={poll.isActive ? "Pasif Yap" : "Aktif Yap"}
                    variant={poll.isActive ? "ghost" : "success"}
                  />
                  <AdminActionForm
                    action={deletePoll.bind(null, poll.id)}
                    label="Sil"
                    variant="danger"
                    confirmMessage="Anketi ve tum oylarini kalici olarak silmek istedigine emin misin?"
                  />
                </div>
              ),
            },
          }))}
        />
      )}
    </>
  );
}
