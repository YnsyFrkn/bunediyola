# Bunediyola Yapilacaklar Roadmap

Bu dokuman, kapsamli ozellik analizinden sonra uygulanacak isleri oncelik sirasina gore toplar. Amac her seyi ayni anda yapmak degil; yayina hazir, sonra daha eglenceli ve buyumeye uygun bir platforma adim adim ilerlemek.

## Durum Ozeti

Tamamlanan temel alanlar:

- Ana sayfa, kategori, arama ve yazi detay sayfalari.
- Admin icerik/kategori/yorum/bildirim/sikayet yonetimi.
- Kullanici kayit/giris, sifre sifirlama ve profil.
- Yorum, begeni, favori/kaydetme ve sikayet sistemi.
- Etiket, editorun sectikleri, okuma suresi, populer alanlar ve okuyucu hareketleri.
- SEO temel paketi: sitemap, robots, canonical, Open Graph/Twitter metadata.
- Yazi detay paylasim butonlari.
- KVKK ve reklam/is birligi sayfalari.
- `npm run lint`, `npx tsc --noEmit`, `npm run build` basarili.

## Faz 1 - Yayina Hazirlik Kapanisi

Bu faz, mevcut siteyi canliya alinabilir hale getirmek icin son operasyon ve kontrol isleridir.

- [ ] Production ortam bilgilerini netlestir.
  - `NEXT_PUBLIC_APP_URL`
  - `NEXTAUTH_URL`
  - `AUTH_SECRET`
  - `DATABASE_URL`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

- [ ] Domain ve SSL kontrolu yap.
  - Domain dogru hostinge bakmali.
  - HTTPS aktif olmali.
  - HTTP istekleri HTTPS'e yonlenmeli.

- [ ] Production veritabani hazirligini tamamla.
  - Migrationlar production DB'ye uygulanmali.
  - Admin hesabi guvenli sifreyle olusturulmali.
  - Seed verisi gerekiyorsa kontrollu calistirilmali.

- [ ] Arama motoru ve analitik baglantilarini hazirla.
  - Google Search Console.
  - Google Analytics veya alternatif analitik.
  - Sitemap URL'i Search Console'a gonderilmeli.

- [ ] Yedekleme plani yaz.
  - Veritabani yedek sikligi.
  - Upload/media yedek plani.
  - Geri yukleme senaryosu.

- [ ] Son manuel yayin testi yap.
  - Ana sayfa.
  - Kategori sayfasi.
  - Arama.
  - Yazi detay.
  - Paylasim linkleri.
  - Login/kayit.
  - Yorum, begeni, favori.
  - Sikayet akisi.
  - Admin panel.

## Faz 2 - BuneDiyola Tepki Sistemi

Bu faz, klasik begeni sisteminin yanina siteye ozel tepki kimligi ekler.

- [ ] Tepki tiplerini netlestir.
  - `BUNE_YA`
  - `HARBI_MI`
  - `YOK_ARTIK`
  - `IYIYMIS`
  - `BOS_YAPMIS`
  - `KATILIYORUM`

- [ ] Prisma modelini tasarla.
  - `PostReaction`
  - `postId`
  - `userId`
  - `type`
  - `createdAt`
  - `updatedAt`
  - `@@unique([postId, userId])`

- [ ] Server actionlarini ekle.
  - Tepki verme.
  - Tepki degistirme.
  - Tepki kaldirma.
  - Yazinin tepki sayilarini getirme.
  - Kullanici mevcut tepkisini getirme.

- [ ] Yazi detayina tepki UI'i ekle.
  - Tepki butonlari.
  - Aktif tepki durumu.
  - Toplam sayilar.
  - Girissiz kullanici icin auth modal.

- [ ] Admin/rapor tarafinda gerekiyorsa tepki verilerini gostermeyi degerlendir.

- [ ] Kontroller.
  - Kullanici ayni yazida tek tepki verebilmeli.
  - Tepkisini degistirebilmeli.
  - Tekrar tiklayinca tepki kaldirilmali.
  - Girissiz kullanici login akisi bozulmamali.

## Faz 3 - Basit Anket Sistemi

Bu faz, kullanicinin tek tikla katilim gosterecegi hafif bir anket sistemi ekler.

- [ ] Anket veri modelini tasarla.
  - `Poll`
  - `PollOption`
  - `PollVote`

- [ ] Tekrar oy engeli stratejisini belirle.
  - Girisli kullanicida `userId`.
  - Girissiz kullanici desteklenecekse cookie veya ip hash.

- [ ] Public anket UI'i ekle.
  - Soru.
  - Secenekler.
  - Oy verdikten sonra yuzdeler.
  - Toplam oy sayisi.

- [ ] Admin anket yonetimini ekle.
  - Anket olusturma.
  - Secenek ekleme.
  - Aktif/pasif yapma.
  - Sonuclari gorme.

- [ ] Icerik detayina anket baglama stratejisini belirle.
  - Ilk etapta yazinin altinda tek anket.
  - Sonraki etapta blok editor icinde anket bloku.

## Faz 4 - Liste / Blok Icerik Sistemi

Bu faz, Onedio tarzi madde madde ve gorselli icerik deneyimini guclendirir.

- [ ] Icerik blok modelini belirle.
  - Ayrı `PostBlock` tablosu.
  - Ya da `contentJson` alani.

- [ ] Ilk blok tiplerini sec.
  - Baslik.
  - Paragraf.
  - Liste maddesi.
  - Gorsel.
  - Embed.
  - Alinti.

- [ ] Admin editor MVP'sini yap.
  - Blok ekleme.
  - Blok silme.
  - Blok siralama.
  - Liste maddesine gorsel ve aciklama ekleme.

- [ ] Public render katmanini ekle.
  - Mevcut eski `content` alanini desteklemeye devam et.
  - Yeni bloklu icerikleri farkli render et.

- [ ] Migration stratejisini belirle.
  - Eski yazilar bozulmamali.
  - Yeni yazilar bloklu sisteme gecebilir.

## Faz 5 - Medya Kutuphanesi

Bu faz, admin panelde kapak gorseli ve icerik gorsellerini daha duzenli yonetmeyi saglar.

- [ ] `Media` modeli tasarla.
  - `url`
  - `altText`
  - `type`
  - `size`
  - `uploadedBy`
  - `createdAt`

- [ ] Admin upload arayuzu ekle.
  - Gorsel secme.
  - Boyut/tip kontrolu.
  - Alt text girisi.
  - Gorseli kapak olarak secme.

- [ ] Production depolama stratejisini belirle.
  - Lokal disk sadece gelistirme icin.
  - Canli ortam icin Cloudinary/S3 benzeri servis.

## Faz 6 - Test / Quiz Motoru

Bu faz, viral buyume potansiyeli en yuksek moduldur.

- [ ] Quiz modellerini tasarla.
  - `Quiz`
  - `QuizQuestion`
  - `QuizOption`
  - `QuizResult`
  - `QuizAttempt`

- [ ] Ilk test turunu sec.
  - Kisilik testi once gelsin.
  - Bilgi testi ikinci etap olabilir.

- [ ] Public test akisini yap.
  - Baslatma ekrani.
  - Soru adimlari.
  - Ilerleme cubugu.
  - Sonuc ekrani.
  - Benzer test onerileri.

- [ ] Admin test editorunu yap.
  - Soru ekleme.
  - Secenek ekleme.
  - Sonuc tanimlama.
  - Skor mantigi.

- [ ] Sonuc paylasim karti planla.
  - Sosyal paylasima uygun sonuc metni.
  - Sonraki etapta gorsel kart uretimi.

## Faz 7 - Kullanici Bildirimleri ve Topluluk

Bu faz, kullaniciyi geri getiren topluluk ozelliklerini kapsar.

- [ ] `Notification` modelini kullanici bildirimlerine hazirla.
  - `userId` nullable veya ayri model.
  - Admin bildirimleri ile kullanici bildirimleri ayrilmali.

- [ ] Bildirim tetiklerini ekle.
  - Yoruma yanit.
  - Yorum begenisi.
  - Sikayetin sonuclanmasi.
  - Takip edilen kategori/yazar yeni icerigi.

- [ ] Yoruma yanit sistemini ekle.
  - `parentId`.
  - Maksimum derinlik siniri.
  - Cevap UI'i.

- [ ] Yorum begenisi ekle.
  - `CommentReaction` veya `CommentLike`.

## Faz 8 - Reklam, Analitik ve Operasyon

Bu faz, site trafik almaya basladiktan sonra profesyonellesme isleridir.

- [ ] Sponsorlu icerik etiketi ekle.
  - Post alanina `isSponsored`.
  - Sponsor marka adi opsiyonel.

- [ ] Reklam alanlari belirle.
  - Ana sayfa kart arasi.
  - Yazi detay ortasi.
  - Sidebar veya mobil alt alan.

- [ ] Analitik eventlerini planla.
  - Yazi goruntuleme.
  - Paylasim tiklamasi.
  - Tepki verme.
  - Anket oyu.
  - Test tamamlama.

- [ ] Hata izleme ekle.
  - Sentry veya benzeri arac.

- [ ] Admin audit log ekle.
  - Kim neyi olusturdu/duzenledi/sildi.

## En Yakin Uygulama Sirasi

Bu sirayla ilerlemek en mantikli gorunuyor:

1. BuneDiyola tepki sistemi.
2. Basit anket sistemi.
3. Liste/blok icerik sistemi.
4. Medya kutuphanesi.
5. Test/quiz motoru.
6. Kullanici bildirimleri.
7. Reklam/analitik/audit katmani.

## Her Faz Sonunda Calistirilacak Kontroller

- [ ] `npm run lint`
- [ ] `npx tsc --noEmit`
- [ ] `npm run build`
- [ ] Mobil gorunum kontrolu.
- [ ] Girissiz kullanici kontrolu.
- [ ] Girisli kullanici kontrolu.
- [ ] Admin panel kontrolu.
