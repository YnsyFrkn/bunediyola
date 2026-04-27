import { createCategory } from "@/actions/categoryActions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Button } from "@/components/ui/Button";

export default function CreateCategoryPage() {
  return (
    <>
      <AdminHeader
        title="Kategori Ekle"
        description="Yeni bir kategori adi, slug ve aciklama belirleyerek yazi yonetimini duzenli hale getir."
        actions={<Button href="/admin/categories" variant="secondary">Kategori Listesine Don</Button>}
      />

      <CategoryForm action={createCategory} submitLabel="Kategori Ekle" />
    </>
  );
}
