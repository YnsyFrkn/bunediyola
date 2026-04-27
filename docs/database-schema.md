# Veritabani Tablo Dokumani

Bu dokuman v2 sonundaki PostgreSQL + Prisma veri modelini anlatir. Kaynak model dosyasi `prisma/schema.prisma`, SQL migration dosyalari `prisma/migrations` altindadir.

## Category

Kategori bilgilerini tutar.

| Alan | Tip | Aciklama |
| --- | --- | --- |
| `id` | `String` | Primary key. Prisma `cuid()` ile olusur. |
| `name` | `String` | Kategori adi. |
| `slug` | `String` | URL icin benzersiz kategori slug'i. Unique index vardir. |
| `description` | `String?` | Kategori aciklamasi. Bos olabilir. |
| `deletedAt` | `DateTime?` | Soft delete zamani. `null` ise kategori aktiftir. |
| `createdAt` | `DateTime` | Kaydin olusma zamani. |
| `updatedAt` | `DateTime` | Kaydin son guncellenme zamani. |

Iliskiler:

- `Category.posts` alanindan kategoriye bagli yazilar okunur.
- `Post.categoryId`, `Category.id` alanina foreign key ile baglidir.

## Post

Yazi/icerik bilgilerini tutar.

| Alan | Tip | Aciklama |
| --- | --- | --- |
| `id` | `String` | Primary key. Prisma `cuid()` ile olusur. |
| `title` | `String` | Yazi basligi. |
| `slug` | `String` | URL icin benzersiz yazi slug'i. Unique index vardir. |
| `summary` | `String` | Liste ve kartlarda gosterilen kisa ozet. |
| `content` | `String` | Yazi detay metni. |
| `coverImage` | `String?` | Kapak gorseli yolu. Bos olursa uygulama varsayilan gorsel kullanabilir. |
| `author` | `String` | Yazar adi. Varsayilan: `bunediyola ekibi`. |
| `status` | `PostStatus` | `DRAFT` veya `PUBLISHED`. |
| `viewCount` | `Int` | Goruntulenme/populerlik sayaci. Varsayilan: `0`. |
| `categoryId` | `String` | Bagli kategorinin `id` degeri. |
| `deletedAt` | `DateTime?` | Soft delete zamani. `null` ise yazi aktiftir. |
| `createdAt` | `DateTime` | Kaydin olusma zamani. |
| `updatedAt` | `DateTime` | Kaydin son guncellenme zamani. |

Iliskiler:

- `Post.category`, ilgili `Category` kaydina baglanir.
- Kategori silinirken aktif yazisi varsa uygulama silmeyi engeller.

## User

Admin ve kullanici hesaplarini tutar.

| Alan | Tip | Aciklama |
| --- | --- | --- |
| `id` | `String` | Primary key. Prisma `cuid()` ile olusur. |
| `name` | `String?` | Kullanici adi. Bos olabilir. |
| `email` | `String` | Login email adresi. Unique index vardir. |
| `passwordHash` | `String` | Hashlenmis sifre. Duz sifre burada tutulmaz. |
| `role` | `UserRole` | `ADMIN` veya `USER`. Admin panel icin `ADMIN` gerekir. |
| `createdAt` | `DateTime` | Kaydin olusma zamani. |
| `updatedAt` | `DateTime` | Kaydin son guncellenme zamani. |

Notlar:

- Ilk admin hesabi `prisma/seed.ts` ile `.env` icindeki `ADMIN_EMAIL` ve `ADMIN_PASSWORD` degerlerinden olusturulur.
- `ADMIN_PASSWORD`, `src/lib/password.ts` icindeki `hashPassword` ile hashlenir ve `passwordHash` olarak yazilir.
- Login sirasinda `src/lib/auth.ts`, girilen sifreyi `passwordHash` ile karsilastirir.

## Comment

Yazilara yapilan kullanici yorumlarini tutar.

| Alan | Tip | Aciklama |
| --- | --- | --- |
| `id` | `String` | Primary key. Prisma `cuid()` ile olusur. |
| `content` | `String` | Yorum metni. |
| `postId` | `String` | Yorumun bagli oldugu yazi id degeri. |
| `userId` | `String` | Yorumu yazan kullanici id degeri. |
| `status` | `CommentStatus` | `VISIBLE` veya `HIDDEN`. |
| `deletedAt` | `DateTime?` | Admin tarafindan gizleme/soft delete zamani. `null` ise aktif olabilir. |
| `createdAt` | `DateTime` | Yorumun olusma zamani. |
| `updatedAt` | `DateTime` | Yorumun son guncellenme zamani. |

Iliskiler:

- `Comment.post`, ilgili `Post` kaydina baglanir.
- `Comment.user`, ilgili `User` kaydina baglanir.
- Public tarafta sadece `status = VISIBLE` ve `deletedAt = null` yorumlar gosterilir.

## Like

Yazilara yapilan kullanici begenilerini tutar.

| Alan | Tip | Aciklama |
| --- | --- | --- |
| `id` | `String` | Primary key. Prisma `cuid()` ile olusur. |
| `postId` | `String` | Begenilen yazi id degeri. |
| `userId` | `String` | Begenen kullanici id degeri. |
| `createdAt` | `DateTime` | Begeninin olusma zamani. |

Iliskiler:

- `Like.post`, ilgili `Post` kaydina baglanir.
- `Like.user`, ilgili `User` kaydina baglanir.
- Post veya User silinirse ilgili begeniler cascade ile silinir.

Indexler:

- `postId, userId`: Unique constraint. Bir kullanici ayni yaziyi sadece 1 kez begenebilir.
- `userId, createdAt`: Profilde kullanicinin begendigi yazilari hizli listelemek icin.

## Favorite

Yazilara yapilan kullanici kaydetme/favori islemlerini tutar.

| Alan | Tip | Aciklama |
| --- | --- | --- |
| `id` | `String` | Primary key. Prisma `cuid()` ile olusur. |
| `postId` | `String` | Kaydedilen yazi id degeri. |
| `userId` | `String` | Yaziyi kaydeden kullanici id degeri. |
| `createdAt` | `DateTime` | Kaydetme zamanidir. |

Iliskiler:

- `Favorite.post`, ilgili `Post` kaydina baglanir.
- `Favorite.user`, ilgili `User` kaydina baglanir.
- Post veya User silinirse ilgili favoriler cascade ile silinir.

Indexler:

- `postId, userId`: Unique constraint. Bir kullanici ayni yaziyi sadece 1 kez kaydedebilir.
- `userId, createdAt`: Profilde kullanicinin kaydettigi yazilari hizli listelemek icin.
- `postId, createdAt`: Ileride yazi bazli kaydetme metrikleri icin.

## PasswordResetToken

Sifremi unuttum akisinda tek kullanimlik sifre sifirlama tokenlarini tutar.

| Alan | Tip | Aciklama |
| --- | --- | --- |
| `id` | `String` | Primary key. Prisma `cuid()` ile olusur. |
| `email` | `String` | Sifre sifirlama isteyen kullanicinin email adresi. |
| `tokenHash` | `String` | Maildeki raw tokenin SHA-256 hash degeri. Unique index vardir. |
| `ipAddress` | `String?` | Sifre sifirlama isteginin geldigi IP adresi. Bos olabilir. |
| `expiresAt` | `DateTime` | Tokenin gecerlilik bitis zamani. |
| `createdAt` | `DateTime` | Tokenin olusma zamani. |

Indexler:

- `tokenHash`: Unique constraint. Her sifirlama linki benzersizdir, raw token DB'de tutulmaz.
- `email, createdAt`: Ayni email icin son tokenlari hizli bulmak ve temizlemek icin.
- `ipAddress, createdAt`: IP bazli sifre sifirlama incelemeleri icin.
- `expiresAt`: Suresi dolan tokenlari hizli tespit etmek icin.

Notlar:

- Token olusturuldugunda ayni email icin aktif eski tokenlar gecersiz hale getirilir.
- Token basarili sifre degisiminden sonra silinir, tekrar kullanilamaz.
- Token suresi 30 dakikadir.
- Suresi dolan tokenlar sifre sifirlama isteklerinde otomatik temizlenir.

## PasswordResetRequest

Sifre sifirlama istekleri icin rate limit kayitlarini tutar.

| Alan | Tip | Aciklama |
| --- | --- | --- |
| `id` | `String` | Primary key. Prisma `cuid()` ile olusur. |
| `email` | `String` | Sifre sifirlama formuna yazilan email adresi. |
| `ipAddress` | `String?` | Istegin geldigi IP adresi. Bos olabilir. |
| `createdAt` | `DateTime` | Istegin olusma zamani. |

Indexler:

- `email, createdAt`: Ayni email icin 15 dakikada maksimum 3 istek kontrolu.
- `ipAddress, createdAt`: Ayni IP icin 15 dakikada maksimum 5 istek kontrolu.
- `createdAt`: Eski rate limit kayitlarini temizlemek icin.

## LoginAttempt

Admin login denemelerini ve deneme limitini tutar.

| Alan | Tip | Aciklama |
| --- | --- | --- |
| `id` | `String` | Primary key. Prisma `cuid()` ile olusur. |
| `email` | `String` | Login denenirken girilen email adresi. |
| `success` | `Boolean` | Deneme basarili mi? |
| `reason` | `String` | Deneme sonucu. Ornekler: `SUCCESS`, `UNKNOWN_EMAIL`, `NOT_ALLOWED_FOR_LOGIN_TYPE`, `INVALID_PASSWORD`, `RATE_LIMITED`. |
| `ipAddress` | `String?` | `x-forwarded-for` veya `x-real-ip` header'indan okunan IP. Bos olabilir. |
| `userAgent` | `String?` | Tarayici/istemci user-agent bilgisi. Bos olabilir. |
| `createdAt` | `DateTime` | Denemenin zamani. |

Indexler:

- `email, createdAt`: Email bazli deneme limitini hizli kontrol etmek icin.
- `success, createdAt`: Basarili/basarisiz giris analizleri icin.

## Enum Degerleri

`PostStatus`:

- `DRAFT`: Taslak yazi.
- `PUBLISHED`: Yayindaki yazi.

`UserRole`:

- `ADMIN`: Admin panel yetkisi olan kullanici.
- `USER`: Standart kullanici rolu.

`CommentStatus`:

- `VISIBLE`: Public tarafta gorunen yorum.
- `HIDDEN`: Admin tarafindan gizlenmis yorum.

## Migration Dosyalari

- `20260424183819_init_v2`: `Category`, `Post`, `PostStatus` ve temel iliski yapisini olusturur.
- `20260424192925_soft_delete_undo`: `Category.deletedAt` ve `Post.deletedAt` alanlarini ekler.
- `20260424201631_add_user_auth`: `User`, `UserRole` ve login icin `passwordHash` alanini ekler.
- `20260426150628_login_attempts`: `LoginAttempt` tablosunu ve indexlerini ekler.
- `20260426155218_add_comments`: `Comment`, `CommentStatus` ve post/user iliskilerini ekler.
- `20260426163641_add_likes`: `Like` tablosunu, post/user iliskilerini ve unique begeni constraint'ini ekler.
- `20260426171012_add_favorites`: `Favorite` tablosunu, post/user iliskilerini ve unique kaydetme constraint'ini ekler.
- `20260426212824_add_password_reset_tokens`: `PasswordResetToken` tablosunu, unique token constraint'ini ve sure/email indexlerini ekler.
- `20260426224500_harden_password_reset`: Token alanini `tokenHash` olarak guvenlendirir, IP alanini ve `PasswordResetRequest` rate limit tablosunu ekler.
- `20260426225500_invalidate_legacy_password_reset_tokens`: Hashleme oncesinden kalabilecek eski reset linklerini gecersiz hale getirir.

## Veri Nerede Kullaniliyor?

- Public site icerikleri: `src/lib/content.ts`, `src/actions/postActions.ts`, `src/actions/categoryActions.ts`
- Admin post islemleri: `src/app/admin/posts/*`, `src/components/admin/PostForm.tsx`
- Admin kategori islemleri: `src/app/admin/categories/*`, `src/components/admin/CategoryForm.tsx`
- Admin login: `src/app/login/page.tsx`, `src/components/auth/LoginForm.tsx`, `src/lib/auth.ts`
- Yorum islemleri: `src/actions/commentActions.ts`, `src/components/comments/*`, `src/app/admin/comments/page.tsx`, `src/app/profil/comments/page.tsx`
- Begeni islemleri: `src/actions/likeActions.ts`, `src/components/like/LikeButton.tsx`, `src/app/profil/likes/page.tsx`
- Favori islemleri: `src/actions/favoriteActions.ts`, `src/components/favorite/FavoriteButton.tsx`, `src/app/profil/favorites/page.tsx`
- Sifre sifirlama islemleri: `src/actions/passwordResetActions.ts`, `src/lib/mail.ts`, `src/app/forgot-password/page.tsx`, `src/app/reset-password/page.tsx`
- Seed islemi: `prisma/seed.ts`
