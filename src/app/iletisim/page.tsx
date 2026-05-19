import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/InfoPage";
import { getAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Iletisim",
  description: "bunediyola ile iletisime gec.",
  alternates: {
    canonical: getAbsoluteUrl("/iletisim"),
  },
};

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Iletisim"
      title="Bize Ulas"
      description="Geri bildirim, is birligi ve genel talepler icin asagidaki kanallari kullanabilirsin."
    >
      <div className="space-y-5 text-base leading-8">
        <p>Email: hello@bunediyola.com</p>
        <p>Konum: Istanbul, Turkiye</p>
        <p>
          Okur geri bildirimleri, icerik onerileri ve teknik sorun bildirimleri icin
          mesajlarini bu adrese iletebilirsin.
        </p>
      </div>
    </InfoPage>
  );
}
