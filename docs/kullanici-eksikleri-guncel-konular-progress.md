# Kullanıcı Eksikleri - Güncel Konular İlerleme Notu

Bu doküman kullanıcı tarafındaki eksikleri kapatma sırasının ikinci adımı olan Güncel Konular alanını kaydetmek için oluşturuldu.

## Amaç

Ana sayfaya giren kullanıcıya sitede hangi konuların öne çıktığını hızlıca göstermek.

Bu alan Onedio benzeri içerik sitelerinde alışılmış bir keşif davranışı sağlar:

- Kullanıcı kategoriye girmeden konu keşfedebilir.
- Site daha canlı görünür.
- Etiket sistemi kullanıcıya görünür hale gelir.
- Arama sayfası daha doğal kullanılmaya başlar.

## Veri Kaynağı

Güncel Konular alanı etiketlerden beslenir.

Sadece şu yazılara bağlı etiketler dikkate alınır:

- `PUBLISHED` durumundaki yazılar.
- Soft delete edilmemiş yazılar.

Taslak veya silinmiş yazıların etiketleri public alana çıkmaz.

## Eklenen Backend Yardımcısı

Eklenen fonksiyon:

- `getTrendingTags(limit = 10)`

Dosya:

- `src/actions/tagActions.ts`

Sıralama:

1. Etikete bağlı yayınlanmış yazı sayısı.
2. En yeni yazı tarihi.
3. Etiket adı.

## Eklenen UI Bileşeni

Yeni bileşen:

- `src/components/home/TrendingTopics.tsx`

Davranış:

- Etiket yoksa hiçbir şey göstermez.
- Etiket varsa yatay kaydırılabilir bir Güncel Konular satırı gösterir.
- Her konu `#etiket` biçiminde görünür.
- Yanında kaç yazıda kullanıldığı görünür.
- Tıklanınca `/arama?q=etiket` sayfasına gider.

## Ana Sayfa Entegrasyonu

Güncel Konular alanı ana sayfada hero alanından sonra gösterilir.

Değişen dosya:

- `src/app/page.tsx`

Boş içerik durumunda da bileşen çağrılır; ancak etiket yoksa görünmez.

## Kontrol Sonuçları

- `npm run lint` başarılı.
- `npx tsc --noEmit` başarılı.
- Yerelde `/` 200 döndü.

Not:

- Şu an mevcut yazılarda etiket olmadığı için Güncel Konular alanı görünmeyebilir. Bu beklenen davranıştır.
- Admin yazılarına etiket eklendikçe alan otomatik dolacaktır.

## Tamamlanamayan Kontroller

- `npm run build` hâlâ Windows `EPERM` Prisma DLL kilidine takılıyor.
- `npx tsx` ile manuel helper kontrolü de Windows `spawn EPERM` hatasına takıldı.

## Sıradaki Kullanıcı Odaklı Adım

Sıradaki mantıklı adım:

- Ana sayfa keşif alanlarını güçlendirme.

Önerilen alt işler:

1. `En Çok Yorumlananlar` alanı.
2. `En Çok Beğenilenler` alanı.
3. `Editörün Seçtikleri` işareti veya alanı.
4. Yazı detayına okuma süresi eklemek.

