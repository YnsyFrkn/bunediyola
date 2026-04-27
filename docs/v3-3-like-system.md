# bunediyola v3.3 Like System

Bu dokuman v3.3 kapsaminda eklenen begeni sistemini anlatir.

## Kapsam

v3.3 ile eklenenler:

- `Like` Prisma modeli.
- Yazilara begeni butonu.
- Ayni kullanicinin ayni yaziyi sadece 1 kez begenebilmesi.
- Begeni geri alma, yani toggle davranisi.
- Yazi detayinda begeni sayisi.
- Giris yapmayan kullanicilar icin giris cagrisi.
- Profilde kullanicinin begendigi yazilari gormesi.

## Yeni Route'lar

| Route | Amac |
| --- | --- |
| `/profil/likes` | Kullanici kendi begendigi yazilar |

Guncellenen route'lar:

- `/yazi/[slug]`: Yazi basligi altinda begeni butonu ve sayisi gosterir.
- `/profil`: `Begendiklerim` linki eklendi.

## Yeni Dosyalar

- `src/actions/likeActions.ts`
- `src/components/like/LikeButton.tsx`
- `src/app/profil/likes/page.tsx`
- `docs/v3-3-like-system.md`

Guncellenen dosyalar:

- `prisma/schema.prisma`
- `src/components/post/PostDetail.tsx`
- `src/app/profil/page.tsx`
- `docs/database-schema.md`

## Veritabani

Yeni model:

```prisma
model Like {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([postId, userId])
  @@index([userId, createdAt])
}
```

Guncellenen iliskiler:

- `Post.likes`
- `User.likes`

Migration:

- `20260426163641_add_likes`

## Begeni Kurallari

`toggleLike` su kontrolleri yapar:

- Kullanici giris yapmis olmali.
- `userId` client'tan alinmaz, session icinden alinir.
- Post gercekten var olmali.
- Post `PUBLISHED` olmali.
- Post soft delete edilmemis olmali.
- Like varsa silinir.
- Like yoksa olusturulur.

Veritabani seviyesinde ayni kullanicinin ayni yaziyi iki kez begenmesi engellenir:

```prisma
@@unique([postId, userId])
```

Basarili toggle sonrasi revalidate edilen path'ler:

- `/yazi/[slug]`
- `/profil`
- `/profil/likes`

## Server Actions

Dosya:

```txt
src/actions/likeActions.ts
```

Fonksiyonlar:

- `toggleLike(postId, prevState, formData)`
- `getLikeCount(postId)`
- `getUserLikedPosts(userId)`
- `isPostLikedByUser(postId, userId)`

## Public Begeni Alani

`LikeButton`, yazi detayinda calisir.

Gorevleri:

- Mevcut begeni sayisini gosterir.
- Kullanici yaziyi begendiyse kirmizi durum gosterir.
- Kullanici tekrar basarsa begeniyi geri alir.
- Giris yoksa `/giris?callbackUrl=/yazi/[slug]` linki gosterir.

## Profil Begendikleri

Route:

```txt
/profil/likes
```

Giris yoksa:

```txt
/giris?callbackUrl=/profil/likes
```

Kullanici sadece kendi begendigi, yayinda olan ve silinmemis yazilari gorur.

## Guvenlik

- Begeni icin session gerekir.
- `userId` formdan alinmaz.
- Draft ve silinmis yazilar begenilemez.
- Begeni tekilligi DB unique constraint ile garanti edilir.
- Post veya User silinirse ilgili begeniler cascade ile silinir.

## Admin Panel Karari

v3.3 kapsaminda admin paneline detayli begeni yonetimi eklenmedi.

Sonraki mantikli admin adimi:

- Admin dashboard'da toplam begeni karti.
- Admin yazilar listesinde begeni sayisi kolonu.
- En cok begenilen yazilar bolumu.

Yorum begenisi bu surumde eklenmedi. Gerekirse ayri bir `CommentLike` modeliyle sonraki surumde ele alinabilir.

## Dogrulama Komutlari

```bash
npx prisma migrate dev --name add_likes
npx prisma generate
npm run lint
npm run build
```

Son kontrolde `lint` ve `build` temiz gecmistir. `Like` tablosunun veritabaninda olustugu ayrica dogrulanmistir.

## Sonraki Asama

v3.4 icin mantikli sonraki konu favori/kaydetme sistemidir.
