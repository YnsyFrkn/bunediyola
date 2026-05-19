# Kullanici Eksikleri - Editorun Sectikleri

Tarih: 2026-04-29

## Amac

Ana sayfaya sadece okunma, begeni veya yorum sayisina bagli olmayan editoryal bir secim alani eklemek.

Bu alan kullaniciya su hissi verir:

- Site kendi icerigini secip oneriyor.
- Onemli yazilar kalabalik akis icinde kaybolmuyor.
- Ana sayfada Onedio/Donanim Haber benzeri daha kuratorlu bir vitrin olusuyor.

## Yapilanlar

### 1. Veritabani alani

`Post` modeline `isEditorPick` alani eklendi.

Yeni migrasyon:

- `prisma/migrations/20260429213000_add_editor_picks/migration.sql`

Migrasyon mevcut yayindaki ve okunmasi yuksek yazilari baslangic icin editor secimi olarak isaretler:

- `status = PUBLISHED`
- `deletedAt IS NULL`
- `viewCount >= 1000`

### 2. Admin formu

Admin yazi formuna `Editorun Secimi` checkbox alani eklendi.

Dosya:

- `src/components/admin/PostForm.tsx`

Admin artik bir yaziyi editor secimi olarak isaretleyebilir veya isareti kaldirabilir.

### 3. Kaydetme akisi

Yazi olusturma ve guncelleme akisinda editor secimi bilgisi kaydediliyor.

Dosyalar:

- `src/actions/postActions.ts`
- `src/actions/editorPickActions.ts`
- `src/validations/postSchema.ts`

Prisma Client Windows DLL kilidi nedeniyle yeni alan normal Prisma model sorgusuna baglanmadi; bu alan raw SQL ile okunup yaziliyor. Boylece Prisma Client yeniden uretilemese bile ozellik calisir.

### 4. Ana sayfa bolumu

Ana sayfaya `Editorun Sectikleri` bolumu eklendi.

Dosyalar:

- `src/components/home/EditorPicksSection.tsx`
- `src/app/page.tsx`

Bolum davranisi:

- Sadece yayindaki yazilar gosterilir.
- Silinmis yazilar gosterilmez.
- Editor secimi yoksa bolum kendini gizler.
- Ilk yazi buyuk kart, digerleri kompakt liste olarak gosterilir.

## Kontroller

Basarili:

- `npx prisma migrate deploy`
- `npm run lint`
- `npx tsc --noEmit`
- Ana sayfa HTTP kontrolu: `200`
- Ana sayfa HTML kontrolu: `Editorun Sectikleri` var
- Ana sayfa hata kontrolu: `PrismaClientKnownRequestError` yok

Basarisiz ama bilinen ortam sorunu:

- `npm run build`

Sebep:

```text
EPERM: operation not permitted, rename node_modules\.prisma\client\query_engine-windows.dll.node.tmp... -> query_engine-windows.dll.node
```

Bu hata onceki adimlarda da gorulen Windows Prisma DLL kilidiyle ayni.

## Yayin Oncesi Not

Bu ozellik kullanici deneyimi acisindan yayina alinabilir.

Yayina cikmadan once admin panelde en az 4-6 kaliteli yaziyi `Editorun Secimi` olarak isaretlemek iyi olur. Aksi halde alan bos kalabilir veya zayif icerikler one cikabilir.

## Siradaki Onerilen Adim

Kullanici odakli sirada iyi aday:

1. Yorum cevaplari.
2. Yorum begenme.
3. Gorus bildir / icerik oner butonu.

Kisa onerim: Once `Yorum cevaplari` yapilmali. Cunku yorum sistemi zaten var ve kullanicilar arasinda daha dogal bir sohbet akisi olusturur.
