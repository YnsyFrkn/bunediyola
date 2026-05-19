# Kullanıcı Eksikleri - Okuma Süresi İlerleme Notu

Bu doküman kullanıcı tarafındaki eksikleri kapatma sırasının üçüncü adımı olan okuma süresi bilgisini kaydetmek için oluşturuldu.

## Amaç

Kullanıcı bir yazıya başlamadan önce yaklaşık ne kadar zaman ayıracağını görebilmeli.

Bu küçük bilgi özellikle içerik sitelerinde kalite hissini artırır:

- Kullanıcı beklentisini ayarlar.
- Kısa içerikler daha kolay tıklanır.
- Uzun içerikler kullanıcıya önceden sinyal verir.

## Eklenen Yardımcı

Yeni dosya:

- `src/utils/readingTime.ts`

Fonksiyonlar:

- `getReadingTimeMinutes(content)`
- `formatReadingTime(minutes)`

Hesaplama:

- Ortalama 220 kelime/dakika kabul edilir.
- Minimum 1 dakika gösterilir.

## Public Post Verisi

Public post verisine `readingTimeMinutes` alanı eklendi.

Değişen dosyalar:

- `src/lib/content.ts`
- `src/types/post.ts`

Not:

- Alan tipte opsiyonel bırakıldı. Böylece eski mock veriler ve elle map edilen profil alanları kırılmaz.
- Gerçek public içerik verisi `getPublicPosts()` üzerinden hesaplanmış okuma süresiyle gelir.

## Gösterilen Alanlar

Okuma süresi şu alanlarda gösterilir:

- Ana sayfa hero yazısı.
- Ana sayfa hero yan yazıları.
- Yazı kartları.
- Yazı detay sayfası.

Değişen dosyalar:

- `src/components/home/HeroSection.tsx`
- `src/components/post/PostCard.tsx`
- `src/components/post/PostDetail.tsx`

## Kontrol Sonuçları

- `npm run lint` başarılı.
- `npx tsc --noEmit` başarılı.
- Yerelde `/` 200 döndü.
- Ana sayfa HTML içinde `dk okuma` metni görüldü.

## Tamamlanamayan Kontrol

- `npm run build` hâlâ Windows `EPERM` Prisma DLL kilidine takılıyor.

Build hatası:

- `node_modules/.prisma/client/query_engine-windows.dll.node` dosyası yeniden adlandırılırken kilit/izin hatası oluşuyor.

## Sıradaki Kullanıcı Odaklı Adım

Sıradaki mantıklı adım:

- Ana sayfada keşif alanlarını güçlendirmek.

Önerilen başlangıç:

1. `En Çok Yorumlananlar`
2. `En Çok Beğenilenler`
3. `Editörün Seçtikleri`

