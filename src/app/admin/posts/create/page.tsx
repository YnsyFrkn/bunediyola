import { createPost } from "@/actions/postActions";
import { getCategories } from "@/actions/categoryActions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { PostForm } from "@/components/admin/PostForm";
import { Button } from "@/components/ui/Button";

export default async function CreatePostPage() {
  const categories = await getCategories();

  return (
    <>
      <AdminHeader
        title="Yeni Yazi Ekle"
        description="Baslik, icerik, kategori ve yayin durumunu secerek yeni bir yazi olustur."
        actions={<Button href="/admin/posts" variant="secondary">Yazi Listesine Don</Button>}
      />

      {categories.length > 0 ? (
        <PostForm
          action={createPost}
          categories={categories.map((category) => ({ id: category.id, name: category.name }))}
          submitLabel="Yaziyi Kaydet"
          secondaryLabel="Taslak Olarak Kaydet icin durum alanini Taslak sec."
          initialValues={{ author: "bunediyola ekibi", status: "DRAFT" }}
        />
      ) : (
        <EmptyState
          title="Once kategori eklemelisin"
          description="Yazi olusturabilmek icin once en az bir kategori eklenmesi gerekiyor."
          action={<Button href="/admin/categories/create">Kategori Ekle</Button>}
        />
      )}
    </>
  );
}
