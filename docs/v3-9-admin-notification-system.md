# v3.9 Admin Bildirim Sistemi

Bu dokuman v3.9 kapsaminda eklenen admin paneli bildirim sisteminin ozetidir.

## Kapsam

- Yeni yorum olustugunda admin bildirimi olusur.
- Yeni kullanici kaydoldugunda admin bildirimi olusur.
- Admin panelde `/admin/notifications` sayfasi eklendi.
- Bildirimler `tumu`, `okunmamis` ve `okunmus` olarak filtrelenebilir.
- Tek bildirim okundu yapilabilir.
- Tum okunmamis bildirimler tek islemle okundu yapilabilir.
- Admin header alaninda okunmamis bildirim sayisi gorunur.
- Admin sidebar icine `Bildirimler` linki eklendi.
- Admin dashboard icine okunmamis bildirim karti eklendi.
- Bildirim listesine 20 kayitlik pagination eklendi.
- Admin listeleri icin ortak numarali pagination bileseni eklendi.
- 30 gunden eski bildirimleri temizleyen cleanup stratejisi eklendi.
- Sistemde maksimum 1000 bildirim tutulacak sekilde limit eklendi.
- Ayni olay icin kisa surede tekrar bildirim uretimini azaltan `dedupeKey` eklendi.
- Bildirim tarihleri kullanici dostu goreli formatta gosterilir.
- Bildirim silme islemi soft delete olarak calisir; kayit fiziksel olarak silinmez.
- Bildirim olusturma transaction icinde ve conflict durumunda retry ile calisir.
- Yeni kullanici bildiriminde gereksiz hedef linki gosterilmez.
- Yeni yorum bildiriminde public yaziyi gorme ve admin yorumlari yonetme aksiyonlari ayridir.

Bu surumde email, push notification, websocket ve kullaniciya ozel bildirim sistemi eklenmedi. Bildirimler yalnizca admin panel icindedir.

## Veritabani

Yeni tablo: `Notification`

| Alan | Aciklama |
| --- | --- |
| `id` | Bildirim kaydinin benzersiz id degeri. |
| `type` | Bildirim tipi. |
| `title` | Bildirim basligi. |
| `message` | Bildirim aciklamasi. |
| `targetUrl` | Adminin gidebilecegi ilgili sayfa. |
| `dedupeKey` | Ayni olaydan gelen tekrar bildirimleri azaltmak icin opsiyonel anahtar. |
| `isRead` | Okundu / okunmadi durumu. |
| `deletedAt` | Soft delete zamani. Null ise aktif bildirimdir. |
| `createdAt` | Bildirim olusma zamani. |
| `updatedAt` | Son guncelleme zamani. |

Yeni enum: `NotificationType`

| Deger | Aciklama |
| --- | --- |
| `NEW_COMMENT` | Yeni yorum bildirimi. |
| `NEW_USER` | Yeni kullanici kaydi bildirimi. |
| `SYSTEM` | Ileride kullanilabilecek sistem bildirimi. |
| `REPORT_CREATED` | Ileride sikayet/moderasyon bildirimi icin. |
| `SYSTEM_ALERT` | Ileride sistem uyarilari icin. |
| `ERROR` | Ileride hata bildirimleri icin. |

Indexler:

- `@@index([isRead, createdAt])`
- `@@index([type, createdAt])`
- `@@index([dedupeKey, createdAt])`
- `@@index([deletedAt, createdAt])`

Migration:

- `20260427010500_add_notifications`
- `20260427013000_harden_notifications`
- `20260427015000_notification_soft_delete`

## Server Action'lar

Yeni dosya: `src/actions/notificationActions.ts`

Eklenen fonksiyonlar:

- `createNotification`
- `getAdminNotifications`
- `getUnreadNotificationCount`
- `markNotificationAsRead`
- `markAllNotificationsAsRead`
- `deleteNotification`

Admin okuma ve guncelleme action'lari `ensureAdminSession()` ile korunur. Public akislardan sadece bildirim olusturma kullanilir.

Bildirim listeleme:

- Her sayfada 20 bildirim doner.
- Varsayilan siralama `createdAt desc` seklindedir.
- Query parametreleri: `/admin/notifications?filter=unread&page=2`

Bildirim temizleme:

- Yeni bildirim olusturma sirasinda 30 gunden eski bildirimler temizlenir.
- Toplam bildirim sayisi 1000'i asarsa en eski kayitlar silinir.
- `dedupeKey` varsa ayni anahtar icin 10 dakika icinde yeni bildirim uretimi engellenir.
- Temizlik ve silme islemleri fiziksel silme yerine `deletedAt` alanini doldurur.
- Bildirim olusturma `Serializable` transaction ile calisir ve transaction conflict durumunda 3 kez denenir.

## Yorum Bildirimi

`src/actions/commentActions.ts` icinde `createComment` basarili sekilde yorum kaydettikten sonra admin bildirimi olusturur.

Bildirim ornegi:

- Baslik: `Yeni yorum geldi`
- Mesaj: `Kullanici, "Yazi basligi" yazisina yorum yapti.`
- Hedef: `/yazi/[slug]`
- Tip: `NEW_COMMENT`

Bildirim olusturma hatasi yorum gonderimini bozmaz. Hata sadece server tarafinda loglanir.

Admin bildirim kartinda yeni yorum icin iki ayri aksiyon vardir:

- `Yazida gor`: yorumu public yazi detayinda gormek icin.
- `Yorumlari yonet`: admin yorum moderasyon sayfasina gitmek icin.

## Kullanici Kaydi Bildirimi

`src/actions/userAuthActions.ts` icinde `registerUser` basarili kullanici kaydindan sonra admin bildirimi olusturur.

Bildirim ornegi:

- Baslik: `Yeni kullanici kaydoldu`
- Mesaj: `email@example.com siteye katildi.`
- Tip: `NEW_USER`

Bildirim olusturma hatasi kullanici kaydini bozmaz. Hata sadece server tarafinda loglanir.

Yeni kullanici icin henuz admin kullanici detay sayfasi olmadigindan hedef link uretilmez.

## Admin Arayuzu

Yeni sayfa:

- `src/app/admin/notifications/page.tsx`

Yeni componentler:

- `src/components/admin/NotificationBadge.tsx`
- `src/components/admin/NotificationFilters.tsx`
- `src/components/admin/NotificationItem.tsx`
- `src/components/admin/NotificationList.tsx`
- `src/components/admin/NotificationPagination.tsx`
- `src/components/admin/AdminPagination.tsx`
- `src/utils/formatRelativeDate.ts`

Guncellenen componentler:

- `src/components/admin/AdminHeader.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/app/admin/page.tsx`

Admin bildirim sayfasinda:

- Bildirim basligi
- Mesaj
- Tarih
- Tip
- Okundu / okunmadi durumu
- Ilgili sayfaya git linki
- Bildirim tipine gore anlamli aksiyon metni
- Okundu yap aksiyonu
- Sil aksiyonu
- Tumunu okundu yap aksiyonu
- Onceki / sonraki sayfa kontrolleri

gorunur.

## Guvenlik

- `/admin/notifications` admin layout altindadir ve sadece admin oturumu ile acilir.
- Bildirim listeleme ve okundu yapma action'lari `ensureAdminSession()` kontrolu kullanir.
- Normal kullanici veya girissiz ziyaretci admin bildirimlerini goremez.
- Server action'lar dogrudan POST ile cagrilabilecegi icin yetki kontrolu action icinde yapilir.

## Kontrol

- `npx prisma generate` basarili.
- `npx prisma migrate dev` basarili.
- `npx prisma migrate status` veritabani semasinin guncel oldugunu gosterdi.
- `npm run lint` basarili.
- `npm run build` basarili.

## Eklenmesi Faydalı Olabilecekler

Bu surum icin zorunlu degil, fakat sonraki adimlarda dusunulebilir:

- Admin bildirimlerinde toplu silme butonu.
- Okunmamis bildirim sayisini sidebar linkinde de gostermek.
- Bildirim tipine gore ikon veya renk ayrimi.
- Kritik sistem hatalari icin `SYSTEM_ALERT` ve `ERROR` tiplerini otomatik ureten altyapi.
- v3.10 sikayet/moderasyon sistemi tamamlaninca `REPORT_CREATED` bildirimi uretmek.

## Sonraki Asama

Onerilen sonraki surum:

- `v3.10` sikayet / moderasyon sistemi.

Bildirim altyapisi hazir oldugu icin yorum veya icerik sikayetleri de admin panelde bildirim uretebilir.
