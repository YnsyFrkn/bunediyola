import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "Hakkimizda | bunediyola",
  description: "bunediyola hakkinda kisa bilgi.",
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="bunediyola"
      title="Hakkimizda"
      description="Gundemi, kultur hayatini ve internetin ilginc taraflarini sade bir dille anlatan icerik platformu."
    >
      <div className="space-y-5 text-base leading-8">
        <p>
          bunediyola, okumasi kolay, paylasmasi keyifli ve merak duygusunu diri tutan
          icerikler uretmek icin tasarlandi.
        </p>
        <p>
          Amacimiz haber, teknoloji, kultur, mizah ve yasam basliklarini abartisiz,
          anlasilir ve duzenli bir deneyimle okura sunmak.
        </p>
      </div>
    </InfoPage>
  );
}
