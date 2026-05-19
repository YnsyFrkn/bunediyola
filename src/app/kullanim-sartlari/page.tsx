import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/InfoPage";
import { getAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kullanim Sartlari",
  description: "bunediyola kullanim sartlari.",
  alternates: {
    canonical: getAbsoluteUrl("/kullanim-sartlari"),
  },
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
