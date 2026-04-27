import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "Gizlilik Politikasi | bunediyola",
  description: "bunediyola gizlilik politikasi.",
};

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      eyebrow="Yasal"
      title="Gizlilik Politikasi"
      description="Kisisel verilerin hangi amaclarla islenebilecegini ve nasil korundugunu ozetler."
    >
      <div className="space-y-5 text-base leading-8">
        <p>
          bunediyola, hesap olusturma, yorum yapma, favori ve begeni gibi site
          ozelliklerini sunmak icin gerekli kullanici verilerini isleyebilir.
        </p>
        <p>
          Sifreler duz metin olarak saklanmaz. Sifre sifirlama tokenlari veritabaninda
          hash olarak tutulur ve sureleri doldugunda gecersiz hale gelir.
        </p>
        <p>
          Reklam, analytics veya ucuncu taraf izleme araclari devreye alindiginda bu
          politika ek detaylarla guncellenmelidir.
        </p>
      </div>
    </InfoPage>
  );
}
