# bunediyola v3.7 Recommendation System

Bu dokuman v3.7 kapsaminda eklenen rule-based `Senin Icin` oneri sistemini anlatir.

## Kapsam

v3.7 ile eklenenler:

- Kullanici davranisina gore ilgi profili cikarma.
- Kategori bazli icerik onerisi.
- Ana sayfada `Senin Icin` bolumu.
- Girisli kullanici icin kisisel oneri.
- Girissiz kullanici icin populer icerik fallback'i.
- Daha once etkilesim yapilan icerikleri oneriden cikarma.
- Empty state.

## Sinyaller

Kullanici ilgi profili su sinyallerden hesaplanir:

```txt
Like      -> +1
Comment   -> +2
Favorite  -> +3
```

Bu sinyaller kullanicinin etkilesim yaptigi yazilarin kategorilerine agirlik olarak eklenir.

## Tag Karari

Brief icinde tag uyumu da geciyor.

Mevcut projede henuz tag modeli veya post-tag iliskisi olmadigi icin v3.7 ilk surumde tag uyumu uygulanmadi.

Gelecekte tag sistemi eklenirse oneri skoru su sekilde genisletilebilir:

```txt
score = kategoriUyumu + tagUyumu + populerlikBonus
```

## Oneri Skoru

Mevcut v3.7 skoru:

```txt
kategoriUyumu + populerlikBonus
```

Kurallar:

- Kategori uyumu varsa temel +5 puan.
- Kullanici kategori agirligi skora eklenir.
- Populerlik bonusu: `(likeCount + commentCount + favoriteCount) / 10`

## Veri Kurallari

Sadece su yazilar onerilir:

- `status = PUBLISHED`
- `deletedAt = null`
- `createdAt` son 30 gun icinde

Oneriden cikarilanlar:

- Kullanicinin daha once begendigi yazilar.
- Kullanicinin daha once yorum yaptigi yazilar.
- Kullanicinin daha once kaydettigi yazilar.

## Limit

Server action maksimum 10 oneri doner.

Ana sayfada ilk 6 oneri kart olarak gosterilir.

## Siralama ve Kalite Esigi

Oneriler su sirayla listelenir:

```txt
score desc
createdAt desc
```

Minimum skor:

```txt
score >= 5
```

Bu esik dusuk kaliteli veya zayif uyumlu onerilerin listede gorunmesini azaltir.

## Cesitlilik

Tek kategorinin listeyi domine etmemesi icin ayni kategoriden en fazla 3 oneri gosterilir.

## Yeni Dosyalar

- `src/actions/recommendationActions.ts`
- `src/components/home/RecommendedSection.tsx`
- `docs/v3-7-recommendation-system.md`

Guncellenen dosyalar:

- `src/app/page.tsx`

## Server Actions

Dosya:

```txt
src/actions/recommendationActions.ts
```

Fonksiyonlar:

- `getUserInterestProfile`
- `getRecommendedPosts`
- `calculateRecommendationScore`

`calculateRecommendationScore`, Next.js Server Actions kurali nedeniyle async export edilir. Dosya icinde runtime hesaplama icin senkron helper kullanilir.

## UI

Dosya:

```txt
src/components/home/RecommendedSection.tsx
```

Baslik:

```txt
Senin Icin
```

Girisli kullanicida:

```txt
Ilgi alanlarina yakin yazilar
```

Girissiz kullanicida:

```txt
Baslamak icin populer secimler
```

Kartlarda:

- gorsel
- kategori
- baslik
- ozet
- uyum skoru

## Girissiz Kullanici

Girissiz kullanicida kisisel sinyal olmadigi icin haftalik populer icerikler fallback olarak gosterilir.

## Empty State

Oneri ve fallback yoksa:

```txt
Senin icin oneri yok
```

Alt mesaj:

```txt
Icerikleri begenerek ve kaydederek onerileri gelistirebilirsin.
```

## Performance

Baslangic surumunde oneriler runtime hesaplanir.

Gelecek iyilestirmeler:

- cache
- precompute
- tag tabanli genisletme
- embedding veya AI destekli oneri

## Eksiklerin Giderilmesi Kontrolu

`bunediyolav3-7-eksiklerin-giderilmesi.md` dokumanindaki maddeler kontrol edildi.

Kodda karsilananlar:

- Oneriler `score desc`, esit skorda `createdAt desc` ile siralanir.
- Son 30 gun filtresi uygulanir.
- Minimum skor esigi `score >= 5` olarak uygulanir.
- Empty state icinde `/` linkli `Icerikleri Kesfet` butonu vardir.
- Cold start durumunda haftalik populer icerikler fallback olarak gosterilir.
- Cesitlilik icin kategori basina en fazla 3 oneri siniri vardir.

Gelecek notu olarak kalanlar:

- Cache, precompute ve ISR trafik arttiginda degerlendirilebilir.

## Dogrulama Komutlari

```bash
npm run lint
npm run build
```

Son kontrolde iki komut da temiz gecmistir.

## Sonraki Asama

Onerilen sonraki baslik:

- v4 SEO, performans ve yayin hazirligi.
