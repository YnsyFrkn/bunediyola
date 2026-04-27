# bunediyola v3.1 User Auth

Bu dokuman v3.1 kapsaminda eklenen normal kullanici kayit, giris ve profil akisini anlatir.

## Kapsam

v3.1 ile eklenenler:

- `/kayit`: normal kullanici kayit sayfasi.
- `/giris`: normal kullanici giris sayfasi.
- `/profil`: giris yapan kullanicinin profil baslangic sayfasi.
- Public header icin oturum durumuna gore kullanici menusu.
- NextAuth credentials icinde `loginType` ayrimi.
- Normal kullanicilar icin `USER` rol atamasi.

Admin login sistemi korunur:

- `/login`: admin girisi olarak kalir.
- `/admin`: sadece `ADMIN` rolundeki kullanicilara aciktir.

## Yeni Dosyalar

- `src/app/kayit/page.tsx`
- `src/app/giris/page.tsx`
- `src/app/profil/page.tsx`
- `src/actions/userAuthActions.ts`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/UserLoginForm.tsx`
- `src/components/auth/UserMenu.tsx`
- `src/validations/registerSchema.ts`
- `src/validations/userLoginSchema.ts`

Guncellenen ana dosyalar:

- `src/lib/auth.ts`
- `src/validations/loginSchema.ts`
- `src/components/auth/LoginForm.tsx`
- `src/actions/authActions.ts`
- `src/components/layout/Header.tsx`

## Route Karari

| Route | Amac |
| --- | --- |
| `/login` | Admin girisi |
| `/giris` | Normal kullanici girisi |
| `/kayit` | Normal kullanici kaydi |
| `/profil` | Giris yapan kullanici profili |
| `/admin` | Admin panel |

Admin login tasinmadi. Bu, v3.1'de risk azaltmak icin bilerek tercih edildi.

## Kayit Akisi

1. Kullanici `/kayit` sayfasini acar.
2. `RegisterForm` icinde ad soyad, email, sifre ve sifre tekrari girer.
3. `registerSchema` server action tarafinda formu dogrular.
4. Email daha once kullanildiysa kayit reddedilir.
5. Sifre `hashPassword` ile hashlenir.
6. Kullanici `UserRole.USER` roluyle olusturulur.
7. Kullanici `/giris?registered=1` sayfasina yonlendirilir.

Kayit validasyonlari:

- Ad soyad bos olamaz.
- Email bos olamaz.
- Email formati gecerli olmali.
- Sifre en az 8 karakter olmali.
- Sifre tekrari sifreyle ayni olmali.
- Email benzersiz olmali.

## Kullanici Giris Akisi

1. Kullanici `/giris` sayfasini acar.
2. Email ve sifre girer.
3. `UserLoginForm`, NextAuth `signIn("credentials")` cagrisi yapar.
4. Form `loginType: "user"` gonderir.
5. NextAuth `authorize` fonksiyonu `USER` veya `ADMIN` rolundeki kullanicilari kabul eder.
6. Basarili giriste kullanici `/` veya guvenli callback hedefe gider.

Normal kullanici girisinde admin path callback kabul edilmez. `/admin` ile baslayan hedefler `/` olarak degistirilir.

## Admin Giris Ayrimi

Admin login formu `loginType: "admin"` gonderir.

Kurallar:

- `loginType = "admin"` ise sadece `ADMIN` kabul edilir.
- `loginType = "user"` ise `USER` ve `ADMIN` kabul edilir.
- Normal `USER`, `/admin` alanina giremez.
- Admin, public siteye de girisli kullanici gibi girebilir.

## Profil Sayfasi

`/profil` sadece giris yapan kullanicilara aciktir.

Giris yoksa:

```txt
/giris?callbackUrl=/profil
```

sayfasina yonlendirilir.

Profilde gosterilen minimum bilgiler:

- Ad
- Email
- Rol
- Yakinda eklenecek yorum/begeni/favori alani

## Header Davranisi

Public header artik session durumuna gore degisir.

Giris yoksa:

- `Giris Yap`
- `Kayit Ol`

Giris varsa:

- `Profilim`
- `Cikis Yap`

Giris yapan kullanici `ADMIN` ise:

- `Admin Panel`

Header session bilgisini client tarafinda `/api/auth/session` endpointinden okur.

## Guvenlik

- Kullanici kaydinda rol formdan alinmaz.
- Yeni kullanici her zaman `USER` roluyle olusturulur.
- Sifre duz metin tutulmaz.
- DB'ye sadece `passwordHash` yazilir.
- User login ve admin login ayni provider icinde `loginType` ile ayrilir.
- Admin route korumasi devam eder.
- Profil route server tarafinda session kontrolu yapar.
- Login denemeleri `LoginAttempt` tablosuna yazilmaya devam eder.
- 15 dakika icinde 5 basarisiz deneme sonrasi login gecici reddedilir.

## Test Kriterleri

- `/kayit` acilir.
- Bos kayit formu Turkce hata verir.
- Gecersiz email reddedilir.
- 8 karakterden kisa sifre reddedilir.
- Sifre tekrari uyusmazsa hata verir.
- Yeni kullanici `USER` roluyle olusur.
- Ayni email ile ikinci kayit engellenir.
- `/giris` acilir.
- Yanlis email/sifre reddedilir.
- Dogru kullanici ile giris yapilir.
- Header giris durumuna gore degisir.
- `/profil` girissiz acilmaz.
- `/profil` girisli kullanicida acilir.
- Normal user `/admin` alanina giremez.
- Admin `/admin` alanina girmeye devam eder.
- Cikis yapinca session temizlenir.
- `npm run lint` temiz gecer.
- `npm run build` temiz gecer.
- `npx prisma migrate status` temiz gecer.

## Sonraki Asama

v3.1 tamamlandiktan sonra en dogru sonraki konu yorum sistemidir. Artik yorumlari `session.user.id` ile kullaniciya baglamak mumkundur.
