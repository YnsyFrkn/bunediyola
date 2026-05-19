# Kullanıcı Eksikleri - Okuyucu Hareketleri İlerleme Notu

Bu doküman kullanıcı tarafındaki eksikleri kapatma sırasının dördüncü adımı olan Okuyucu Hareketleri alanını kaydetmek için oluşturuldu.

## Amaç

Ana sayfada kullanıcıya sadece editörün veya sistemin seçtiği içerikleri değil, diğer okuyucuların hareketlendirdiği içerikleri de göstermek.

Bu alan kullanıcıya şu hissi verir:

- Sitede etkileşim var.
- Hangi yazılar konuşuluyor hızlıca görülebilir.
- Hangi yazılar beğeniliyor hızlıca görülebilir.
- Kullanıcı bir yazı okuyup çıkmak yerine başka içeriklere geçebilir.

## Eklenen Veri Yardımcıları

Yeni fonksiyonlar:

- `getMostCommentedPosts(limit = 5)`
- `getMostLikedPosts(limit = 5)`

Dosya:

- `src/actions/popularActions.ts`

Kurallar:

- Sadece `PUBLISHED` yazılar listelenir.
- Soft delete edilmiş yazılar listelenmez.
- Yorum listesinde sadece görünür ve silinmemiş yorumlar sayılır.
- Beğeni listesinde en az 1 beğeni alan yazılar gösterilir.
- Yorum listesinde en az 1 yorum alan yazılar gösterilir.

## Eklenen UI Bileşeni

Yeni bileşen:

- `src/components/home/ReaderPulseSection.tsx`

Gösterilen alanlar:

- En Çok Yorumlananlar
- En Çok Beğenilenler

Her kartta:

- Sıra numarası
- Görsel
- Kategori
- Başlık
- Yorum veya beğeni sayısı

## Ana Sayfa Entegrasyonu

Okuyucu Hareketleri alanı ana sayfaya eklendi.

Konum:

- Kategoriler ve Öne Çıkanlar sonrasında.
- Önerilerden önce.

Değişen dosya:

- `src/app/page.tsx`

## Kontrol Sonuçları

- `npm run lint` başarılı.
- `npx tsc --noEmit` başarılı.
- Yerelde `/` 200 döndü.
- Ana sayfa HTML içinde şu metinler görüldü:
  - `Okuyucu Hareketleri`
  - `En Cok Yorumlananlar`
  - `En Cok Begenilenler`

## Tamamlanamayan Kontrol

- `npm run build` hâlâ Windows `EPERM` Prisma DLL kilidine takılıyor.

Build hatası:

- `node_modules/.prisma/client/query_engine-windows.dll.node` dosyası yeniden adlandırılırken kilit/izin hatası oluşuyor.

## Sıradaki Kullanıcı Odaklı Adım

Sıradaki mantıklı adım:

- Editörün Seçtikleri

Alternatif:

- Yorum cevapları
- Yorum beğenme
- Görüş Bildir butonu

Kısa öneri:

Önce `Editörün Seçtikleri` alanını yaparsak ana sayfa keşif omurgası daha da güçlenir. Sonra yorum cevapları ve yorum beğenme ile topluluk hissine geçebiliriz.

