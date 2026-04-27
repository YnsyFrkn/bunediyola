# bunediyola v3.2 Comment System

Bu dokuman v3.2 kapsaminda eklenen yorum sistemini anlatir.

## Kapsam

v3.2 ile eklenenler:

- `Comment` Prisma modeli.
- Yazilara public yorum listesi.
- Giris yapan kullanicilar icin yorum formu.
- Giris yapmayan kullanicilar icin giris/kayit cagrisi.
- Admin yorum yonetimi.
- Admin yorum gizleme ve geri alma.
- Profilde kullanicinin kendi yorumlarini gormesi.

## Yeni Route'lar

| Route | Amac |
| --- | --- |
| `/admin/comments` | Admin yorum yonetimi |
| `/profil/comments` | Kullanici kendi yorumlari |

Guncellenen route:

- `/yazi/[slug]`: Yazi detayinda yorum bolumu gosterir.
- `/profil`: Yorumlarim karti ve linki eklendi.

## Yeni Dosyalar

- `src/actions/commentActions.ts`
- `src/validations/commentSchema.ts`
- `src/components/comments/CommentSection.tsx`
- `src/components/comments/CommentForm.tsx`
- `src/components/comments/CommentList.tsx`
- `src/components/comments/CommentItem.tsx`
- `src/components/comments/LoginToComment.tsx`
- `src/components/admin/CommentStatusBadge.tsx`
- `src/components/admin/CommentAdminActions.tsx`
- `src/app/admin/comments/page.tsx`
- `src/app/profil/comments/page.tsx`

Guncellenen dosyalar:

- `prisma/schema.prisma`
- `src/components/post/PostDetail.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/app/profil/page.tsx`
- `src/components/auth/UserMenu.tsx`
- `src/components/home/HeroSection.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `docs/database-schema.md`

## Veritabani

Yeni model:

```prisma
model Comment {
  id        String        @id @default(cuid())
  content   String
  postId    String
  userId    String
  post      Post          @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  status    CommentStatus @default(VISIBLE)
  deletedAt DateTime?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}
```

Yeni enum:

- `CommentStatus.VISIBLE`
- `CommentStatus.HIDDEN`

Migration:

- `20260426155218_add_comments`

## Yorum Ekleme Kurallari

`createComment` su kontrolleri yapar:

- Kullanici giris yapmis olmali.
- `userId` client'tan alinmaz, session icinden alinir.
- Post gercekten var olmali.
- Post `PUBLISHED` olmali.
- Post soft delete edilmemis olmali.
- Yorum 3 ile 1000 karakter arasinda olmali.
- Yorum `VISIBLE` olarak olusturulur.

Basarili yorumdan sonra revalidate edilen path'ler:

- `/yazi/[slug]`
- `/profil`
- `/profil/comments`
- `/admin/comments`

## Public Yorum Alani

`CommentSection`, yazinin altinda calisir.

Gorevleri:

- Yazinin gorunur yorumlarini getirir.
- Session durumunu kontrol eder.
- Giris varsa `CommentForm` gosterir.
- Giris yoksa `LoginToComment` gosterir.
- Yorum listesini `CommentList` ile basar.

Public tarafta sadece:

- `status = VISIBLE`
- `deletedAt = null`

yorumlar gosterilir.

## Admin Yorum Yonetimi

Route:

```txt
/admin/comments
```

Admin sayfasinda:

- Yorum icerigi kisa hali.
- Kullanici.
- Bagli yazi.
- Durum.
- Tarih.
- Detaya git.
- Gizle veya geri al aksiyonu.

Admin aksiyonlari:

- `hideComment`: `status = HIDDEN`, `deletedAt = Date`
- `restoreComment`: `status = VISIBLE`, `deletedAt = null`

Her iki action da `ensureAdminSession()` kullanir.

## Profil Yorumlari

Route:

```txt
/profil/comments
```

Giris yoksa:

```txt
/giris?callbackUrl=/profil/comments
```

Kullanici kendi yorumlarini, bagli yaziyi, tarihi ve durumu gorur.

## Guvenlik

- Yorum yazma icin session gerekir.
- `userId` formdan alinmaz.
- Draft ve silinmis yazilara yorum yapilamaz.
- Public tarafta gizli/silinmis yorum gosterilmez.
- Admin yorum aksiyonlari admin kontrolu yapar.
- Normal kullanici `/admin/comments` alanina giremez.

## Dogrulama Komutlari

```bash
npm run lint
npm run build
npx prisma migrate status
```

Son kontrolde uc komut da temiz gecmistir.

## Manuel Kontrol Durumu

Kontrol edilenler:

- `/yazi/1` sayfasinda yorum bolumu gorunuyor.
- Public yazida gorunur yorumlar listeleniyor.
- Guncel DB durumunda `2` gorunur yorum, `0` gizli yorum, toplam `2` yorum var.
- `/admin/comments` girissiz durumda `/login` korumasina dusuyor.
- `/profil/comments` girissiz durumda `/giris?callbackUrl=/profil/comments` korumasina dusuyor.
- Dev server log'u son yeniden baslatmadan sonra temiz.

Test yorumlari:

- `çok köktü bir içerik`
- `v3.2 yorum sistemi test yorumu: Bu yorum public yazida gorunmeli.`

## Son Kontrolde Yapilan Ek Duzeltmeler

Yorum sistemi sonrasi genel kontrolde su pürüzler giderildi:

- `UserMenu`, `/api/auth/session` yaniti `null` oldugunda artik hata firlatmiyor.
- Ana sayfadaki hero kartinda link icinde link ureten kategori badge yapisi duzeltildi.
- Global `scroll-behavior: smooth` kaldirildi; Next.js 16 dev uyarisi temizlendi.
- Root layout'a `data-scroll-behavior="smooth"` attribute'u eklendi.

## Sonraki Asama

v3.3 icin mantikli sonraki konu like/begeni sistemidir.
