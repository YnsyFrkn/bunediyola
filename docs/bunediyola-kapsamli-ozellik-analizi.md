# Bunediyola Kapsamli Ozellik Dokumani Analizi

Kaynak dokuman: `C:\Users\PC\Downloads\bunediyola_kapsamli_ozellik_dokumani.docx`

Bu analiz, kaynak dokumandaki ozellikleri mevcut Bunediyola kod tabaniyla karsilastirir. Amac:

- Bizde zaten olanlari netlestirmek.
- Kismen olan alanlari ayirmak.
- Hic olmayan ozellikleri listelemek.
- Yayina cikis ve sonraki surumler icin en mantikli ekleme sirasini belirlemek.

Not: Analiz kod tabani uzerinden yapildi. `npm run lint` ve `npx tsc --noEmit` daha once basarili calisti. `npm run build` Next lockfile erisim hatasina takiliyor; bu analiz ozellik kapsamiyla ilgilidir, production build onayi ayrica kapatilmalidir.

## Kisa Sonuc

Mevcut proje, kaynak dokumandaki V1 temelinin onemli bolumunu karsiliyor:

- Ana sayfa, kategori, arama, yazi detay, admin icerik/kategori yonetimi var.
- Uye kayit/giris, sifre sifirlama, profil, yorum, begeni, favori, sikayet ve admin moderasyon var.
- Etiket, editorun sectikleri, populer/okuyucu hareketleri, okuma suresi ve onerilen icerikler eklenmis durumda.

Ancak Onedio tarzi platform karakterini guclendirecek en buyuk eksikler sunlar:

- Test/quiz motoru yok.
- Anket motoru yok.
- Paylasim sistemi ve zengin Open Graph/Social meta eksik.
- Liste/blok editoru yok; icerik tek `content` metni olarak tutuluyor.
- Medya kutuphanesi yok.
- Kullaniciya giden bildirim merkezi yok; bildirimler daha cok admin panel odakli.
- Siteye ozel tepki sistemi yok; su an klasik begeni var.
- Reklam, analitik, audit log, sitemap/robots gibi yayin-profesyonellesme parcalari eksik veya kismi.

## Bizde Olanlar

### Ana Sayfa ve Kesif

Mevcut durum:

- Ana sayfa var: `src/app/page.tsx`.
- Hero alani var: `HeroSection`.
- Son icerikler var: `LatestPosts`.
- Kategori bloklari var: `CategorySection`.
- One cikan/editor secimi var: `EditorPicksSection`, `isEditorPick`.
- Populer alan var: gunluk/haftalik populer hesaplari `popularActions.ts`.
- Trend etiketler var: `TrendingTopics`, `tagActions.ts`.
- Okuyucu hareketleri var: en cok yorumlanan ve en cok begenilen icerikler.
- Onerilen icerikler var: `recommendationActions.ts`.
- Bos veri durumunda ana sayfa kirilmiyor.

Kaynak dokumana gore durum: V1 ana sayfa beklentisinin buyuk kismi var.

### Icerik Detay

Mevcut durum:

- Yazi detay sayfasi var: `/yazi/[slug]`.
- Baslik, kapak gorseli, yazar, tarih, okuma suresi, kategori, ozet ve govde gosteriliyor.
- Etiketler detayda gosteriliyor.
- Benzer icerikler var.
- Yorum alani var.
- Icerik bildirme var.
- Begenme ve favoriye alma var.

Kaynak dokumana gore durum: Okuma deneyimi icin temel iyi. Ancak paylasim, OG meta, canonical ve bloklu icerik eksik.

### Kategori, Etiket ve Arama

Mevcut durum:

- Kategori modeli ve sayfalari var.
- Admin kategori ekleme/duzenleme/silme var.
- Etiket modeli var: `Tag`, `PostTag`.
- Admin post formunda etiket girisi var.
- Trend etiketler ana sayfada gosteriliyor.
- Arama sayfasi var ve kendi arama formu bulunuyor.
- Arama baslik/ozet/icerik/kategori/etiket mantigina yaklasiyor.

Kaynak dokumana gore durum: V1 icin yeterli; kesfet sayfasi ve daha gelismis filtreler yok.

### Uyelik ve Auth

Mevcut durum:

- Kullanici kaydi var.
- Kullanici girisi var.
- Admin girisi ve rol kontrolu var.
- NextAuth/Auth.js kullaniliyor.
- Sifreler hashleniyor.
- Sifremi unuttum ve token sertlestirme var.
- Login attempt kaydi ve basarisiz deneme siniri var.
- Girissiz kullanici aksiyonlarinda auth modal davranisi var.

Kaynak dokumana gore durum: E-posta/sifre tabanli uyelik iyi durumda. Google ile giris yok.

### Profil ve Kullanici Alanlari

Mevcut durum:

- Profil ana sayfasi var.
- Profil ayarlari var.
- Avatar yukleme var.
- Bio, sehir, ilce, dogum yili, cinsiyet alanlari var.
- Kullanici yorumlari, begenileri ve favorileri ayri sayfalarda gorulebiliyor.
- Son aktiviteler ve profil istatistikleri var.

Kaynak dokumana gore durum: Profil baslangici iyi. Gizlilik ayarlari, hesap silme, sifre degistirme ve test gecmisi yok.

### Etkilesim ve Moderasyon

Mevcut durum:

- Yorum yazma var.
- Yorum okuma var.
- Icerik begenme var.
- Icerik favorileme/kaydetme var.
- Icerik ve yorum sikayet etme var.
- Admin sikayet paneli var.
- Admin yorum gizleme/geri alma var.
- Admin bildirim paneli var.
- Yeni yorum, yeni kullanici ve sikayet gibi admin bildirimleri uretiliyor.

Kaynak dokumana gore durum: Etkilesim temelinin onemli kismi var. Yoruma yanit, yorum begenisi, reaksiyon tipleri ve kullanici bildirimleri yok.

### Admin Panel

Mevcut durum:

- Admin dashboard var.
- Icerik listeleme/olusturma/duzenleme/silme/geri alma var.
- Taslak/yayinda durumu var.
- Kategori yonetimi var.
- Yorum yonetimi var.
- Bildirim yonetimi var.
- Sikayet/rapor yonetimi var.
- Admin aksiyon formlarinda pending state var.
- Aktif yazisi olan kategoriyi silmeyi engelleme gibi guvenlikler var.

Kaynak dokumana gore durum: V1/V2 admin temeli iyi. Blok editoru, test editoru, anket editoru, medya kutuphanesi, SEO paneli, reklam paneli, kullanici yonetimi ve audit log yok.

### Hukuki Sayfalar

Mevcut durum:

- Gizlilik politikasi var.
- Cerez politikasi var.
- Kullanim sartlari var.
- Iletisim sayfasi var.
- Hakkimizda sayfasi var.

Kaynak dokumana gore durum: Temel hukuki sayfalar var. KVKK metni, reklam/is birligi sayfasi ve icerik kaldirma kanali ayri baslik olarak net degil.

## Kismen Olanlar

### Liste Icerik Sistemi

Mevcut durum:

- Post icerigi metin olarak tutuluyor.
- Paragraflar `\n\n` ile ayrilip detayda render ediliyor.
- Onedio tarzi liste hissi seed icerik metinleriyle kismen verilebilir.

Eksik:

- `content_blocks` veya JSON blok yapisi yok.
- Admin panelden liste maddesi ekleme/silme/siralama yok.
- Madde bazli gorsel, embed, quote, anket gibi bloklar yok.

Oneri: V1 sonu icin basit `PostBlock` modeli veya `contentJson` alani eklenmeli. Ilk etapta `paragraph`, `image`, `heading`, `listItem`, `embed` bloklari yeterli olur.

### SEO

Mevcut durum:

- Global metadata var.
- Yazi ve kategori sayfalarinda `generateMetadata` var.
- Slug yapisi var.

Eksik:

- Open Graph ve Twitter card alanlari detayli degil.
- Canonical URL yok.
- Sitemap ve robots dosyalari gorunmuyor.
- Article/Breadcrumb schema yok.
- Kapak gorseli alt text alani yok; genelde title alt olarak kullaniliyor.

Oneri: Yayina cikmadan once SEO temel paketi kapatilmali: `sitemap.ts`, `robots.ts`, canonical, OG image, Twitter card, Article schema.

### Paylasim

Mevcut durum:

- Paylasim butonu/link kopyalama sistemi kodda gorunmedi.

Kismi sayilabilecek nokta:

- Slug ile okunabilir yazi URL'leri var.

Eksik:

- WhatsApp, X, Facebook, Telegram paylasim linkleri yok.
- Link kopyala yok.
- Web Share API yok.
- Test sonuc karti gibi viral paylasim altyapisi yok.

Oneri: Kucuk ama etkisi yuksek bir V1 isi. `ShareButtons` client component'i eklenmeli.

### Bildirimler

Mevcut durum:

- Admin bildirim modeli ve paneli var.
- Yeni yorum, yeni kullanici, rapor gibi olaylar admin tarafina dusuyor.

Eksik:

- Kullaniciya ozel bildirim yok; `Notification` modelinde `userId` bulunmuyor.
- Yoruma cevap, yorum begenisi, takip edilen kategori/yazar gibi kullanici bildirimleri yok.
- E-posta bildirimi tercihleri yok.

Oneri: V3 icin `Notification.userId` nullable eklenip admin ve kullanici bildirimleri ayrilmali.

### Medya Yukleme

Mevcut durum:

- Profil avatar yukleme var.
- Avatar tip ve boyut kontrolu var.

Eksik:

- Admin medya kutuphanesi yok.
- Post kapak gorseli upload yok; URL/path elle giriliyor.
- Alt text, boyut, yukleyen admin bilgisi, gorsel tekrar kullanimi yok.
- Cloudinary/S3 gibi kalici depolama yok.

Oneri: V2/V3 icin once lokal admin medya kutuphanesi, sonra production icin Cloudinary/S3.

### Trend/Populer ve Oneriler

Mevcut durum:

- Gunluk/haftalik populer hesaplari var.
- Like/comment/favorite skoru ile populer hesaplanabiliyor.
- Trend etiketler var.
- Onerilen icerikler var.

Eksik:

- View event tablosu yok; `viewCount` statik/manuel veya seed kaynakli duruyor.
- Cache yok.
- Kisisel okuma gecmisi bazli akis yok.
- Arama terimleri veya event loglari yok.

Oneri: Yayindan sonra `PostView` veya hafif event log eklenmeli. Populer skor buna baglanmali.

## Bizde Olmayanlar

### Test / Quiz Motoru

Kaynak dokumanda cok kritik goruluyor, projede yok.

Eksik modeller:

- `Quiz`
- `QuizQuestion`
- `QuizOption`
- `QuizResult`
- `QuizAttempt`

Eksik ekranlar:

- Test listeleme/kesfet.
- Test detay/baslatma.
- Soru adimlari.
- Sonuc ekrani.
- Sonuc paylasimi.
- Admin test editoru.

Oneri: Bunediyola'nin Onedio tarzi kimligini guclendirecek en degerli yeni modul budur.

### Anket Motoru

Projede anket modeli ve oy verme akisi yok.

Eksik:

- `Poll`, `PollOption`, `PollVote`.
- Tekrar oy engeli.
- Sonuc yuzdeleri.
- Admin anket editoru.
- Icerik icine gomulu anket bloku.

Oneri: Quizden daha kucuk kapsamli oldugu icin once basit anket MVP'si de dusunulebilir.

### BuneDiyola Tepki Sistemi

Mevcut sistem klasik like.

Eksik:

- Bune ya, Harbi mi, Yok artik gibi reaksiyon tipleri.
- Kullanici basina tek reaksiyon.
- Reaksiyon degistirme.
- Reaksiyon sayilari.

Oneri: Like sisteminin ustune `PostReaction` modeliyle eklenebilir. Marka karakterini hizli artirir.

### Yoruma Yanit ve Yorum Begenisi

Mevcut `Comment` modelinde `parentId` yok.

Eksik:

- Nested yorum/yanit.
- Yanit derinlik siniri.
- Yorum begenisi veya yorum reaksiyonu.
- Yorum siralama: en yeni/en begenilen.

Oneri: Topluluk katmani icin V2/V3 isi.

### Takip, Rozet, Puan ve Topluluk

Eksik:

- Kullanici/yazar/kategori takip.
- Rozet/puan sistemi.
- Haftanin yorumu.
- Kullanici icerik onerisi.
- Gelismis profil ve topluluk sayfalari.

Oneri: Trafik ve yorum hacmi olusmadan ertelenebilir.

### Reklam ve Gelir Modeli

Eksik:

- Reklam alanlari.
- Sponsorlu icerik etiketi.
- Native reklam kartlari.
- Affiliate beyanlari.
- Reklam paneli.

Oneri: Yayin sonrasinda trafik oturmaya baslayinca V3 civari ele alinmali. Ancak sponsorlu icerik etiketi basit bir alan olarak erken eklenebilir.

### Analitik, Audit Log ve Operasyon

Eksik:

- Google Analytics/Search Console entegrasyon notu veya kodu.
- Kendi event loglari.
- Admin audit log.
- Sentry/hata izleme.
- Yedekleme plani.
- Rate limit katmani genel olarak yok; auth ve password reset tarafinda kismi koruma var.

Oneri: Yayina cikmadan once en az analitik, Search Console, hata izleme ve yedekleme plani belirlenmeli.

### Dark Mode

Projede koyu tema yok.

Oneri: Kritik degil. V3/V4'e ertelenebilir.

### Google ile Giris

Projede credentials tabanli auth var; Google provider yok.

Oneri: V2 sonu veya V3. Yorum/kaydetme kullanimini artirabilir.

## Onceliklendirilmis Ekleme Onerileri

### P0 - Yayina Cikmadan Once Kapatilmasi Iyi Olanlar

1. SEO ve sosyal paylasim temel paketi
   - `sitemap.ts`
   - `robots.ts`
   - canonical URL
   - Open Graph/Twitter card
   - Article schema
   - paylasimda kapak gorseli dogru cikma kontrolu

2. Paylasim butonlari
   - WhatsApp
   - X
   - Facebook
   - Telegram
   - link kopyala
   - mobilde Web Share API

3. Production build kilidi
   - `npm run build` su an Next lockfile erisim hatasina takiliyor.
   - Acik Node/Next surecleri ve dosya izinleri temizlenmeli.

4. Yayina cikis operasyon notu
   - Domain, SSL, env, migration, admin hesabı, yedekleme, analytics, Search Console adimlari tek dokumanda isaretlenmeli.

5. KVKK ve reklam/is birligi sayfalari
   - Gizlilik/cerez/kullanim/hakkimizda/iletisim var.
   - KVKK ve reklam/is birligi sayfasi ayri ve net eklenebilir.

### P1 - Bunediyola Karakterini Guclendirecek Ilk Paket

1. BuneDiyola tepki sistemi
   - Like kalsin ama marka reaksiyonlari eklensin.
   - `PostReaction` modeli: `postId`, `userId`, `type`.

2. Basit anket sistemi
   - Tek soru, cok secenek, oy yuzdeleri.
   - Icerik detayina gomulebilir veya ayri anket post tipi olabilir.

3. Liste/blok icerik MVP
   - Admin panelde klasik textarea yerine blok mantigi.
   - Ilk blok tipleri: baslik, paragraf, liste maddesi, gorsel, embed.

4. Medya kutuphanesi MVP
   - Admin kapak gorseli yukleyebilsin.
   - Alt text girilebilsin.
   - Dosya boyutu/tip kontrolu olsun.

### P2 - Viral Buyume Paketi

1. Test/quiz motoru
   - Kisilik testi ve bilgi testi desteklenmeli.
   - Sonuc ekrani paylasilabilir olmali.
   - Admin test editoru olmalı.

2. Test sonuc karti
   - Instagram/story oranina uygun sonuc gorseli uretimi.
   - Paylasim sistemiyle birlikte calismali.

3. Yoruma yanit ve yorum begenisi
   - `parentId` ve `CommentReaction` eklenebilir.
   - Yorum siralama eklenebilir.

4. Kullanici bildirimleri
   - Yoruma yanit, yorum begenisi, takip edilen konu gibi bildirimler.

### P3 - Buyume ve Profesyonellesme

1. Kullanici/yazar/kategori takip sistemi.
2. Rozet/puan sistemi.
3. Reklam paneli ve sponsorlu icerik etiketleri.
4. Analitik panel ve arama terimleri raporu.
5. Redis/cache veya baska cache stratejisi.
6. Dark mode.
7. Google ile giris.

## Kaynak Dokumandaki Backlogun Mevcut Durum Ozeti

| Ozellik | Durum | Not |
| --- | --- | --- |
| Hero / one cikan alan | Var | `HeroSection` |
| Trend algoritmasi | Kismen | Etiket/populer var, event/view temeli zayif |
| Son icerikler | Var | `LatestPosts` |
| Kategori bloklari | Var | `CategorySection` |
| Icerik detay | Var | Paylasim/OG eksik |
| Liste bloklari | Kismen | Duz metin var, blok editoru yok |
| Okuma suresi | Var | `readingTime.ts` |
| Ilgili icerikler | Var | Kategori bazli |
| Sosyal paylasim | Yok | Oncelikli eklenmeli |
| Link kopyalama | Yok | Paylasim paketi icinde |
| Yorum sistemi | Var | Yanit/siralama yok |
| Yoruma yanit | Yok | `parentId` yok |
| Yorum sikayet | Var | Report sistemi var |
| Yorum begeni | Yok | Ayrı model yok |
| Tepki sistemi | Yok | Like var ama marka reaksiyonu yok |
| Kaydetme/favori | Var | Profil favoriler sayfasi var |
| Kayit/giris | Var | Google yok |
| Google ile giris | Yok | Credentials var |
| Sifremi unuttum | Var | Sertlestirilmis |
| Profil sayfasi | Var | Gizlilik/hesap silme eksik |
| Bildirim merkezi | Kismen | Admin odakli |
| Test editoru | Yok | Yeni modul |
| Test cozum ekrani | Yok | Yeni modul |
| Test sonuc karti | Yok | Yeni modul |
| Anket sistemi | Yok | Yeni modul |
| Arama | Var | Baslangic icin yeterli |
| Etiket sistemi | Var | Admin post formunda mevcut |
| Kesfet sayfasi | Yok | Ana sayfa kesif bloklari var |
| Beni sasirt butonu | Yok | P3 |
| Dark mode | Yok | P2/P3 |
| Admin dashboard | Var | Temel metrikler var |
| Icerik editoru | Var | Blok editor degil |
| Medya kutuphanesi | Yok | Sadece avatar upload var |
| SEO paneli | Yok | Metadata kismi var |
| Kullanici yonetimi | Yok | Admin sadece dashboard/moderasyon |
| Reklam alanlari | Yok | Yeni modul |
| Sponsorlu icerik etiketi | Yok | Basit alanla eklenebilir |
| Analitik panel | Yok | Yeni modul |
| Sitemap | Yok | P0 |
| Robots | Yok | P0 |
| OG meta | Kismen/Yok | Title/description var, OG zayif |
| 404 sayfasi | Var | `not-found.tsx` |
| Hata loglama | Yok | Sentry vb. yok |
| Yedekleme | Yok | Operasyon plani gerekli |

## En Mantikli Sonraki 10 Is

1. Production build kilidini coz ve build'i yesile al.
2. SEO temel paketini ekle: sitemap, robots, canonical, OG/Twitter.
3. Paylasim butonlarini ekle.
4. KVKK ve reklam/is birligi sayfalarini ekle.
5. BuneDiyola tepki sistemini tasarla ve uygula.
6. Basit anket MVP'sini ekle.
7. Liste/blok icerik altyapisini tasarla.
8. Admin medya kutuphanesi MVP'sini ekle.
9. Test/quiz motoru icin schema ve ekran planini cikar.
10. Kullanici bildirimleri icin `Notification` modelini admin/kullanici ayrimina hazirla.

## Uygulama Notu

Her seyi ayni anda yapmak yerine iki rota daha saglikli olur:

1. Yayin rotasi: build, SEO, paylasim, hukuki sayfalar, operasyon checklist.
2. Karakter rotasi: tepki sistemi, anket, quiz, blok editoru.

Bu siralama hem siteyi daha erken yayina hazirlar hem de Bunediyola'nin Onedio tarzi eglenceli platform kimligini adim adim guclendirir.
