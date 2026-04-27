import { notFound } from "next/navigation";

import { getCategoryById, updateCategory } from "@/actions/categoryActions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Button } from "@/components/ui/Button";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  const action = updateCategory.bind(null, id);

  return (
    <>
      <AdminHeader
        title="Kategoriyi Duzenle"
        description="Mevcut kategori bilgilerini guncelleyip kaydedebilirsin."
        actions={<Button href="/admin/categories" variant="secondary">Kategori Listesine Don</Button>}
      />

      <CategoryForm
        action={action}
        submitLabel="Degisiklikleri Kaydet"
        initialValues={{
          name: category.name,
          slug: category.slug,
          description: category.description,
        }}
      />
    </>
  );
}
