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
- Mobil ana menu, admin menu ve dar ekran tasma duzeltmeleri.
- Admin kullanici listesi: ad, email, rol ve kayit tarihi.
- Railway health endpointi, migration ve production bootstrap akisi.
- Production build, lint ve dinamik icerik render kontrolleri.

## Email Teslimati Durumu

- Railway Hobby/Trial planinda SMTP kapali oldugu icin Resend HTTPS API destegi eklendi.
- Admin test maili `bunediyola.destekdeneme@gmail.com` adresine basariyla teslim edildi.
- Hos geldin ve sifre sifirlama akislari Resend uzerinden calisiyor.
- Test modunda yalniz Resend hesap sahibine mail gonderilebilir.
- Tum kullanicilara mail icin ozel domain alinip Resend'de dogrulanmali.

## Yayin Oncesi Kalan Operasyonlar

- Ozel domain satin al ve ana domain olarak belirle.
- Domaini Resend'de dogrula; `RESEND_FROM` degerini ozel domaine gecir.
- Eski Railway ve Vercel baglantilarini devre disi birak.
- `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL` degerlerini ana domaine ayarla.
- Ozel domain ve SSL yonlendirmesini tamamla.
- Veritabani otomatik yedekleme politikasini belirle.
- Upload volume ve medya yedekleme politikasini belirle.
- Google Search Console ve analitik kurulumu yap.
- Sentry veya benzeri hata izleme ekle.
- Farkli gercek cihazlarda ana sayfa, auth modal, profil ve admin ekranlarini son kez kontrol et.
- Tum kritik akislari tek bir yayin oncesi kabul testiyle tekrar dogrula.

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
