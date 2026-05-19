# Yayın Öncesi Olması Gerekenler

Bu doküman, bunediyola yayına çıkmadan önce tamamlanması gereken kritik ürün, güvenlik ve kullanıcı deneyimi maddelerini kalıcı olarak not etmek için hazırlandı.

Amaç hızlı yayına çıkmak değil; kullanıcı gibi düşünüp eksik, güvensiz veya yarım hissettiren alanları yayından önce yakalamaktır.

## Kesinlikle Yayınlamadan Önce

### 1. Şikayet ve Moderasyon Sistemi

Bu aşama tamamlanmadan yayın yapılmamalı.

- İçerik bildirimi ve yorum bildirimi birbirinden ayrı çalışmalı.
- Kullanıcı bir yorumu bildirdiyse, aynı yazının kendisini de ayrıca bildirebilmeli.
- Kullanıcı aynı yorumu tekrar tekrar bildirememeli.
- Kullanıcı aynı içeriği tekrar tekrar bildirememeli.
- Şikayet göndermek için giriş gerekiyorsa, kullanıcı sayfadan kopmadan giriş modalıyla devam edebilmeli.
- Giriş yaptıktan sonra kullanıcı aynı içerikte kalıp şikayet formunu tamamlayabilmeli.
- Başarılı şikayet sonrası kullanıcı net bir onay mesajı görmeli.
- Admin panelde bekleyen şikayet sayısı görünmeli.
- Admin şikayetleri filtreleyebilmeli: bekleyen, incelendi, reddedildi, işlem yapıldı.
- Admin bildirilen yazıya veya yoruma kolayca ulaşabilmeli.
- Yeni şikayet geldiğinde admin bildirimi oluşmalı.

Önemli not:

Yorum bildirimi ile içerik bildirimi aynı şey değildir. Bir yorum sorunlu olabilir ama yazının kendisi sorunlu olmayabilir; tam tersi de olabilir. Bu yüzden sistem bu iki bildirimi ayrı haklar ve ayrı kayıtlar olarak ele almalı.

### 2. Kullanıcı Güven Akışı

- Giriş, kayıt, şifre sıfırlama ve çıkış akışları kırık olmamalı.
- Giriş yapmamış kullanıcı yorum, beğeni, kaydetme veya bildirme gibi aksiyonlarda sayfadan kopmamalı.
- Hata mesajları kullanıcıya ne yapması gerektiğini açık söylemeli.
- Başarılı işlemlerden sonra kullanıcıya güven veren kısa geri bildirim gösterilmeli.
- Kullanıcı kendi profil, yorum, beğeni ve kayıtlı içerik alanlarına sorunsuz erişebilmeli.

### 3. Admin Kontrolü

- Admin içerik oluşturma, düzenleme, taslak/yayın durumu değiştirme akışlarını sorunsuz kullanabilmeli.
- Admin kategori yönetimini sorunsuz kullanabilmeli.
- Admin yorumları gizleyebilmeli veya yönetebilmeli.
- Admin bildirimleri okunmuş yapabilmeli ve silebilmeli.
- Admin panelde temel sayılar doğru görünmeli.
- Admin olmayan kullanıcı admin paneline girememeli.

### 4. Temel Yayın Kalitesi

- Mobil görünüm temiz olmalı.
- Header, menü, arama, footer ve içerik detay sayfaları taşma yapmamalı.
- İçerik kartları ve detay sayfaları kullanıcıya yarım kalmış hissi vermemeli.
- Boş durumlar düzgün görünmeli: hiç yorum yok, hiç kayıtlı içerik yok, arama sonucu yok gibi.
- `npm run lint` başarılı olmalı.
- `npm run build` başarılı olmalı.

## Öncelikli Ama Yayın Bloklamayabilir

Bu maddeler kaliteyi ciddi artırır; ancak şikayet/moderasyon kadar yayın engelleyici değildir.

- Daha güçlü kategori menüsü.
- Gündem veya güncel konular satırı.
- Popüler/trend içerikler alanının daha görünür olması.
- Genel “Görüş Bildir” butonu.
- Ana sayfada öne çıkan içerik alanı.
- İçerik keşfini artıracak “benzer içerikler” ve “okumaya devam et” alanlarının güçlendirilmesi.

## Şimdilik Ertelenebilir

Bu alanlar rakip sitelerde var diye hemen yapılmak zorunda değil. İçerik ve kullanıcı güveni oturmadan eklenirse siteyi kalabalık gösterebilir.

- Dolar, euro, altın, borsa, kripto şeridi.
- Büyük mega menü.
- Manşet slider sistemi.
- Test, quiz veya anket altyapısı.
- Çok gelişmiş kişiselleştirme.
- Push bildirimleri.
- Mobil uygulama.

## Ürün Kararı

Sıradaki doğru aşama:

1. v3.10 şikayet/moderasyon sistemini sağlamlaştır.
2. İçerik bildirimi ve yorum bildirimi ayrımını kesin düzelt.
3. Admin şikayet yönetimini test et.
4. Sonra yayın öncesi kullanıcı deneyimi kontrolüne geç.

Kısa karar:

Şikayet ve moderasyon sistemi sağlam olmadan yayınlama.

