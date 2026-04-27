import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "Cerez Politikasi | bunediyola",
  description: "bunediyola cerez politikasi.",
};

export default function CookiePolicyPage() {
  return (
    <InfoPage
      eyebrow="Yasal"
      title="Cerez Politikasi"
      description="Sitede kullanilabilecek cerezlerin temel amaclarini aciklar."
    >
      <div className="space-y-5 text-base leading-8">
        <p>
          Cerezler oturum, guvenlik ve site deneyimini iyilestirme amaciyla
          kullanilabilir.
        </p>
        <p>
          Zorunlu cerezler giris, oturum ve guvenlik gibi temel islevlerin calismasini
          saglar.
        </p>
        <p>
          Analytics veya reklam cerezleri eklenirse bu sayfa ilgili araclara gore
          guncellenmelidir.
        </p>
      </div>
    </InfoPage>
  );
}
