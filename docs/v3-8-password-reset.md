# v3.8 Sifre Sifirlama Sistemi

Bu dokuman v3.8 kapsaminda eklenen gercek mail gonderimli sifre sifirlama akisinin ozetidir.

## Kapsam

- Kullanici ve admin giris formlarinda `Sifremi unuttum` linki eklendi.
- `/forgot-password` sayfasi email adresi ile sifre sifirlama istegi alir.
- Kayitli email varsa kullaniciya tek kullanimlik sifre sifirlama linki mail olarak gider.
- `/reset-password?token=...` sayfasi yeni sifre belirleme islemini yapar.
- Basarili sifre degisiminden sonra kullanici `/giris?reset=1` sayfasina yonlendirilir.

## Veritabani

Yeni tablo: `PasswordResetToken`

| Alan | Aciklama |
| --- | --- |
| `email` | Sifirlama isteyen kullanici email adresi. |
| `tokenHash` | Mail linkindeki raw tokenin SHA-256 hash degeri. |
| `ipAddress` | Istegin geldigi IP adresi. |
| `expiresAt` | Token gecerlilik bitis zamani. |
| `createdAt` | Token olusma zamani. |

Migration:

- `20260426212824_add_password_reset_tokens`
- `20260426224500_harden_password_reset`
- `20260426225500_invalidate_legacy_password_reset_tokens`

Token kurallari:

- Token suresi 30 dakikadir.
- Mailde raw token gonderilir, DB'de sadece token hash'i tutulur.
- Ayni email icin yeni istek geldiginde aktif eski tokenlar gecersiz hale getirilir.
- Sifre basariyla degisince token silinir.
- Gecersiz veya suresi dolmus token ile sifre degistirilemez.
- Suresi dolan tokenlar sifre sifirlama isteklerinde otomatik temizlenir.
- Hashleme oncesinden kalan eski reset linkleri migration ile gecersiz hale getirilir.

Rate limit tablosu: `PasswordResetRequest`

- Ayni email icin 15 dakikada maksimum 3 istek.
- Ayni IP icin 15 dakikada maksimum 5 istek.
- Eski rate limit kayitlari 24 saat sonra otomatik temizlenir.

## Mail Ayarlari

Mail gonderimi `nodemailer` ile yapilir. Gerekli ortam degiskenleri:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="site-mail-adresi@gmail.com"
SMTP_PASSWORD="gmail-app-password"
SMTP_FROM="bunediyola destek <site-mail-adresi@gmail.com>"
```

Gercek Gmail hesabi icin normal hesap sifresi degil, Google uygulama sifresi kullanilmalidir.

## Dosyalar

- `src/actions/passwordResetActions.ts`: Sifre sifirlama istegi ve yeni sifre kaydetme server action'lari.
- `src/lib/mail.ts`: SMTP transporter ve sifre sifirlama maili gonderimi.
- `src/validations/passwordResetSchema.ts`: Email, token ve yeni sifre validasyonlari.
- `src/components/auth/ForgotPasswordForm.tsx`: Email isteyen form.
- `src/components/auth/ResetPasswordForm.tsx`: Yeni sifre belirleme formu.
- `src/app/forgot-password/page.tsx`: Sifremi unuttum sayfasi.
- `src/app/reset-password/page.tsx`: Token ile sifre yenileme sayfasi.
- `src/components/auth/UserLoginForm.tsx`: Kullanici girisine sifremi unuttum linki ve basari mesaji.
- `src/components/auth/LoginForm.tsx`: Admin girisine sifremi unuttum linki.

## Guvenlik Notlari

- Kullanici bulunamasa bile public mesaj ayni tutulur. Boylece email adresi kayitli mi degil mi disaridan anlasilmaz.
- Sifre veritabaninda duz metin tutulmaz; yeni sifre `passwordHash` olarak kaydedilir.
- Sifre minimum 8 karakter olmalidir ve tekrar alaniyla eslesmelidir.
- Token unique ve tek kullanimliktir; raw token veritabaninda tutulmaz.
- Mail gonderimi basarisiz olursa olusturulan token temizlenir.
- Rate limit ile mail spam ve endpoint abuse riski azaltilir.

## Kontrol

- `npm run lint` basarili.
- `npm run build` basarili.
- `npx prisma migrate status` veritabani semasinin guncel oldugunu gosterdi.
- SMTP kimlik dogrulamasi basarili sekilde dogrulandi.
