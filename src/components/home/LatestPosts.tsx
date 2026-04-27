import type { Post } from "@/types/post";

import { PostGrid } from "../post/PostGrid";
import { SectionTitle } from "../ui/SectionTitle";

type LatestPostsProps = {
  posts: Post[];
};

export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section id="son-eklenenler" className="space-y-8">
      <SectionTitle
        eyebrow="Son Eklenenler"
        title="Taze icerikler, net basliklar, kolay gezinme"
        description="Yeni eklenen yazilar burada. Basliktan kategoriye kadar her sey tek bakista anlasilacak sekilde hazirlandi."
      />
      <PostGrid posts={posts} />
    </section>
  );
}
