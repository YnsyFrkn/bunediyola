export type Post = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  categorySlug: string;
  image: string;
  author: string;
  createdAt: string;
  isFeatured: boolean;
  viewCount: number;
  status?: "DRAFT" | "PUBLISHED";
};
