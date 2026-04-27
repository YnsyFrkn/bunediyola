# bunediyola v3.5 Profile System

Bu dokuman v3.5 kapsaminda eklenen profil dashboard ve profil ayarlari sistemini anlatir.

## Kapsam

v3.5 ile eklenenler:

- Ortak profil layout'u.
- Tüm profil sayfalarinda görünen profil sidebar.
- Profil dashboard.
- Profil istatistik kartlari.
- Son aktiviteler alani.
- Profil ayarlari sayfasi.
- Ad soyad guncelleme formu.
- Profil guncelleme server action'i.
- Profil validasyonu.

## Route Yapisi

| Route | Amac |
| --- | --- |
| `/profil` | Profil dashboard |
| `/profil/comments` | Kullanici yorumlari |
| `/profil/likes` | Kullanici begenileri |
| `/profil/favorites` | Kullanici kaydettikleri |
| `/profil/settings` | Profil ayarlari |

## Yeni Dosyalar

- `src/app/profil/layout.tsx`
- `src/app/profil/settings/page.tsx`
- `src/actions/profileActions.ts`
- `src/components/profile/ProfileSidebar.tsx`
- `src/components/profile/ProfileHeader.tsx`
- `src/components/profile/ProfileStats.tsx`
- `src/components/profile/ProfileRecentActivity.tsx`
- `src/components/profile/ProfileForm.tsx`
- `src/validations/profileSchema.ts`
- `docs/v3-5-profile-system.md`

Guncellenen dosyalar:

- `src/app/profil/page.tsx`
- `src/app/profil/comments/page.tsx`
- `src/app/profil/likes/page.tsx`
- `src/app/profil/favorites/page.tsx`

## Profil Layout

Dosya:

```txt
src/app/profil/layout.tsx
```

Tum profil sayfalarini ortak layout ile sarar.

Masaustu:

- Sol sidebar.
- Sag icerik alani.

Mobil:

- Sidebar yatay menu gibi ustte akar.
- Icerik altta devam eder.

## Profil Sidebar

Dosya:

```txt
src/components/profile/ProfileSidebar.tsx
```

Menuler:

- Profilim
- Yorumlarim
- Begendiklerim
- Kaydettiklerim
- Ayarlar

Aktif sayfa `aria-current="page"` ve koyu buton stili ile belirginlestirilir.

## Profil Dashboard

Dosya:

```txt
src/app/profil/page.tsx
```

Dashboard alanlari:

- `ProfileHeader`
- `ProfileStats`
- `ProfileRecentActivity`
- Hizli baglantilar

Rol etiketleri teknik enum olarak gosterilmez:

- `USER` yerine `Kullanici`
- `ADMIN` yerine `Yonetici`

## Profile Actions

Dosya:

```txt
src/actions/profileActions.ts
```

Fonksiyonlar:

- `getCurrentUserProfile`
- `getProfileStats`
- `getRecentActivity`
- `updateUserProfile`

Guvenlik:

- `userId` client'tan alinmaz.
- `userId` formdan alinmaz.
- Tum islemler session kullanicisina gore calisir.

## Profile Stats

Gosterilen sayilar:

- `commentCount`
- `likeCount`
- `favoriteCount`

Like ve favorite sayilari sadece yayinda olan ve silinmemis yazilara gore hesaplanir.

## Recent Activity

Son aktivitelerde her alandan en fazla 5 kayit gosterilir:

- Son yorumlar
- Son begeniler
- Son kayitlar

Recent activity sadece:

- session kullanicisinin kayitlarini
- `PUBLISHED`
- `deletedAt = null`

yazilar icin gosterir.

## Profil Ayarlari

Route:

```txt
/profil/settings
```

Dosya:

```txt
src/app/profil/settings/page.tsx
```

Bu surumde:

- Ad soyad duzenlenebilir.
- Email readonly gosterilir.
- Email degisikligi kapali.

## Profil Validasyonu

Dosya:

```txt
src/validations/profileSchema.ts
```

Kurallar:

- `name` zorunlu.
- Minimum 2 karakter.
- Maksimum 50 karakter.

Basari mesaji:

```txt
Profil bilgilerin guncellendi.
```

Hata mesaji:

```txt
Profil guncellenemedi. Lutfen tekrar dene.
```

## Guvenlik

- Profil sayfalari giris gerektirir.
- Giris yoksa ilgili callback ile `/giris` sayfasina yonlenir.
- Baska kullanicinin verisi goruntulenmez.
- Profil update sadece session kullanicisini gunceller.
- Profil verileri public degildir.

## Bu Surumde Yapilmayanlar

- Profil fotografi.
- Email degistirme.
- Sifre degistirme.
- Username sistemi.
- Public profil sayfasi.
- Takip sistemi.
- Bildirim sistemi.
- Hesap silme.

## Dogrulama Komutlari

```bash
npm run lint
npm run build
```

Son kontrolde iki komut da temiz gecmistir.

## Eksiklerin Giderilmesi Kontrolu

`bunediyolav3-5-eksiklerin-giderilmesi.md` dokumanindaki maddeler kontrol edildi.

Kodda karsilananlar:

- Dashboard'da hic aktivite yoksa `Henuz aktiviten yok` empty state'i gosterilir.
- Recent activity bos aciklamasi kullaniciyi yorum yapmaya, begenmeye veya kaydetmeye yonlendirir.
- `/profil`, `/profil/comments`, `/profil/likes`, `/profil/favorites`, `/profil/settings` girissiz durumda ilgili callback URL ile `/giris` sayfasina yonlenir.
- Son aktiviteler `createdAt desc` ile listelenir.
- Yorumlarim, Begendiklerim ve Kaydettiklerim sayfalari en son kayit ustte olacak sekilde calisir.

Planlanan gelecek iyilestirmeler:

- `/profil/comments`, `/profil/likes`, `/profil/favorites` icin pagination veya infinite scroll.
- Profil dashboard icin trafik arttiginda caching/revalidation stratejisi.

Not:

- Bu veri hacminde pagination zorunlu gorulmedi; ancak buyuyen kullanici aktivitesinde ilk ele alinacak profil performans basligidir.

## Final Iyilestirme Kontrolu

`bunediyolav3-5-final-improvements.md` dokumanindaki son maddeler uygulandi.

Uygulananlar:

- Profil sayfalarindaki callback URL degerleri `encodeURIComponent` ile encode edilir.
- Recent activity limiti kategori basina maksimum 5 kayit olarak netlestirildi.
- Dashboard verileri `Promise.all` ile paralel cekilir.

Kontrol edilen route callback'leri:

- `/profil`
- `/profil/comments`
- `/profil/likes`
- `/profil/favorites`
- `/profil/settings`

## Sonraki Asama

Onerilen sonraki basliklar:

- v3.6 populer icerikler.
- v3.7 oneri sistemi.
- v4 SEO, performans ve yayin hazirligi.
