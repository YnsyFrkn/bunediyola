# Login Page Dokumani

Bu dokuman v2 sonunda admin login akisini, guvenlik kontrollerini ve v3 oncesi dogrulama adimlarini ozetler.

## Kapsam

- Login sayfasi: `src/app/login/page.tsx`
- Login formu: `src/components/auth/LoginForm.tsx`
- Auth kurulumu: `src/lib/auth.ts`
- Route korumasi: `src/lib/auth.config.ts`, `proxy.ts`, `src/app/admin/layout.tsx`
- Login validasyonu: `src/validations/loginSchema.ts`
- Sifre islemleri: `src/lib/password.ts`

## Akis

1. Kullanici `/login` sayfasinda email ve sifre girer.
2. Client tarafinda `loginSchema` ile email/sifre bos mu ve email formati gecerli mi kontrol edilir.
3. Form `next-auth/react` icindeki `signIn("credentials")` ile credentials provider'a gider.
4. Server tarafinda `src/lib/auth.ts` icindeki `authorize` tekrar `loginSchema` ile gelen veriyi dogrular.
5. Kullanici email ile veritabaninda aranir.
6. Sadece `ADMIN` rolundeki kullanicilar kabul edilir.
7. Sifre `bcrypt.compare` ile hash karsisinda dogrulanir.
8. Basarili giriste JWT session olusturulur ve kullanici guvenli redirect hedefiyle `/admin` alanina gider.

## Guvenlik Kontrolleri

- Sifreler veritabaninda hashli tutulur.
- Login hatasinda teknik detay gosterilmez; kullaniciya genel `Email veya sifre hatali.` mesaji doner.
- Basarisiz ve basarili giris denemeleri `LoginAttempt` tablosuna kaydedilir.
- Ayni email icin 15 dakika icinde 5 basarisiz denemeden sonra login gecici olarak reddedilir.
- Admin olmayan kullanici admin paneline alinmaz.
- `/admin` route'lari `proxy.ts` uzerinden NextAuth authorized callback ile korunur.
- `src/app/admin/layout.tsx` icinde ikinci bir server-side rol kontrolu vardir.
- Zaten admin olarak oturum acmis kullanici `/login` sayfasina gelirse `/admin` sayfasina yonlendirilir.
- Redirect hedefi sadece `/admin` ile baslayan yerel admin path'lerine izin verecek sekilde sinirlandirilmistir.

## Gerekli Ortam Degiskenleri

`.env` icinde su alanlar tanimli olmalidir:

```bash
DATABASE_URL=""
AUTH_SECRET=""
NEXTAUTH_URL=""
ADMIN_EMAIL=""
ADMIN_PASSWORD=""
```

`ADMIN_EMAIL` ve `ADMIN_PASSWORD`, `npm run prisma:seed` sirasinda ilk admin kullanicisini olusturmak veya guncellemek icin kullanilir.

## V2 Kontrol Durumu

Login akisi v2 icin saglam kabul edilebilir:

- Client ve server validasyonu var.
- Credentials provider admin rolunu kontrol ediyor.
- Parola kontrolu hash uzerinden yapiliyor.
- Login denemeleri DB uzerinden loglaniyor.
- Kisa sureli deneme limiti var.
- Admin route'lari hem proxy hem layout seviyesinde korunuyor.
- Basarisiz girislerde hesap/parola ayrimi yapan detayli hata mesaji yok.

## V3 veya Prod Oncesi Sertlestirme Notlari

Bunlar mevcut v2 login akisinda engelleyici eksik degil, fakat canli ortam icin iyi sonraki adimlardir:

- Admin session suresi ve cookie ayarlari prod ihtiyacina gore netlestirilebilir.
- `AUTH_SECRET` guclu ve sadece ortam degiskeni olarak saklanmalidir.
- Prod ortamda `NEXTAUTH_URL` gercek domain olmalidir.
- Uzun vadede eski `LoginAttempt` kayitlarini temizleyen periyodik is eklenebilir.

## Dogrulama Komutlari

```bash
npm run lint
npm run build
npx prisma migrate status
```

Build alirken PostgreSQL servisinin `DATABASE_URL` icindeki adreste calistigindan emin olun.
