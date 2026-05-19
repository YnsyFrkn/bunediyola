import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/InfoPage";
import { getAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "KVKK Aydinlatma Metni",
  description: "bunediyola KVKK aydinlatma metni.",
  alternates: {
    canonical: getAbsoluteUrl("/kvkk-aydinlatma-metni"),
  },
};

export default function KvkkPage() {
  return (
    <InfoPage
      eyebrow="Yasal"
      title="KVKK Aydinlatma Metni"
      description="Kisisel verilerin hangi kapsamda islenebilecegini ve kullanici haklarini aciklar."
    >
      <div className="space-y-5 text-base leading-8">
        <p>
          bunediyola, hesap olusturma, yorum yapma, favoriye alma, begeni, sikayet
          iletimi ve profil ozelliklerini sunmak icin gerekli kisisel verileri isleyebilir.
        </p>
        <p>
          Islenen veriler; ad, e-posta adresi, profil bilgileri, yorumlar, etkilesim kayitlari
          ve guvenlik amacli teknik kayitlarla sinirli olabilir.
        </p>
        <p>
          Kullanicilar kisisel verilerine iliskin bilgi talep etme, duzeltme, silme veya
          isleme amacina itiraz etme taleplerini iletisim kanallari uzerinden gonderebilir.
        </p>
        <p>
          Bu metin genel bilgilendirme amaclidir. Canli yayin oncesinde hukuki danismanlikla
          son halinin verilmesi onerilir.
        </p>
      </div>
    </InfoPage>
  );
}
