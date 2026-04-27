import { notFound } from "next/navigation";
import Link from "next/link";

import { getCategories } from "@/actions/categoryActions";
import { getPostById, updatePost } from "@/actions/postActions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PostForm } from "@/components/admin/PostForm";
import { Button } from "@/components/ui/Button";

type EditPostPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
  }>;
};

export default async function EditPostPage({ params, searchParams }: EditPostPageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  const [post, categories] = await Promise.all([getPostById(id), getCategories()]);

  if (!post) {
    notFound();
  }

  const action = updatePost.bind(null, id);

  return (
    <>
      <AdminHeader
        title="Yaziyi Duzenle"
        description="Mevcut yazi bilgilerini guncelleyip yeniden kaydedebilirsin."
        actions={
          <>
            {post.status === "PUBLISHED" ? <Button href={`/yazi/${post.slug}`}>Yaziya Git</Button> : null}
            <Button href="/admin/posts" variant="secondary">Yazi Listesine Don</Button>
          </>
        }
      />

      {saved ? (
        <section
          className={`rounded-[28px] border p-5 shadow-sm ${
            saved === "published"
              ? "border-[#86efac] bg-[#f0fdf4]"
              : "border-[#fdba74] bg-[#fff7ed]"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p
                className={`text-sm font-semibold uppercase tracking-[0.18em] ${
                  saved === "published" ? "text-[#166534]" : "text-[#c2410c]"
                }`}
              >
                Kayit Tamam
              </p>
              <h2 className="text-2xl font-semibold text-[#111827]">
                {saved === "published"
                  ? "Yazi basariyla kaydedildi ve siteye cikarilmaya hazir."
                  : "Taslak guvenli sekilde kaydedildi."}
              </h2>
              <p className="text-base leading-7 text-[#4b5563]">
                {saved === "published"
                  ? "Panelde kalip duzenlemeye devam edebilir, istersen hemen yazinin public gorunumune gecebilirsin."
                  : "Istersen burada duzenlemeye devam edebilir, kontrol tamamlandiginda yaziyi yayina alabilirsin."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {saved === "published" ? (
                <Button href={`/yazi/${post.slug}`}>Yaziya Git</Button>
              ) : null}
              <Link
                href="/admin/posts"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d6d3d1] bg-white px-5 py-3 text-sm font-semibold text-[#1f2937] transition hover:border-[#fb923c] hover:text-[#9a3412]"
              >
                Tum Yazilar
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <PostForm
        action={action}
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        submitLabel="Degisiklikleri Kaydet"
        initialValues={{
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          content: post.content,
          coverImage: post.coverImage,
          author: post.author,
          categoryId: post.categoryId,
          status: post.status,
        }}
      />
    </>
  );
}
