# bunediyola v2 Current State

Bu dokuman v2 sonunda projenin guncel durumunu v3'e gecis icin tek yerde toplar. Kodun ana kaynaklari `src`, veritabani modeli `prisma/schema.prisma`, migration gecmisi `prisma/migrations` altindadir.

## Genel Ozet

`bunediyola`, Onedio benzeri genel icerik sitesi olarak basladi ve v2 sonunda PostgreSQL + Prisma destekli admin paneli olan bir icerik yonetim yapisina donustu.

v2 sonunda mevcut olan ana parcalar:

- Public ana sayfa, kategori sayfasi, yazi detay sayfasi ve arama sayfasi.
- PostgreSQL + Prisma veri modeli.
- Post ve kategori icin admin CRUD akislari.
- Soft delete ve geri alma mantigi.
- Admin login sayfasi.
- NextAuth credentials tabanli admin girisi.
- Hashli parola saklama.
- Admin route korumasi.
- Login deneme loglari ve kisa sureli deneme limiti.
- Seed sistemi ile ilk kategori/yazi/admin olusturma.

## Teknoloji Stack

| Alan | Teknoloji |
| --- | --- |
| Framework | Next.js `16.2.4` |
| UI | React `19.2.4` |
| Dil | TypeScript |
| Stil | Tailwind CSS 4 |
| ORM | Prisma `6.19.3` |
| Veritabani | PostgreSQL |
| Auth | NextAuth `5.0.0-beta.31` |
| Sifre hash | bcryptjs |
| Seed runner | tsx |
| Lint | ESLint 9 + eslint-config-next |

## Next.js Notu

Bu projede Next.js 16 kullaniliyor. Repo kokundeki `AGENTS.md` uyarisi geregi Next.js ile ilgili kod yazarken `node_modules/next/dist/docs/` altindaki ilgili dokumanlar kontrol edilmeli. V2 icinde `proxy.ts` kullaniliyor; bu Next 16'da eski middleware kavraminin yerine gecen dosya adidir.

## Ortam Degiskenleri

`.env.example` icindeki gerekli alanlar:

```bash
DATABASE_URL=""
AUTH_SECRET=""
NEXTAUTH_URL=""
ADMIN_EMAIL=""
ADMIN_PASSWORD=""
```

Alanlarin gorevi:

- `DATABASE_URL`: PostgreSQL baglanti adresi. Yerelde mevcut DB `localhost:5433` uzerinden kullaniliyor.
- `AUTH_SECRET`: NextAuth session/JWT imzalama icin gizli anahtar.
- `NEXTAUTH_URL`: Uygulamanin base URL'i. Prod ortamda gercek domain olmali.
- `ADMIN_EMAIL`: Seed sirasinda admin kullanici email'i.
- `ADMIN_PASSWORD`: Seed sirasinda admin kullanicinin sifresi. DB'ye duz hali yazilmaz, hashlenir.

## Komutlar

`package.json` scriptleri:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:start
npm run db:stop
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run prisma:seed
```

Tipik yerel calisma:

```bash
npm install
npm run db:start
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Kontrol komutlari:

```bash
npm run lint
npm run build
npx prisma migrate status
```

Son kontrolde bu komutlar temiz gecmistir.

## Public Site Sayfalari

| Route | Dosya | Gorev |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Ana sayfa. Hero, kategoriler, one cikanlar, son eklenenler, populer icerikler. |
| `/arama` | `src/app/arama/page.tsx` | Arama sayfasi. Baslik, ozet, kategori, yazar ve icerik uzerinden arama yapar. |
| `/kategori/[slug]` | `src/app/kategori/[slug]/page.tsx` | Kategoriye gore yazi listesi. |
| `/yazi/[slug]` | `src/app/yazi/[slug]/page.tsx` | Yazi detay sayfasi. |
| `/_not-found` | `src/app/not-found.tsx` | Ozel 404 sayfasi. |

Public veri okuma katmani:

- `src/lib/content.ts`
- `src/actions/postActions.ts`
- `src/actions/categoryActions.ts`

Not: `src/lib/content.ts`, admin/server action katmanindan gelen DB kayitlarini public `Post` ve `Category` tiplerine map eder.

## Admin Panel

Admin ana route'lari:

| Route | Dosya | Gorev |
| --- | --- | --- |
| `/admin` | `src/app/admin/page.tsx` | Dashboard. Toplam yazi, yayindaki yazi, taslak, kategori sayilari ve son yazilar. |
| `/admin/posts` | `src/app/admin/posts/page.tsx` | Yazi listesi, silme, geri alma, aktif/silinen filtreleri. |
| `/admin/posts/create` | `src/app/admin/posts/create/page.tsx` | Yeni yazi ekleme. |
| `/admin/posts/[id]/edit` | `src/app/admin/posts/[id]/edit/page.tsx` | Yazi duzenleme. |
| `/admin/categories` | `src/app/admin/categories/page.tsx` | Kategori listesi, silme, geri alma, aktif/silinen filtreleri. |
| `/admin/categories/create` | `src/app/admin/categories/create/page.tsx` | Yeni kategori ekleme. |
| `/admin/categories/[id]/edit` | `src/app/admin/categories/[id]/edit/page.tsx` | Kategori duzenleme. |

Admin bilesenleri:

- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/AdminHeader.tsx`
- `src/components/admin/AdminTable.tsx`
- `src/components/admin/AdminStatCard.tsx`
- `src/components/admin/AdminStatusBadge.tsx`
- `src/components/admin/AdminNotice.tsx`
- `src/components/admin/AdminActionForm.tsx`
- `src/components/admin/PostForm.tsx`
- `src/components/admin/CategoryForm.tsx`
- `src/components/admin/FormStatusMessage.tsx`
- `src/components/admin/EmptyState.tsx`

Admin islemler:

- Post islemleri: `src/actions/postActions.ts`
- Kategori islemleri: `src/actions/categoryActions.ts`
- Auth islemleri: `src/actions/authActions.ts`

Admin action'larda `ensureAdminSession()` ile yetki kontrolu yapilir.

## Login ve Auth

Login sayfasi:

- `src/app/login/page.tsx`
- `src/components/auth/LoginForm.tsx`

Auth kurulumu:

- `src/lib/auth.ts`
- `src/lib/auth.config.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `proxy.ts`
- `src/app/admin/layout.tsx`

Login akisi:

1. Kullanici `/login` sayfasinda email ve sifre girer.
2. Client tarafinda `loginSchema` ile temel validasyon yapilir.
3. `next-auth/react` icindeki `signIn("credentials")` cagrilir.
4. Server tarafinda NextAuth credentials provider `authorize` fonksiyonu calisir.
5. Email tekrar validate edilir.
6. Ayni email icin son 15 dakikadaki basarisiz deneme sayisi kontrol edilir.
7. Deneme limiti asildiysa `login_rate_limited` kodu ile cevap doner.
8. Kullanici DB'de email ile aranir.
9. Sadece `ADMIN` rolundeki kullanicilar kabul edilir.
10. Girilen sifre, DB'deki `passwordHash` ile `bcrypt.compare` uzerinden kontrol edilir.
11. Basarili giriste JWT session olusur ve kullanici `/admin` alanina gider.

Login formunda mevcut ozellikler:

- Email input.
- Sifre input.
- Sifreyi `Goster/Gizle` butonu.
- Bos email/sifre validasyon mesajlari.
- Yanlis email/sifre icin genel mesaj.
- Deneme limiti icin ayri mesaj.

Login hata mesajlari:

- Normal hata: `Email veya sifre hatali.`
- Deneme limiti: `Cok fazla hatali giris denemesi yapildi. Lutfen 15 dakika sonra tekrar dene.`

Guvenlik:

- Sifreler duz metin olarak DB'de tutulmaz.
- Sifre hash'i `User.passwordHash` alaninda tutulur.
- Admin olmayan kullanici admin panele giremez.
- `/admin` route'lari `proxy.ts` ile korunur.
- `src/app/admin/layout.tsx` icinde ikinci server-side rol kontrolu vardir.
- Server action'larda da admin session kontrolu vardir.
- Login denemeleri `LoginAttempt` tablosuna yazilir.

Daha detayli login dokumani:

- `docs/login-page.md`

## Veritabani

Prisma schema:

- `prisma/schema.prisma`

Tablolar:

- `Category`
- `Post`
- `User`
- `LoginAttempt`

Enum'lar:

- `PostStatus`: `DRAFT`, `PUBLISHED`
- `UserRole`: `ADMIN`, `USER`

Daha detayli tablo dokumani:

- `docs/database-schema.md`

### Category

Kategori bilgilerini tutar.

Ana alanlar:

- `id`: primary key.
- `name`: kategori adi.
- `slug`: unique URL slug'i.
- `description`: opsiyonel aciklama.
- `deletedAt`: soft delete zamani.
- `createdAt`, `updatedAt`: zaman alanlari.

### Post

Yazi bilgilerini tutar.

Ana alanlar:

- `id`: primary key.
- `title`: baslik.
- `slug`: unique URL slug'i.
- `summary`: kisa ozet.
- `content`: detay metni.
- `coverImage`: kapak gorseli yolu.
- `author`: yazar.
- `status`: `DRAFT` veya `PUBLISHED`.
- `viewCount`: goruntulenme/populerlik sayaci.
- `categoryId`: kategori foreign key'i.
- `deletedAt`: soft delete zamani.
- `createdAt`, `updatedAt`: zaman alanlari.

### User

Kullanici/admin hesaplarini tutar.

Ana alanlar:

- `id`: primary key.
- `name`: opsiyonel isim.
- `email`: unique email.
- `passwordHash`: hashlenmis sifre.
- `role`: `ADMIN` veya `USER`.
- `createdAt`, `updatedAt`: zaman alanlari.

### LoginAttempt

Login denemelerini tutar.

Ana alanlar:

- `id`: primary key.
- `email`: denenen email.
- `success`: deneme basarili mi?
- `reason`: sonuc kodu.
- `ipAddress`: request IP bilgisi, varsa.
- `userAgent`: tarayici/istemci bilgisi, varsa.
- `createdAt`: deneme zamani.

Mevcut `reason` degerleri:

- `SUCCESS`
- `UNKNOWN_EMAIL`
- `NOT_ALLOWED_FOR_LOGIN_TYPE`
- `INVALID_PASSWORD`
- `RATE_LIMITED`

Deneme limiti:

- `src/lib/auth.ts` icinde tanimli.
- 15 dakika icinde 5 basarisiz denemeden sonra login reddedilir.

## Migration Gecmisi

| Migration | Gorev |
| --- | --- |
| `20260424183819_init_v2` | `Category`, `Post`, `PostStatus` ve temel post-category iliskisi. |
| `20260424192925_soft_delete_undo` | `Category.deletedAt` ve `Post.deletedAt` alanlari. |
| `20260424201631_add_user_auth` | `User`, `UserRole`, `passwordHash`. |
| `20260426150628_login_attempts` | `LoginAttempt` tablosu ve indexleri. |
| `20260426155218_add_comments` | `Comment`, `CommentStatus`, post/user yorum iliskileri. |

Migration durumu son kontrolde guncel:

```bash
npx prisma migrate status
```

Sonuc: database schema up to date.

## Seed

Seed dosyasi:

- `prisma/seed.ts`

Seed su islemleri yapar:

- `src/data/categories.ts` icindeki kategorileri upsert eder.
- `src/data/posts.ts` icindeki yazilari upsert eder.
- `.env` icindeki `ADMIN_EMAIL` ve `ADMIN_PASSWORD` ile admin kullaniciyi upsert eder.
- Admin sifresini `hashPassword` ile hashler.

Seed komutu:

```bash
npm run prisma:seed
```

## Mock DB Fallback

`src/lib/mockDb.ts`, `DATABASE_URL` yoksa uygulamanin mock veriyle calisabilmesi icin vardir.

Post ve kategori action'lari DB yoksa mock fonksiyonlara duser:

- `getMockPosts`
- `createMockPost`
- `updateMockPost`
- `softDeleteMockPost`
- `restoreMockPost`
- `getMockCategories`
- `createMockCategory`
- `updateMockCategory`
- `softDeleteMockCategory`
- `restoreMockCategory`

Not: Auth/login DB kullanir; admin login icin gercek `User` kaydi gerekir.

## Validation

Validasyon dosyalari:

- `src/validations/loginSchema.ts`
- `src/validations/postSchema.ts`
- `src/validations/categorySchema.ts`

Login:

- Email bos olamaz.
- Email formati gecerli olmali.
- Sifre bos olamaz.

Post:

- Post formundan gelen alanlar server tarafinda parse edilir.
- Slug benzersizlik kontrolu action tarafinda yapilir.

Category:

- Kategori formundan gelen alanlar server tarafinda parse edilir.
- Slug benzersizlik kontrolu action tarafinda yapilir.

## Soft Delete ve Geri Alma

Post ve kategori silme islemleri fiziksel delete yapmaz.

- Aktif kayit: `deletedAt = null`
- Silinmis kayit: `deletedAt = Date`

Post:

- Silme: `deletePost`
- Geri alma: `restorePost`

Kategori:

- Silme: `deleteCategory`
- Geri alma: `restoreCategory`

Kategori silme onemli kural:

- Kategoriye bagli aktif post varsa kategori silinmez.
- Kullaniciya `category-has-posts` mesaji gosterilir.

## Cache ve Revalidation

Post/kategori create, update, delete ve restore islemlerinden sonra ilgili path'ler revalidate edilir.

Kullanilan API:

- `revalidatePath` from `next/cache`

Ornek revalidate hedefleri:

- `/admin`
- `/admin/posts`
- `/admin/categories`
- `/`
- `/arama`
- `/kategori/[slug]`
- `/yazi/[slug]`
- Spesifik eski/yeni yazi ve kategori slug path'leri.

## UI ve Tasarim Durumu

Public taraf:

- Genel icerik sitesi yapisi.
- Header, footer, container, post grid/card/detail bilesenleri.
- SVG tabanli post gorselleri `public/images/posts` altinda.
- Logo `public/images/logo/bunediyola-mark.svg`.
- Yazi detaylarinda v3.2 yorum bolumu.

Admin taraf:

- Sol sidebar.
- Dashboard kartlari.
- Tablo tabanli post/kategori yonetimi.
- Yorum yonetimi: `/admin/comments`.
- Notice/empty state bilesenleri.
- Create/edit formlari.

Login:

- Iki kolonlu giris sayfasi.
- Email/sifre formu.
- Sifre goster/gizle butonu.
- Guvenlik bilgilendirme kartlari.

## Bilinen Durumlar ve Notlar

- `README.md` halen v1 odakli olabilir; v3'e gecmeden veya v3 basinda README'nin bu dokumana gore guncellenmesi iyi olur.
- Build alirken PostgreSQL servisinin acik olmasi gerekir. DB kapaliysa Prisma page data/prerender adiminda hata verir.
- `git` komutu bu ortamda PATH'te gorunmedi; versiyon kontrol durumu terminalden dogrulanamadi.
- Prisma 7 major update bildirimi gorunuyor, ancak proje su anda Prisma 6.19.3 ile temiz calisiyor. V3 icin major upgrade ayri planlanmali.
- `LoginAttempt` kayitlari birikmeye baslar; v3/prod icin periyodik temizlik isi dusunulebilir.

## Son Dogrulama Durumu

Son yapilan kontroller:

```bash
npm run lint
npm run build
npx prisma migrate status
```

Durum:

- Lint temiz.
- Production build temiz.
- Prisma migration status temiz.
- DB schema guncel.

Son DB sayim kontrolunde temel tablolar:

- `Category`: 10
- `Post`: 14
- `User`: ortama gore degisir
- `Comment`: ortama gore degisir
- `LoginAttempt`: ortamda yapilan login denemelerine gore degisir.

## V3'e Gecis Icin Onerilen Baslangiclar

V3 icin iyi adaylar:

- README'yi v2/v3 durumuna gore guncellemek.
- Admin tarafina medya/gorsel yonetimi eklemek.
- Post editor deneyimini gelistirmek.
- Arama ve filtrelemeyi DB tarafinda daha guclu hale getirmek.
- Login deneme loglari icin admin gorunum veya log temizleme mekanizmasi eklemek.
- Session/cookie suresi ve prod auth ayarlarini netlestirmek.
- Test altyapisi eklemek.
- Prisma major upgrade'i ayri bir branch/plan ile degerlendirmek.

## Hemen Bakilacak Dokumanlar

- Login detaylari: `docs/login-page.md`
- DB tablo detaylari: `docs/database-schema.md`
- V2 current state: `docs/v2-current-state.md`
- V3.1 user auth: `docs/v3-1-user-auth.md`
- V3.2 comment system: `docs/v3-2-comment-system.md`
