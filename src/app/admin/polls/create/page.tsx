import { createPoll } from "@/actions/pollActions";
import { getPosts } from "@/actions/postActions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PollForm } from "@/components/admin/PollForm";
import { Button } from "@/components/ui/Button";

export default async function CreatePollPage() {
  const posts = (await getPosts()).filter((post) => !post.deletedAt);

  return (
    <>
      <AdminHeader
        title="Anket Olustur"
        description="Bir yaziya tek soruluk, cok secenekli bir anket bagla."
        actions={
          <Button href="/admin/polls" variant="secondary">
            Anketlere Don
          </Button>
        }
      />
      <PollForm
        action={createPoll}
        posts={posts.map((post) => ({
          id: post.id,
          title: post.title,
        }))}
      />
    </>
  );
}
