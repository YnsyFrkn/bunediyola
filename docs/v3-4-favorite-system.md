# bunediyola v3.4 Favorite System

Bu dokuman v3.4 kapsaminda eklenen favori/kaydetme sistemini anlatir.

## Kapsam

v3.4 ile eklenenler:

- `Favorite` Prisma modeli.
- Yazilara `Kaydet` / `Kaydedildi` butonu.
- Ayni kullanicinin ayni yaziyi sadece 1 kez kaydedebilmesi.
- Kaydedilen yaziyi kaydedilenlerden cikarma, yani toggle davranisi.
- Profilde kullanicinin kaydettigi yazilari gormesi.
- Profil favoriler sayfasinda yaziyi kaydedilenlerden cikarma aksiyonu.
- Giris yapmayan kullanicilar icin giris cagrisi.
- User menu ve profil ana sayfasinda `Kaydettiklerim` linki.

## Yeni Route'lar

| Route | Amac |
| --- | --- |
| `/profil/favorites` | Kullanici kendi kaydettigi yazilar |

Guncellenen route'lar:

- `/yazi/[slug]`: Yazi basligi altinda like butonunun yaninda kaydet butonu gosterir.
- `/profil`: `Kaydettiklerim` linki eklendi.

## Yeni Dosyalar

- `src/actions/favoriteActions.ts`
- `src/components/favorite/FavoriteButton.tsx`
- `src/app/profil/favorites/page.tsx`
- `docs/v3-4-favorite-system.md`

Guncellenen dosyalar:

- `prisma/schema.prisma`
- `src/components/post/PostDetail.tsx`
- `src/app/profil/page.tsx`
- `src/components/auth/UserMenu.tsx`
- `docs/database-schema.md`

## Veritabani

Yeni model:

```prisma
model Favorite {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([postId, userId])
  @@index([userId, createdAt])
  @@index([postId, createdAt])
}
```

Guncellenen iliskiler:

- `Post.favorites`
- `User.favorites`

Migration:

- `20260426171012_add_favorites`

## Favori Kurallari

`toggleFavorite` su kontrolleri yapar:

- Kullanici giris yapmis olmali.
- `userId` client'tan alinmaz, session icinden alinir.
- Post gercekten var olmali.
- Post `PUBLISHED` olmali.
- Post soft delete edilmemis olmali.
- Favorite varsa silinir.
- Favorite yoksa olusturulur.

Veritabani seviyesinde ayni kullanicinin ayni yaziyi iki kez kaydetmesi engellenir:

```prisma
@@unique([postId, userId])
```

Basarili toggle sonrasi revalidate edilen path'ler:

- `/yazi/[slug]`
- `/profil`
- `/profil/favorites`

## Server Actions

Dosya:

```txt
src/actions/favoriteActions.ts
```

Fonksiyonlar:

- `toggleFavorite(postId, prevState, formData)`
- `getFavoriteCount(postId)`
- `getUserFavoritePosts(userId)`
- `isPostFavoritedByUser(postId, userId)`

## Public Kaydet Alani

`FavoriteButton`, yazi detayinda calisir.

Gorevleri:

- Kullanici yaziyi kaydetmediyse `Kaydet` gosterir.
- Kullanici yaziyi kaydettiyse `Kaydedildi` gosterir.
- Kullanici tekrar basarsa yaziyi kaydedilenlerden cikarir.
- Giris yoksa `/giris?callbackUrl=/yazi/[slug]` linki gosterir.

Like ve Favorite ayri tutulur:

- Like: icerigi begendim.
- Favorite: icerigi sonra okumak icin kaydettim.

## Profil Kaydettikleri

Route:

```txt
/profil/favorites
```

Giris yoksa:

```txt
/giris?callbackUrl=/profil/favorites
```

Kullanici sadece kendi kaydettigi, yayinda olan ve silinmemis yazilari gorur.

Sayfada:

- Yazinin basligi.
- Kategorisi.
- Ozeti.
- Kaydedilme tarihi.
- `Yaziya Git` linki.
- Kaydedilenlerden cikarma butonu.

## Admin Panel Karari

v3.4 kapsaminda admin paneline favori yonetimi eklenmedi.

Sebep:

- Favoriler kullaniciya ait kisisel listedir.
- Bu surumun hedefi public ve profil deneyimini tamamlamaktir.

Ileride eklenebilecek admin metrikleri:

- Toplam favori sayisi.
- En cok kaydedilen yazilar.
- Yazilar tablosunda favori sayisi kolonu.

## Guvenlik

- Favori icin session gerekir.
- `userId` formdan alinmaz.
- Draft ve silinmis yazilar favoriye eklenemez.
- Favori tekilligi DB unique constraint ile garanti edilir.
- Post veya User silinirse ilgili favoriler cascade ile silinir.

## Dogrulama Komutlari

```bash
npx prisma migrate dev --name add_favorites
npx prisma generate
npm run lint
npm run build
```

Son kontrolde `lint` ve `build` temiz gecmistir.

## Son Kontrolde Yapilan Ek Duzeltmeler

Favori sistemi sonrasi header alaninda kullanici menusu genislediginden orta genislikteki ekranlarda
bazi buton metinleri iki satira kiriliyordu.

Duzeltilenler:

- Desktop header breakpoint'i `lg` yerine `xl` olarak ayarlandi.
- `xl` altinda hamburger menu kullanilacak sekilde davranis netlestirildi.
- Header kategori linkleri ve aksiyon butonlarina `whitespace-nowrap` eklendi.
- `Profilim`, `Kaydettiklerim`, `Cikis Yap` ve `Yeni Icerikler` butonlari tek satirda kalacak hale getirildi.

Guncellenen dosyalar:

- `src/components/layout/Header.tsx`
- `src/components/auth/UserMenu.tsx`

Kontrol:

- `npm run lint`
- `npm run build`

Iki komut da temiz gecmistir.

## Ek Iyilestirme Kontrolu

`bunediyolav3-4-favorite-improvements.md` dokumanindaki maddeler kontrol edildi.

Zaten karsilananlar:

- `/profil/favorites` listesi `createdAt desc` ile en son kaydedileni en ustte gosterir.
- `getUserFavoritePosts`, sadece `status = PUBLISHED` ve `deletedAt = null` yazilari listeler.
- Empty state, bos favori listesinde aciklama ve `/` linkli kesfet butonu gosterir.
- `Favorite` iliskilerinde `onDelete: Cascade` vardir.

Bu kontrolde ek iyilestirilenler:

- `FavoriteButton`, profil favorilerinde compact kullanimda da kisa islem mesajini gosterir.
- `FavoriteButton` icin `aria-label` eklendi.
- `LikeButton` icindeki bozuk kalp karakteri kaldirildi.
- `LikeButton` metni `Begen 12` / `Begenildi 12` seklinde netlestirildi.
- Like ve Favorite ayrimi metin ve renk ile daha belirgin hale getirildi.

Dokuman notu olarak kalanlar:

- `Post.favoriteCount` denormalized sayac alanina su an gerek yoktur.
- `/profil/favorites` pagination/infinite scroll bu veri hacminde gerekli degildir.

## Final Production Polish

`bunediyolav3-4-final-polish.md` dokumanindaki son kalite basliklari kontrol edildi.

Kodda karsilananlar:

- Double click edge case icin `FavoriteButton`, islem sirasinda `disabled={isPending}` kullanir.
- Islem sirasinda buton metni `Kaydediliyor...` olur.
- `FavoriteButton`, `aria-pressed` ile kayit durumunu ekran okuyucuya aktarir.
- `FavoriteButton`, duruma gore `aria-label` kullanir.
- Butonda sadece ikon yoktur; `Kaydet` / `Kaydedildi` metni vardir.
- `/profil/favorites`, sadece oturumdaki kullanicinin favorilerini listeler.
- Admin panelde kullanicilarin kisisel favori listeleri gosterilmez.
- Beklenmeyen favorite action hatalarinda teknik hata mesaji gosterilmez; sade hata mesaji doner.

Eklenen sade hata mesaji:

```txt
Bir sorun olustu. Lutfen tekrar dene.
```

Gelecek notu olarak kalanlar:

- Favorite toggle icin rate limit canliya cikmadan once degerlendirilebilir.
- Optimistic UI daha hizli his icin ileride eklenebilir.
- Favorite add/remove olaylari analytics asamasinda loglanabilir.
- Admin panelde sadece anonim/toplu favori metrikleri dusunulmelidir.

Privacy notu:

- Favoriler kullaniciya ait kisisel liste kabul edilir.
- Baska kullanicilar bir kullanicinin favorilerini gorememelidir.
- Admin panelde tekil kullanici favori listesi gereksiz yere acilmamalidir.

Production test checklist:

- FavoriteButton islem sirasinda cift tiklamada bozulmuyor mu?
- Ayni kullanici hizli tiklasa bile duplicate favorite olusmuyor mu?
- Favorite action hata donerse kullanici sade hata mesaji goruyor mu?
- Kaydet / Kaydedildi state'i gorsel olarak net mi?
- Buton klavye ile kullanilabiliyor mu?
- Focus state gorunur mu?
- `/profil/favorites` sadece kendi favorilerini gosteriyor mu?
- Admin panel kisisel favori verisini gereksiz gostermiyor mu?

## Sonraki Asama

v3.5 icin mantikli sonraki konu profil deneyimini toparlamaktir:

- Profil ozet dashboard.
- Yorumlarim, Begendiklerim, Kaydettiklerim alanlarini tek merkezden sunma.
- Hesap bilgileri.
- Basit profil duzenleme.
