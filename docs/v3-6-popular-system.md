# bunediyola v3.6 Popular System

Bu dokuman v3.6 kapsaminda eklenen populer icerikler sistemini anlatir.

## Kapsam

v3.6 ile eklenenler:

- Etkilesim skoruna dayali populer icerik hesaplama.
- Gunluk populer liste.
- Haftalik populer liste.
- Ana sayfada populer icerikler bolumu.
- Like, yorum ve favori sayilarini gosteren populer kartlari.
- Populer icerikler icin empty state.

## Algoritma

Populerlik skoru:

```txt
score = likeCount * 1 + commentCount * 2 + favoriteCount * 3
```

Agirliklar:

- Begeni: 1 puan.
- Yorum: 2 puan.
- Kaydetme: 3 puan.

Kaydetme daha yuksek agirlik alir; cunku kullanicinin icerigi sonra okumak icin ayirmasi daha guclu bir niyet kabul edilir.

## Zaman Pencereleri

Gunluk populer:

```txt
Son 24 saatte gelen etkilesimler
```

Haftalik populer:

```txt
Son 7 gunde gelen etkilesimler
```

Not:

- Zaman filtresi post olusturma tarihine gore degil, etkilesimlerin `createdAt` tarihine gore uygulanir.
- Bu davranis trend mantigina daha uygundur.

## Veri Kurallari

Sadece su yazilar listeye girebilir:

- `status = PUBLISHED`
- `deletedAt = null`

Yorum sayisinda sadece public yorumlar dikkate alinir:

- `status = VISIBLE`
- `deletedAt = null`

Skoru `5` altinda olan yazilar populer listede gosterilmez.

## Yeni Dosyalar

- `src/actions/popularActions.ts`
- `src/components/home/PopularSection.tsx`
- `docs/v3-6-popular-system.md`

Guncellenen dosyalar:

- `src/app/page.tsx`

## Server Actions

Dosya:

```txt
src/actions/popularActions.ts
```

Fonksiyonlar:

- `calculatePostScore`
- `getPopularPostsDaily`
- `getPopularPostsWeekly`

`calculatePostScore`, Next.js Server Actions kurali nedeniyle async export edilir. Dosya icinde runtime hesaplama icin senkron helper kullanilir.

## UI

Dosya:

```txt
src/components/home/PopularSection.tsx
```

Ana sayfada iki liste gosterir:

- `Bugun Populer`
- `Bu Hafta Populer`

Kartlarda:

- sira numarasi
- gorsel
- kategori
- baslik
- ozet
- skor
- begeni sayisi
- yorum sayisi
- kaydetme sayisi

## Ana Sayfa Davranisi

Ana sayfa v3.6 ile dinamik render edilir:

```ts
export const dynamic = "force-dynamic";
```

Sebep:

- Populer listeler kullanici etkilesimlerinden hesaplanir.
- Sayfanin build aninda statik kalmasi trend verisini bayatlatir.

## Performance

Baslangic surumunde populerlik runtime hesaplanir.

Gelecek iyilestirmeler:

- cache
- cron job
- Redis
- denormalized skor tablosu
- ISR veya cache layer. Ornek gelecek ayar: `export const revalidate = 60`

## Empty State

Etkilesim yoksa:

```txt
Henuz populer icerik yok
```

Alt aciklama:

```txt
Begeni, yorum ve kaydetme hareketleri arttikca trend yazilar burada gorunecek.
```

Empty state icinde `/` linkli `Icerikleri Kesfet` butonu gosterilir.

## Eksiklerin Giderilmesi Kontrolu

`bunediyolav3-6-eksiklerin-giderilmesi.md` dokumanindaki maddeler kontrol edildi.

Kodda karsilananlar:

- Populer listeler maksimum 10 icerik ile sinirlidir.
- Siralama once `score desc`, esit skor durumunda `createdAt desc` mantigiyla yapilir.
- Minimum skor esigi `score >= 5` olarak uygulanir.
- Empty state icine `Icerikleri Kesfet` linki eklendi.
- Ayni icerigin hem gunluk hem haftalik listede gorunmesi beklenen davranistir.

Gelecek notu olarak kalanlar:

- Su an ana sayfa `force-dynamic` ile canli hesaplama yapar.
- Trafik arttiginda ISR, cache layer, cron job veya Redis stratejisi degerlendirilebilir.

## Dogrulama Komutlari

```bash
npm run lint
npm run build
```

Son kontrolde iki komut da temiz gecmistir.

## Sonraki Asama

Onerilen sonraki basliklar:

- v3.7 oneri sistemi.
- v4 SEO, performans ve yayin hazirligi.
