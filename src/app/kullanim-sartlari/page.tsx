import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "Kullanim Sartlari | bunediyola",
  description: "bunediyola kullanim sartlari.",
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Yasal"
      title="Kullanim Sartlari"
      description="Siteyi kullanirken uyulmasi beklenen temel kurallari ozetler."
    >
      <div className="space-y-5 text-base leading-8">
        <p>
          bunediyola uzerindeki icerikler bilgilendirme ve eglence amaclidir. Icerikler
          kaynak gosterilmeden ticari amacla kopyalanmamalidir.
        </p>
        <p>
          Kullanici yorumlari saygili, hukuka uygun ve spam icermeyen bir dilde
          yazilmalidir. Admin gerekli gordugu yorumlari gizleyebilir.
        </p>
        <p>
          Platformun guvenligini veya diger kullanicilarin deneyimini bozan kullanimlar
          sinirlandirilabilir.
        </p>
      </div>
    </InfoPage>
  );
}
