import Link from "next/link";

import { categories } from "@/data/categories";

import { Container } from "./Container";

const siteLinks = [
  { href: "/hakkimizda", label: "Hakkimizda" },
  { href: "/iletisim", label: "Iletisim" },
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikasi" },
  { href: "/kvkk-aydinlatma-metni", label: "KVKK" },
  { href: "/kullanim-sartlari", label: "Kullanim Sartlari" },
  { href: "/cerez-politikasi", label: "Cerez Politikasi" },
  { href: "/reklam-ve-is-birligi", label: "Reklam ve Is Birligi" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-[#111827] text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Link href="/" className="font-heading text-3xl">
            bunediyola
          </Link>
          <p className="max-w-md text-base leading-7 text-[#d1d5db]">
            bunediyola, gundemden mizaha kadar bircok konuda keyifli icerikler sunan
            yeni nesil icerik platformudur.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Kategoriler</h3>
          <div className="grid gap-2 text-sm text-[#d1d5db]">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="transition hover:text-[#fdba74]"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Site</h3>
          <div className="grid gap-2 text-sm text-[#d1d5db]">
            {siteLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[#fdba74]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Iletisim</h3>
          <div className="space-y-2 text-sm leading-7 text-[#d1d5db]">
            <p>Okuyucu geri bildirimleri ve is birligi icin:</p>
            <p>hello@bunediyola.com</p>
            <p>Istanbul, Turkiye</p>
          </div>
        </div>
      </Container>
      <Container className="border-t border-white/10 py-5 text-sm text-[#9ca3af]">
        (c) 2026 bunediyola. Tum haklari saklidir.
      </Container>
    </footer>
  );
}
