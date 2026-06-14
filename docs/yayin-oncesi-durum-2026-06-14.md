# Bunediyola Yayin Oncesi Durumu

Tarih: 14 Haziran 2026

Bu belge, eski roadmap ve kapsam analizindeki maddeleri mevcut kod ve canli ortamla
karsilastirarak guncel durumu tek yerde toplar.

## Tamamlanan Temel Alanlar

- Ana sayfa, kategori, arama ve yazi detay sayfalari.
- Guncel konular, editorun sectikleri, kategoriler ve one cikanlar.
- Okuyucu hareketleri, kisisel oneriler, son eklenenler ve populer icerikler.
- Admin yazi, kategori, yorum, bildirim ve sikayet yonetimi.
- Kullanici kayit, giris, cikis ve profil sistemi.
- Profil resmi yukleme ve Railway runtime avatar servisi.
- Yorum, yoruma yanit, begeni, favori ve sikayet akislari.
- Sifre sifirlama tokeni, sure siniri, tek kullanim ve istek limiti.
- Hos geldin ve sifre sifirlama email sablonlari.
- Etiket, okuma suresi, editor secimi ve benzer icerikler.
- WhatsApp, X, Facebook, Telegram ve link kopyalama paylasimlari.
- Sitemap, robots, canonical, Open Graph, Twitter ve Article JSON-LD.
- Gizlilik, cerez, kullanim sartlari, KVKK ve reklam/is birligi sayfalari.
- Dark theme, sistem tercihi ve tarayicida kalici tema secimi.
- Railway health endpointi, migration ve production bootstrap akisi.
- Production build, lint ve dinamik icerik render kontrolleri.

## Acik Kritik Konu

### Email Teslimati

Kod tarafinda email akislari mevcut. Ancak 14 Haziran 2026 tarihindeki SMTP
dogrulama testi Gmail tarafindan `535 BadCredentials` ile reddedildi.

Yapilmasi gereken:

1. Gmail hesabinda iki asamali dogrulamayi etkinlestir.
2. Google App Password olustur.
3. Railway `SMTP_PASSWORD` degerini normal hesap sifresi yerine App Password ile degistir.
4. Admin paneldeki `SMTP Baglantisini Test Et` butonuyla yeniden dogrula.
5. Gercek bir test kaydi ve sifre sifirlama istegiyle gelen kutusunu kontrol et.

SMTP duzeltilene kadar hesaplar acilir, ancak hos geldin maili garanti degildir.
Sifre sifirlama maili gonderilemezse kullaniciya hata doner ve token iptal edilir.

## Yayin Oncesi Kalan Operasyonlar

- Tek production Railway projesi ve tek ana domain belirle.
- Eski Railway ve Vercel baglantilarini devre disi birak.
- `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL` degerlerini ana domaine ayarla.
- Ozel domain ve SSL yonlendirmesini tamamla.
- Veritabani otomatik yedekleme politikasini belirle.
- Upload volume ve medya yedekleme politikasini belirle.
- Google Search Console ve analitik kurulumu yap.
- Sentry veya benzeri hata izleme ekle.
- Kayit, giris, sifre sifirlama ve email teslimatini gercek gelen kutusuyla test et.
- Mobil cihazlarda ana sayfa, auth modal, profil ve admin ekranlarini elle kontrol et.

## Sonraki Urun Fazlari

### Faz 2 - Bunediyola Tepki Sistemi

- Markaya ozel tepki tipleri.
- Tek kullanicinin tek aktif tepkisi.
- Tepki degistirme ve kaldirma.
- Yazi detayinda tepki sayilari.

### Faz 3 - Anket

- Poll, PollOption ve PollVote modelleri.
- Oy verme, tekrar oy engeli ve sonuc yuzdeleri.
- Admin anket yonetimi.

### Faz 4 - Blok Icerik Editoru

- Baslik, paragraf, liste maddesi, gorsel, alinti ve embed bloklari.
- Blok ekleme, silme ve siralama.
- Eski metin iceriklerle geriye uyumluluk.

### Faz 5 - Medya Kutuphanesi

- Admin gorsel yukleme arayuzu.
- Alt metin, tip ve boyut kontrolu.
- Cloudinary, S3 veya benzeri kalici medya servisi.

### Faz 6 - Test ve Quiz Motoru

- Quiz, soru, secenek, sonuc ve deneme modelleri.
- Kisilik ve bilgi testi akislari.
- Paylasilabilir sonuc kartlari.

### Faz 7 - Topluluk

- Kullanici bildirim merkezi.
- Yorum begenisi.
- Kategori, yazar veya kullanici takip sistemi.
- Sikayet sonucu bildirimi.

### Faz 8 - Buyume ve Operasyon

- Sponsorlu icerik etiketi ve reklam alanlari.
- Analitik eventleri ve admin raporlari.
- Admin audit log.
- Google ile giris.
- Genel performans ve cache stratejisi.
