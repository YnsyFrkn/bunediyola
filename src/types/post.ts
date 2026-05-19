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
  isEditorPick?: boolean;
  viewCount: number;
  readingTimeMinutes?: number;
  status?: "DRAFT" | "PUBLISHED";
  tags?: Array<{
    name: string;
    slug: string;
  }>;
};
