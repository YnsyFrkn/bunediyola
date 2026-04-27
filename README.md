# bunediyola v1

Onedio benzeri genel icerik sitesi icin hazirlanmis ilk frontend iskeleti. Proje sade, modern ve internet kullanimi daha sinirli olan kullanicilarin da rahat gezebilecegi bir deneyim hedefiyle kuruldu.

## Kullanilan Teknolojiler

- Next.js App Router
- TypeScript
- Tailwind CSS
- Statik sahte veri yapisi

## Bu Surumde Neler Var

- Ana sayfa: hero alani, kategori bolumu, one cikanlar, son eklenenler ve populer icerikler
- Kategori sayfalari: slug tabanli listeleme ve bos durum mesaji
- Yazi detay sayfalari: kapak gorseli, yazar, tarih, kategori ve benzer icerikler
- Arama sayfasi: header search uzerinden baslik, ozet, kategori, yazar ve icerik metninde arama
- Ozel 404 sayfasi

## Veri Dosyalari

- `src/data/categories.ts`
- `src/data/posts.ts`

## Ana Sayfalar

- `src/app/page.tsx`
- `src/app/arama/page.tsx`
- `src/app/kategori/[slug]/page.tsx`
- `src/app/yazi/[slug]/page.tsx`

## Bilesen Yapisi

- `src/components/layout`: Header, Footer, Container
- `src/components/home`: ana sayfa bolumleri
- `src/components/post`: kart, grid ve detay yapilari
- `src/components/ui`: ortak arayuz parcalari

## Gelistirme

```bash
npm install
npm run dev
```

Ardindan `http://localhost:3000` adresini ac.

## Kontrol Komutlari

```bash
npm run lint
npm run build
```

## Sonraki Asama Icin Uygun Alanlar

- Gercek backend entegrasyonu
- PostgreSQL + Prisma gecisi
- Admin paneli
- Daha gelismis arama ve filtreleme
