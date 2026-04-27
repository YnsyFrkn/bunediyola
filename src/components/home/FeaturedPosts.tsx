import type { Post } from "@/types/post";

import { SectionTitle } from "../ui/SectionTitle";
import { PostGrid } from "../post/PostGrid";

type FeaturedPostsProps = {
  posts: Post[];
};

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <section className="space-y-8">
      <SectionTitle
        eyebrow="One Cikanlar"
        title="Gun icinde en cok dikkat ceken icerikler"
        description="Ana sayfada once bu seckilerle baslayabilir, sonra daha fazla icerige rahatca gecebilirsiniz."
      />
      <PostGrid posts={posts} />
    </section>
  );
}
