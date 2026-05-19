# Kullanıcı Eksikleri - Etiket Sistemi İlerleme Notu

Bu doküman kullanıcı tarafındaki eksikleri kapatma sırasının ilk adımı olan etiket sistemini kaydetmek için oluşturuldu.

## Neden İlk Etiket Sistemi?

Etiketler; güncel konular, trend alanları, arama kalitesi, benzer içerikler ve kategori sayfalarının zenginleşmesi için temel veri katmanıdır.

Kullanıcı açısından etkisi:

- Sadece kategoriyle değil, konu başlığıyla keşif yapılabilir.
- Yazıların ne hakkında olduğu daha hızlı anlaşılır.
- Arama sonuçları daha iyi çalışır.
- Sonraki adımda “Güncel Konular” alanı daha sağlıklı kurulabilir.

## Eklenen Veri Modeli

Yeni modeller:

- `Tag`
- `PostTag`

Yeni migration:

- `prisma/migrations/20260429195500_add_tags/migration.sql`

Migration yerel PostgreSQL veritabanına uygulandı.

## Admin Yazı Formu

Admin yazı formuna `Etiketler` alanı eklendi.

Kullanım:

- Etiketler virgülle ayrılarak yazılır.
- En fazla 8 etiket alınır.
- Örnek: `yapay zeka, sosyal medya, gündem`

Değişen dosya:

- `src/components/admin/PostForm.tsx`

## Yazı Kaydetme Akışı

Yazı oluşturma ve güncelleme sırasında:

- Etiket metni parse edilir.
- Etiket slug değerleri normalize edilir.
- Aynı slug tekrar oluşturulmaz.
- Yazı-etiket ilişkileri senkronlanır.

Değişen dosyalar:

- `src/actions/postActions.ts`
- `src/actions/tagActions.ts`
- `src/validations/postSchema.ts`

Not:

- Prisma Client generate dosya kilidine takıldığı için etiket okuma/yazma yardımcıları geçici olarak raw SQL ile çalışıyor.
- Prisma Client generate kilidi çözüldüğünde schema zaten yeni modelleri içeriyor.

## Public Kullanıcı Tarafı

Etiketler artık public post verisine ekleniyor.

Gösterilen alanlar:

- Yazı kartlarında en fazla 3 etiket.
- Yazı detay sayfasında tüm etiketler.
- Etiketlere tıklanınca arama sayfasına gidilir.

Değişen dosyalar:

- `src/lib/content.ts`
- `src/types/post.ts`
- `src/components/post/PostCard.tsx`
- `src/components/post/PostDetail.tsx`

## Arama İyileştirmesi

Arama artık yazı etiketlerini de tarar.

Değişen dosya:

- `src/app/arama/page.tsx`

## Kontrol Sonuçları

- `npx prisma migrate deploy` başarılı.
- `npm run lint` başarılı.
- `npx tsc --noEmit` başarılı.
- Yerelde `/` 200 döndü.
- Yerelde `/arama?q=gundem` 200 döndü.

Tam `npm run build` hâlâ Windows `EPERM` dosya kilidine takılıyor.

Build hatası:

- `node_modules/.prisma/client/query_engine-windows.dll.node` dosyası yeniden adlandırılırken kilit/izin hatası oluşuyor.

## Sıradaki Kullanıcı Odaklı Adım

Etiket sistemi tamamlandığı için sıradaki mantıklı adım:

- Güncel konular alanı

Bu alan etiketlerden beslenebilir ve ana sayfada kullanıcıya “şu an neler konuşuluyor?” hissini verir.

