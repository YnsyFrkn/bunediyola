import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/InfoPage";
import { getAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reklam ve Is Birligi",
  description: "bunediyola reklam, sponsorluk ve is birligi iletisim bilgileri.",
  alternates: {
    canonical: getAbsoluteUrl("/reklam-ve-is-birligi"),
  },
};

export default function AdvertisingPage() {
  return (
    <InfoPage
      eyebrow="Is Birligi"
      title="Reklam ve Is Birligi"
      description="Markalar, ajanslar ve icerik ortaklari icin reklam ve is birligi kanallari."
    >
      <div className="space-y-5 text-base leading-8">
        <p>
          bunediyola; sponsorlu icerik, kategori is birlikleri, native reklam alanlari ve
          marka destekli ozel dosyalar icin is birligi taleplerini degerlendirebilir.
        </p>
        <p>
          Sponsorlu veya reklam niteligindeki icerikler, okuyucu guvenini korumak icin
          acik bicimde etiketlenmelidir.
        </p>
        <p>
          Reklam ve is birligi talepleri icin proje ekibine `hello@bunediyola.com`
          adresinden ulasilabilir.
        </p>
      </div>
    </InfoPage>
  );
}
